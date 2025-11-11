import { HeaderSimple } from "../components/Header";
import { PATHS } from "../constants/Navigation";
import { Outlet } from "react-router-dom";
import logo from "/images/POPLLECTION.jpg";
import { LogOut } from "lucide-react";

const RootLayout = () => (
    <div className="app-container">
        <div className="banner-block">
            <img src={logo} alt="Logo" className="logo" /> 
            <button className="logout">
                <LogOut size={20} /> Log Out 
            </button>
        </div>

    <HeaderSimple links={PATHS} />

    <main className="main-content">
      <Outlet />
    </main>
    </div>
);

export default RootLayout;
