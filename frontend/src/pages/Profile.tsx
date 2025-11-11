import{ useCollected } from "../context/CollectedContext";

export default function Profile() {
  const { totalCount } = useCollected();
  return (
    <div style={{ textAlign: "center" }}>
      <p>Username:</p>
      <p>Total figures: {totalCount}</p>
    </div>
  );
}