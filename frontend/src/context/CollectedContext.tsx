import { createContext, useContext, useState, ReactNode } from "react";

interface CollectedContextType {
  totalCount: number;
  increase: () => void;
  decrease: () => void;
}

const CollectedContext = createContext<CollectedContextType | undefined>(undefined);

export const CollectedProvider = ({ children }: { children: ReactNode }) => {
  const [totalCount, setTotalCount] = useState(0);

  const increase = () => setTotalCount((prev) => prev + 1);
  const decrease = () => setTotalCount((prev) => (prev > 0 ? prev - 1 : 0));

  return (
    <CollectedContext.Provider value={{ totalCount, increase, decrease }}>
      {children}
    </CollectedContext.Provider>
  );
};

export const useCollected = () => {
  const context = useContext(CollectedContext);
  if (!context) throw new Error("useCollected must be used inside CollectedProvider");
  return context;
};
