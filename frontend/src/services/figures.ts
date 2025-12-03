export type Figure = {
  id: string;
  series: string;
  name: string;
  imageUrl: string;
  description: string;
};

const BASE_URL = "http://localhost:8080/collections";

export async function getFiguresBySeries(seriesName: string): Promise<Figure[]> {
  // Fetch all figures and filter by series on client side
  const allFigures = await getAllFigures();
  return allFigures.filter(figure =>
    figure.series.toLowerCase().includes(seriesName.toLowerCase())
  );
}

export async function getAllFigures(): Promise<Figure[]> {
  const res = await fetch(`${BASE_URL}/figures/all`);
  if (!res.ok) throw new Error("Failed to fetch all figures");
  return res.json();
}
