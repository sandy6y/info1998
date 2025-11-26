import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useCollected, CollectedFigure } from "../context/CollectedContext";

const Profile = () => {
  const { user } = useAuth();
  const { collectionBySeries, totalCount, addFigure, removeFigure, refreshCollection } = useCollected();
  const [loading, setLoading] = useState(true);
  const [revealedFigures, setRevealedFigures] = useState<string[]>([]);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    refreshCollection().finally(() => setLoading(false));
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  const toggleReveal = (figureId: string) => {
    setRevealedFigures((prev) =>
      prev.includes(figureId) ? prev.filter((id) => id !== figureId) : [...prev, figureId]
    );
  };

  const handleAddFigure = async () => {
    const figureId = prompt(
      "Enter figure ID to add (format: sp-001, echo-1, or hirono-reshape-1):"
    );
    if (!figureId) return;
    await addFigure(figureId.trim());
  };

  const handleDeleteFigure = async (figureId: string) => {
    await removeFigure(figureId);
    setRevealedFigures((prev) => prev.filter((id) => id !== figureId));
  };

  if (!user) return <p style={{ textAlign: "center" }}>Please log in to view your profile.</p>;
  if (loading) return <p>Loading collection...</p>;

  return (
    <div style={{ textAlign: "center" }}>
      <h1>{user.displayName ? `Welcome ${user.displayName}!` : "Welcome!"}</h1>
      <p>Total figures collected: {totalCount}</p>

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
        {Object.entries(collectionBySeries).map(([series, figures]) =>
          figures.map((figure: CollectedFigure) => {
            const isRevealed = revealedFigures.includes(figure.figureId);
            return (
              <div
                key={figure.backendId} // use backendId for key
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
                <button onClick={() => handleDeleteFigure(figure.figureId)}>Delete</button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Profile;
