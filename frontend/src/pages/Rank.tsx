import { useEffect, useState } from "react";

type UserRanking = {
  rank: number;
  user: {
    id: string;
    displayName: string;
    profilePicUrl?: string; 
  };
  collectionCount: number;
}

const Rank = () => {
  const [rankings, setRankings] = useState<UserRanking[]>([]);
  const [loading, setLoading] = useState(true);

  //fetch data from backend
  useEffect(() => {
    fetch("http://localhost:8080/users/rankings")
      .then((res) => res.json())
      .then((data) => {
        setRankings(data);
        setLoading(false);
      })
      .catch((err) => { 
        console.error("Error fetching rankings: ", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p style={{ textAlign: "center"}}>Loading...</p>;
  }

  return (
    <div className="rankPage">
      <h1>Collector Rankings 🏆</h1>
      <div className="rank-list">
        {rankings.map((entry) => (
          <div key={entry.user.id} className="rank-card">
            <div className="rank-user">
              <img
                src={
                  entry.user.profilePicUrl ||
                  "https://via.placeholder.com/50x50?text=👤"
                }
                alt={entry.user.displayName}
              />
              <div>
                <strong>#{entry.rank}</strong> {entry.user.displayName}
              </div>
            </div>
            <div className="rank-count">
              {entry.collectionCount} figures
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Rank; 