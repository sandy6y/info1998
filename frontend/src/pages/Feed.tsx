import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { useAuth } from "../context/AuthContext";
import { getFirebaseStorage } from "../firebase/firebaseClient";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

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
      const res = await fetch(`http://localhost:8080/posts/user/${user.id}`, {
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
      const storage = getFirebaseStorage();
      const fileRef = ref(storage, `posts/${user.id}/${Date.now()}-${selectedFile.name}`);
      await uploadBytes(fileRef, selectedFile);
      const downloadURL = await getDownloadURL(fileRef);

      // Send post info to backend
      const res = await fetch("http://localhost:8080/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: user.id,
          figureId: "custom-figure", // optional, adapt if you track figureId
          imageUrl: downloadURL,
          caption,
        }),
      });

      if (!res.ok) throw new Error("Failed to create post");
      setSelectedFile(null);
      setCaption("");
      fetchPosts(); // refresh posts
    } catch (err) {
      console.error(err);
      alert("Failed to upload post");
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
        <input type="file" accept="image/*" onChange={handleFileChange} />
        <input
          type="text"
          placeholder="Add a caption..."
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />
        <button type="submit" disabled={uploading}>
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
