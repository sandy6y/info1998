import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { useAuth } from "../context/AuthContext";
import { getFirebaseStorage } from "../firebase/firebaseClient";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { BACKEND_BASE_PATH } from "../constants/Navigation";

type Post = {
  id: string;
  userId: string;
  userDisplayName: string;
  userProfilePic?: string;
  figureId: string;
  figureSeries: string;
  figureOrder: number;
  imageUrl: string;
  caption?: string;
  createdAt: string;
};

const FeedPage = () => {
  const { user, token } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [caption, setCaption] = useState("");
  const [uploading, setUploading] = useState(false);

  const fetchPosts = async () => {
    if (!user) return;
    try {
      const res = await fetch(`${BACKEND_BASE_PATH}/posts/user/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch posts");
      const data = await res.json();
      setPosts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [user]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !user) return;

    try {
      setUploading(true);
      console.log("Starting upload...");

      const storage = getFirebaseStorage();
      const fileRef = ref(storage, `posts/${user.id}/${Date.now()}-${selectedFile.name}`);
      console.log("Uploading to Firebase Storage...");

      await uploadBytes(fileRef, selectedFile);
      const downloadURL = await getDownloadURL(fileRef);
      console.log("File uploaded, URL:", downloadURL);

      // Send post info to backend
      console.log("Sending post to backend...");
      const res = await fetch(`${BACKEND_BASE_PATH}/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: user.id,
          figureId: "sp-001",
          imageUrl: downloadURL,
          caption,
        }),
      });

      console.log("Response status:", res.status);
      if (!res.ok) {
        const errorData = await res.json();
        console.error("Backend error:", errorData);
        throw new Error(errorData.error || "Failed to create post");
      }

      const result = await res.json();
      console.log("Post created:", result);

      setSelectedFile(null);
      setCaption("");
      fetchPosts(); // refresh posts
      alert("Post created successfully!");
    } catch (err: any) {
      console.error("Upload error:", err);
      alert(`Failed to upload post: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  if (!user) return <p>Please log in to view your posts.</p>;
  if (loading) return <p>Loading posts...</p>;

  return (
    <div className="feed-page">
      <h1>Your Figure Posts</h1>

      {/* Upload Form */}
      <form onSubmit={handleUpload} className="upload-form">
        <input type="file" accept="image/*" onChange={handleFileChange} required />
        <input
          type="text"
          placeholder="Add a caption..."
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />
        <button type="submit" disabled={uploading || !selectedFile}>
          {uploading ? "Uploading..." : "Post"}
        </button>
      </form>

      {/* Posts List */}
      <div className="posts-feed">
        {posts
          .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt))
          .map((post) => (
            <div key={post.id} className="post-card">
              <div className="post-header">
                {post.userProfilePic && (
                  <img src={post.userProfilePic} alt="profile" className="profile-pic" />
                )}
                <div>
                  <strong>{post.userDisplayName}</strong>
                  <div className="post-meta">
                    {post.figureSeries} #{post.figureOrder}
                  </div>
                  <div className="timestamp">
                    {new Date(post.createdAt).toLocaleString()}
                  </div>
                </div>
              </div>

              <img src={post.imageUrl} alt="figure" className="post-image" />
              {post.caption && <p className="caption">{post.caption}</p>}
            </div>
          ))}
      </div>
    </div>
  );
};

export default FeedPage;
