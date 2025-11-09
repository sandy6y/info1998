import { Outlet } from "react-router-dom";
import SeriesHeader from "../components/SeriesHeader";
import Profile from "../pages/Profile";

export default function ProfileLayout() {
  return (
    <main style={{ textAlign: "center" }}>
      <h1>Blind Box Library</h1>
      <h2>Profile</h2>
    
      <Profile />

      <SeriesHeader />

      <section style={{ marginTop: "20px" }}>
        <Outlet />
      </section>
    </main>
  );
}