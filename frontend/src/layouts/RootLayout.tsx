import { HeaderSimple } from "../components/Header";
import { PATHS } from "../constants/Navigation";
import { Outlet } from "react-router-dom";
import logo from "/images/POPLLECTION.jpg";
import { LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { auth } from "../firebase/firebaseClient";

const RootLayout = () => {
    const { user, setUser, setToken } = useAuth();

    const handleLogout = async () => {
        try {
            await auth.signOut();
        } catch (err) {
            console.error("Firebase signOut failed:", err);
        }

        // Clear frontend auth state
        setUser(null);
        setToken("");
    };

    return (
        <div className="app-container">
            <div className="banner-block">
                <img src={logo} alt="Logo" className="logo" /> 

                {user && (
                    <p className="logout">
                        <button onClick={handleLogout}>
                            <LogOut size={20} /> Log Out
                        </button>
                    </p>
                )}
            </div>

            <HeaderSimple links={PATHS} />

            <main className="main-content">
                <Outlet />
            </main>
        </div>
    );
};

export default RootLayout;
