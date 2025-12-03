import { Outlet } from "react-router-dom";
import SeriesHeader from "../components/SeriesHeader";

export default function LibraryLayout() {
  return (
    <main style={{ textAlign: "center" }}>
      <h1>Blind Box Library</h1>
      <p>Click on each series to see what figures exists</p>
      <p>The subseries are ordered by release date with the newest at the top</p>
    
      <SeriesHeader />

      <section style={{ marginTop: "20px" }}>
        <Outlet />
      </section>
    </main>
  );
}