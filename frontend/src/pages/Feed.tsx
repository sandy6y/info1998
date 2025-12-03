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
  likesCount: number;
  commentsCount: number;
};

type Comment = {
  id: string;
  postId: string;
  userId: string;
  userDisplayName: string;
  userProfilePic?: string;
  text: string;
  createdAt: string;
};

const FeedPage = () => {
  const { user, token } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [caption, setCaption] = useState("");
  const [uploading, setUploading] = useState(false);
  const [comments, setComments] = useState<Record<string, Comment[]>>({});
  const [showComments, setShowComments] = useState<Record<string, boolean>>({});
  const [newComment, setNewComment] = useState<Record<string, string>>({});
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());

  const fetchPosts = async () => {
    if (!user) return;
    try {
      // Fetch all posts from all users
      const res = await fetch(`${BACKEND_BASE_PATH}/posts`, {
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

  const fetchUserLikes = async () => {
    if (!user) return;
    try {
      const res = await fetch(`${BACKEND_BASE_PATH}/posts/user/${user.id}/likes`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch user likes");
      const likedPostIds = await res.json();
      setLikedPosts(new Set(likedPostIds));
    } catch (err) {
      console.error("Fetch user likes error:", err);
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;

    try {
      const res = await fetch(`${BACKEND_BASE_PATH}/posts/${postId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to delete post");
      }

      alert("Post deleted successfully!");
      fetchPosts();
    } catch (err: any) {
      console.error("Delete post error:", err);
      alert(`Failed to delete post: ${err.message}`);
    }
  };

  const handleLike = async (postId: string) => {
    if (!user) return;

    try {
      const res = await fetch(`${BACKEND_BASE_PATH}/posts/${postId}/like`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId: user.id }),
      });

      if (!res.ok) throw new Error("Failed to toggle like");

      const result = await res.json();

      // Update liked status
      setLikedPosts(prev => {
        const newSet = new Set(prev);
        if (result.liked) {
          newSet.add(postId);
        } else {
          newSet.delete(postId);
        }
        return newSet;
      });

      // Refresh posts to get updated like count
      fetchPosts();
    } catch (err: any) {
      console.error("Like error:", err);
    }
  };

  const fetchComments = async (postId: string) => {
    try {
      const res = await fetch(`${BACKEND_BASE_PATH}/posts/${postId}/comments`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch comments");
      const data = await res.json();
      console.log(`Fetched ${data.length} comments for post ${postId}:`, data);
      setComments(prev => ({ ...prev, [postId]: data }));
    } catch (err) {
      console.error("Fetch comments error:", err);
    }
  };

  const toggleComments = (postId: string) => {
    const isShowing = showComments[postId];
    setShowComments(prev => ({ ...prev, [postId]: !isShowing }));

    if (!isShowing && !comments[postId]) {
      fetchComments(postId);
    }
  };

  const handleAddComment = async (postId: string) => {
    if (!user || !newComment[postId]?.trim()) return;

    try {
      const res = await fetch(`${BACKEND_BASE_PATH}/posts/${postId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: user.id,
          text: newComment[postId].trim(),
        }),
      });

      if (!res.ok) throw new Error("Failed to add comment");

      console.log("Comment added successfully, fetching updated comments...");
      setNewComment(prev => ({ ...prev, [postId]: "" }));
      await fetchComments(postId);
      fetchPosts(); // Refresh to update comment count
    } catch (err: any) {
      console.error("Add comment error:", err);
      alert(`Failed to add comment: ${err.message}`);
    }
  };

  useEffect(() => {
    fetchPosts();
    fetchUserLikes();
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

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
      <h1>Feed</h1>

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
        {posts.map((post) => (
          <div key={post.id} className="post-card">
            <div className="post-header">
              {post.userProfilePic && (
                <img src={post.userProfilePic} alt="profile" className="profile-pic" />
              )}
              <div>
                <strong>{post.userDisplayName}</strong>
                <div className="timestamp">
                  {new Date(post.createdAt).toLocaleString()}
                </div>
              </div>
            </div>

            <img src={post.imageUrl} alt="figure" className="post-image" />
            {post.caption && <p className="caption">{post.caption}</p>}

            {/* Like and Comment Buttons */}
            <div style={{ marginTop: '10px', display: 'flex', gap: '10px', alignItems: 'center' }}>
              <button
                onClick={() => handleLike(post.id)}
                style={{
                  padding: '8px 16px',
                  backgroundColor: likedPosts.has(post.id) ? '#007bff' : '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                ❤️ {post.likesCount}
              </button>

              <button
                onClick={() => toggleComments(post.id)}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                💬 {post.commentsCount}
              </button>

              {post.userId === user?.id && (
                <button
                  onClick={() => handleDeletePost(post.id)}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#dc3545',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Delete
                </button>
              )}
            </div>

            {/* Comments Section */}
            {showComments[post.id] && (
              <div style={{ marginTop: '15px', padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
                <h4>Comments</h4>

                {/* Add Comment */}
                <div style={{ marginBottom: '10px' }}>
                  <input
                    type="text"
                    value={newComment[post.id] || ""}
                    onChange={(e) => setNewComment(prev => ({ ...prev, [post.id]: e.target.value }))}
                    placeholder="Add a comment..."
                    style={{ width: '70%', padding: '8px', marginRight: '10px' }}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleAddComment(post.id);
                      }
                    }}
                  />
                  <button
                    onClick={() => handleAddComment(post.id)}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: '#28a745',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Post
                  </button>
                </div>

                {/* Comments List */}
                <div>
                  {comments[post.id]?.map((comment) => (
                    <div key={comment.id} style={{ padding: '8px 0', borderBottom: '1px solid #dee2e6', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                      {comment.userProfilePic && (
                        <img
                          src={comment.userProfilePic}
                          alt="profile"
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            objectFit: 'cover'
                          }}
                        />
                      )}
                      <div style={{ flex: 1 }}>
                        <strong>{comment.userDisplayName}</strong>
                        <p style={{ margin: '5px 0' }}>{comment.text}</p>
                        <small style={{ color: '#6c757d' }}>{new Date(comment.createdAt).toLocaleString()}</small>
                      </div>
                    </div>
                  ))}
                  {(!comments[post.id] || comments[post.id].length === 0) && (
                    <p style={{ color: '#6c757d' }}>No comments yet. Be the first to comment!</p>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeedPage;
