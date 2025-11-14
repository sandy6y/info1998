import { createContext, useContext, useState } from "react";

type CollectedContextType = {
  totalCount: number;
  setTotalCount: React.Dispatch<React.SetStateAction<number>>;
};

// Create the context with a typed union to allow null initially
const CollectedContext = createContext<CollectedContextType | null>(null);

export function CollectedProvider({ children }: { children: React.ReactNode }) {
  const [totalCount, setTotalCount] = useState(0);

  return (
    <CollectedContext.Provider value={{ totalCount, setTotalCount }}>
      {children}
    </CollectedContext.Provider>
  );
}

export function useCollected() {
  const ctx = useContext(CollectedContext);
  if (!ctx) {
    throw new Error("useCollected must be used inside a CollectedProvider");
  }
  return ctx;
}
