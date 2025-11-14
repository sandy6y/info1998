import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

interface CollectedFigure {
  figureId: string;
  collectedAt: string;
  order: number;
  userImageUrl?: string;
  isRevealed: boolean;
}

interface UserCollection {
  userId: string;
  figures: CollectedFigure[];
  updatedAt: string;
}

const Profile = () => {
  const { user } = useAuth();
  const [collection, setCollection] = useState<CollectedFigure[]>([]);
  const [loading, setLoading] = useState(true);

  // Keep track of revealed images locally
  const [revealedFigures, setRevealedFigures] = useState<string[]>([]);

  const fetchCollection = async () => {
    if (!user) return;
    try {
      const res = await fetch(`http://localhost:8080/collections/${user.id}`);
      const data: UserCollection = await res.json();
      setCollection(data.figures);
    } catch (error) {
      console.error("Error fetching collection:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollection();
  }, [user]);

  const handleAddFigure = async () => {
    if (!user) return;
    const figureId = prompt("Enter figure ID to add:");
    if (!figureId) return;

    try {
      const res = await fetch(
        `http://localhost:8080/collections/${user.id}/figures`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ figureId }),
        }
      );
      const data = await res.json();
      setCollection((prev) => [...prev, data.figure]);
    } catch (error) {
      console.error("Error adding figure:", error);
    }
  };

  const handleDeleteFigure = async (figureId: string) => {
    if (!user) return;

    try {
      await fetch(
        `http://localhost:8080/collections/${user.id}/figures/${figureId}`,
        { method: "DELETE" }
      );
      setCollection((prev) =>
        prev.filter((figure) => figure.figureId !== figureId)
      );
      setRevealedFigures((prev) =>
        prev.filter((id) => id !== figureId)
      ); // remove from revealed state
    } catch (error) {
      console.error("Error deleting figure:", error);
    }
  };

  //default is grayscale image, when clicked reveals color 
  const toggleReveal = (figureId: string) => {
    setRevealedFigures((prev) =>
      prev.includes(figureId)
        ? prev.filter((id) => id !== figureId)
        : [...prev, figureId]
    );
  };

  //require login to showcase collection 
  if (!user) return <p style={{ textAlign: 'center'}}>Please log in to view your profile.</p>;
  if (loading) return <p>Loading collection...</p>;

  return (
    <div style={{ textAlign: "center" }}>
      <h1>{user.displayName}'s Profile</h1>
      <p>Total figures collected: {collection.length}</p>
      <p>
        Note: These are mock data, later will update backend so users can 
        type in the figure id and the image will be the default image or they
        can name the figure and upload their own image.
      </p>
      <button onClick={handleAddFigure}>Add Figure</button>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          marginTop: "20px",
          gap: "10px",
        }}
      >
        {collection.map((figure) => {
          const isRevealed = revealedFigures.includes(figure.figureId);
          return (
            <div
              key={figure.figureId}
              style={{
                border: "1px solid black",
                borderRadius: "8px",
                padding: "10px",
                width: "150px",
              }}
            >
              <img
                src={figure.userImageUrl || "https://via.placeholder.com/100"}
                alt={figure.figureId}
                style={{
                  width: "100px",
                  height: "100px",
                  marginBottom: "10px",
                  cursor: "pointer",
                  filter: isRevealed ? "none" : "grayscale(100%)",
                  transition: "filter 0.3s ease",
                }}
                onClick={() => toggleReveal(figure.figureId)}
              />
              <p>{figure.figureId}</p>
              <p>Revealed: {isRevealed ? "Yes" : "No"}</p>
              <button onClick={() => handleDeleteFigure(figure.figureId)}>
                Delete
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Profile;