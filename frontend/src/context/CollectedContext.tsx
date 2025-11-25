import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

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
  const [collectibleToFigureMap, setCollectibleToFigureMap] = useState<Record<string, string>>({});

  // Fetch figure library from backend
  const fetchFigureLibrary = async () => {
    try {
      const res = await fetch("http://localhost:8080/collections/figures/all");
      if (!res.ok) throw new Error("Failed to fetch figure library");
      const figures = await res.json();

      const library: Record<string, any> = {};
      const map: Record<string, string> = {};

      figures.forEach((fig: any) => {
        library[fig.id] = fig;

        // If backend collectibleId matches fig.id, use it
        // Otherwise, derive a mapping (adjust if needed)
        if (fig.collectibleId) {
          map[fig.collectibleId] = fig.id;
        } else {
          map[fig.id] = fig.id; // fallback
        }
      });

      setFigureLibrary(library);
      setCollectibleToFigureMap(map);
    } catch (err) {
      console.error("Error fetching figure library:", err);
    }
  };

  // Refresh user collection
  const refreshCollection = async () => {
    if (!user || Object.keys(figureLibrary).length === 0) return;

    try {
      const res = await fetch(`http://localhost:8080/collections/${user.id}`);
      if (!res.ok) throw new Error("Failed to fetch collection");
      const data = await res.json(); // { figures: [...] }

      const figures: CollectedFigure[] = (data.figures || [])
        .map((fig: any) => {
          const figureId = collectibleToFigureMap[fig.collectibleId] || fig.collectibleId;

          const libraryFig = figureLibrary[figureId];
          if (!libraryFig) {
            console.warn("Missing figure in library for collectibleId:", fig.collectibleId);
            return null;
          }

          return {
            backendId: fig.id,
            figureId,
            collectedAt: fig.collectedAt || new Date().toISOString(),
            order: fig.sortIndex || 0,
            userImageUrl: fig.revealPicUrl || libraryFig.imageUrl || "https://via.placeholder.com/100",
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
      const res = await fetch(`http://localhost:8080/collections/${user.id}/figures`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ figureId: collectibleId }),
      });

      if (!res.ok) throw new Error("Failed to add figure");
      await refreshCollection();
    } catch (err) {
      console.error("Error adding figure:", err);
    }
  };

  const removeFigure = async (backendId: string) => {
    if (!user) return;

    try {
      const res = await fetch(`http://localhost:8080/collections/${user.id}/figures/${backendId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to remove figure");
      await refreshCollection();
    } catch (err) {
      console.error("Error removing figure:", err);
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
