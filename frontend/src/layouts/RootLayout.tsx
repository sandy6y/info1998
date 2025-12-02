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
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <img
                            src={user.photoURL || 'https://via.placeholder.com/40'}
                            alt="Profile"
                            onError={(e) => {
                                console.error('Failed to load profile image:', user.photoURL);
                                e.currentTarget.src = 'https://via.placeholder.com/40';
                            }}
                            style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                objectFit: 'cover',
                                border: '2px solid #ccc'
                            }}
                        />
                        <p className="logout">
                            <button onClick={handleLogout}>
                                <LogOut size={20} /> Log Out
                            </button>
                        </p>
                    </div>
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
