// PostsPage.tsx
import { useEffect, useState } from "react";

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

const PostsPage = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      const res = await fetch("http://localhost:8080/posts");

      if (!res.ok) throw new Error("Failed to fetch posts");

      const data = await res.json();
      setPosts(data);
    } catch (err) {
      console.error("Post fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  if (loading) return <p>Loading posts...</p>;

  if (posts.length === 0)
    return <p>No posts yet — be the first to share a figure!</p>;

  return (
    <div className="posts-page">
      <h1>Figure Posts</h1>

      <div className="posts-feed">
        {posts
          .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt))
          .map((post) => (
            <div key={post.id} className="post-card">
              <div className="post-header">
                {post.userProfilePic && (
                  <img
                    src={post.userProfilePic}
                    alt="profile"
                    className="profile-pic"
                  />
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

export default PostsPage;
