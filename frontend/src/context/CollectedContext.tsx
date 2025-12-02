import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { BACKEND_BASE_PATH } from "../constants/Navigation";

// Frontend CollectedFigure type
export type CollectedFigure = {
  backendId: string;
  figureId: string;
  collectedAt: string;
  order: number;
  userImageUrl?: string;
  isRevealed: boolean;
  series: string;
};

type CollectionBySeries = Record<string, CollectedFigure[]>;

type CollectedContextType = {
  totalCount: number;
  collectionBySeries: CollectionBySeries;
  refreshCollection: () => Promise<void>;
  addFigure: (collectibleId: string) => Promise<void>;
  removeFigure: (backendId: string) => Promise<void>;
};

const CollectedContext = createContext<CollectedContextType | null>(null);

export function CollectedProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [collectionBySeries, setCollectionBySeries] = useState<CollectionBySeries>({});
  const [totalCount, setTotalCount] = useState(0);

  const [figureLibrary, setFigureLibrary] = useState<Record<string, any>>({});

  // Fetch figure library from backend
  const fetchFigureLibrary = async () => {
    try {
      console.log("Fetching figure library...");
      const res = await fetch(`${BACKEND_BASE_PATH}/collections/figures/all`);
      console.log("Figure library response:", res.status);
      if (!res.ok) throw new Error("Failed to fetch figure library");
      const figures = await res.json();
      console.log("Fetched figures:", figures.length);

      const library: Record<string, any> = {};

      figures.forEach((fig: any) => {
        library[fig.id] = fig;
      });

      setFigureLibrary(library);
      console.log("Figure library loaded:", Object.keys(library).length, "figures");
    } catch (err) {
      console.error("Error fetching figure library:", err);
    }
  };

  // Refresh user collection
  const refreshCollection = async () => {
    if (!user || Object.keys(figureLibrary).length === 0) {
      return;
    }

    try {
      const res = await fetch(`${BACKEND_BASE_PATH}/collections/${user.id}`);
      if (!res.ok) throw new Error("Failed to fetch collection");
      const data = await res.json();

      const figures: CollectedFigure[] = (data.figures || [])
        .map((fig: any) => {
          const figureId = fig.figureId;
          const libraryFig = figureLibrary[figureId];

          if (!libraryFig) {
            console.warn("Missing figure in library for figureId:", figureId);
            return null;
          }

          return {
            backendId: figureId,
            figureId,
            collectedAt: fig.collectedAt || new Date().toISOString(),
            order: fig.order || 0,
            userImageUrl: fig.userImageUrl || libraryFig.imageUrl || "https://via.placeholder.com/100",
            isRevealed: fig.isRevealed || false,
            series: libraryFig.series || "Unknown",
          };
        })
        .filter(Boolean) as CollectedFigure[];

      // Group by series
      const grouped: Record<string, CollectedFigure[]> = {};
      figures.forEach((fig) => {
        if (!grouped[fig.series]) grouped[fig.series] = [];
        grouped[fig.series].push(fig);
      });

      setCollectionBySeries(grouped);
      setTotalCount(figures.length);
    } catch (err) {
      console.error("Error refreshing collection:", err);
    }
  };

  const addFigure = async (collectibleId: string) => {
    if (!user) return;

    try {
      const res = await fetch(`${BACKEND_BASE_PATH}/collections/${user.id}/figures`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ figureId: collectibleId }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to add figure");
      }
      await refreshCollection();
      alert("Figure added successfully!");
    } catch (err: any) {
      console.error("Error adding figure:", err);
      alert(err.message || "Failed to add figure");
      throw err;
    }
  };

  const removeFigure = async (backendId: string) => {
    if (!user) return;

    try {
      const res = await fetch(`${BACKEND_BASE_PATH}/collections/${user.id}/figures/${backendId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to remove figure");
      }
      await refreshCollection();
      alert("Figure removed successfully!");
    } catch (err: any) {
      console.error("Error removing figure:", err);
      alert(err.message || "Failed to remove figure");
      throw err;
    }
  };

  useEffect(() => {
    fetchFigureLibrary();
  }, []);

  useEffect(() => {
    if (user && Object.keys(figureLibrary).length > 0) {
      refreshCollection();
    }
  }, [user, figureLibrary]);

  return (
    <CollectedContext.Provider
      value={{ totalCount, collectionBySeries, refreshCollection, addFigure, removeFigure }}
    >
      {children}
    </CollectedContext.Provider>
  );
}

export function useCollected() {
  const ctx = useContext(CollectedContext);
  if (!ctx) throw new Error("useCollected must be used inside a CollectedProvider");
  return ctx;
}
