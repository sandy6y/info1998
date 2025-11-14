import { HeaderSimple } from "../components/Header";
import { PATHS } from "../constants/Navigation";
import { Outlet } from "react-router-dom";
import logo from "/images/POPLLECTION.jpg";
import { LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const RootLayout = () => {
    const { setUser, setToken } = useAuth();

    const handleLogout = () => {
        setUser(null);
        setToken("");
    }
    return (
        <div className="app-container">
            <div className="banner-block">
                <img src={logo} alt="Logo" className="logo" /> 
                    <p className="logout">
                        <button onClick={handleLogout}>
                            <LogOut size={20} /> Log Out
                        </button>
                    </p>
            </div>

        <HeaderSimple links={PATHS} />

        <main className="main-content">
        <Outlet />
        </main>
    </div>
    );
};

export default RootLayout;
