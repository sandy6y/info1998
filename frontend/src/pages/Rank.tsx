import { useEffect, useState } from "react";
import { BACKEND_BASE_PATH } from "../constants/Navigation";

type UserRanking = {
  rank: number;
  user: {
    id: string;
    displayName: string;
    photoURL?: string;
  };
  collectionCount: number;
};

const Rank = () => {
  const [rankings, setRankings] = useState<UserRanking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRankings = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${BACKEND_BASE_PATH}/users/rankings`);
        if (!res.ok) throw new Error("Failed to fetch rankings");

        const data: UserRanking[] = await res.json();

        // Optionally, sort by collectionCount if backend doesn't sort
        data.sort((a, b) => b.collectionCount - a.collectionCount);

        // Add ranking number if backend doesn't include it
        const rankedData = data.map((user, index) => ({
          ...user,
          rank: index + 1,
        }));

        setRankings(rankedData);
      } catch (err) {
        console.error("Error fetching rankings:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRankings();
  }, []);

  if (loading) return <p style={{ textAlign: "center" }}>Loading...</p>;

  return (
    <div className="rankPage">
      <h1>Collector Rankings 🏆</h1>
      <div className="rank-list">
        {rankings.map((entry) => (
          <div key={entry.user.id} className="rank-card">
            <div className="rank-user">
              <img
                src={entry.user.photoURL || "https://via.placeholder.com/50x50?text=👤"}
                alt={entry.user.displayName}
              />
              <div>
                <strong>#{entry.rank}</strong> {entry.user.displayName}
              </div>
            </div>
            <div className="rank-count">{entry.collectionCount} figures</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Rank;
