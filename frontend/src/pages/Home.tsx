import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const HomePage = () => {
  const { user, setUser, setToken } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  //login 
  const handleLogin = async () => {
    try {
      const response = await fetch("http://localhost:8080/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Invalid email or password");
      }

      const data = await response.json();
      setUser(data.user);   
      setToken(data.token); 
      setError("");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h1>Welcome!</h1>
      <p>This is a website to showcase all the Popmart blind box figures you have collected!</p>
      <p>Feel free to upload an image of all the collected figures</p>

      {user ? (
        <p>Signed in as: {user.displayName}</p>
      ) : (
        <div>
          <p>Sign in here:</p>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={handleLogin}>Log In</button>
          {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
      )}
    </div>
  );
};

export default HomePage;
