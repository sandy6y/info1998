import { createContext, useContext, useEffect, useState } from "react";

type User = {
  id: string;
  email: string;
  displayName: string;
  createdAt?: string;
};

type AuthContextType = {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  token: string;
  setToken: React.Dispatch<React.SetStateAction<string>>;
};

// Give createContext a proper type, but allow null for initial value
const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState("");

// Fetch "current user" from backend
  const loadUser = async () => {
    try {
      const res = await fetch("http://localhost:3000/auth/me");
      const data = await res.json();
      setUser(data);
    } catch (err) {
      console.error("Failed to load user:", err);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, token, setToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside an AuthProvider");
  }
  return ctx;
}
