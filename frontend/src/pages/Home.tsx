import { useAuth } from "../context/AuthContext";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../firebase/firebaseClient";

const HomePage = () => {
  const { user, setUser, setToken } = useAuth();

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();

      // Send token to backend
      const res = await fetch("http://localhost:8080/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });

      const data = await res.json();
      setToken(idToken); // store for future API requests
      setUser(data.user); // update user state
    } catch (error) {
      console.error("Google login error:", error);
      alert("Failed to login with Google");
    }
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h1>{user ? `Welcome ${user.displayName}!` : "Welcome!"}</h1>
      <p>Showcase your Popmart blind box collection here</p>

      {user ? (
        <div>
          {user.photoURL && (
            <img
              src={user.photoURL}
              alt="Profile"
              style={{ width: "80px", borderRadius: "50%" }}
            />
          )}
          <p>You can now view your collection and stats.</p>
        </div>
      ) : (
        <div>
          <button onClick={handleGoogleLogin}>
            Sign in with Google
          </button>
        </div>
      )}
    </div>
  );
};

export default HomePage;
