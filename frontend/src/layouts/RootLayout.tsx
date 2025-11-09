import { HeaderSimple } from "../components/Header";
import { PATHS } from "../constants/Navigation";
import { Outlet } from "react-router-dom";
import logo from "/images/POPLLECTION.jpg";
import { LogOut } from "lucide-react";

const RootLayout = () => (
    <div>
        <div className="banner-block">
            <div className="banner-center">
                <img src={logo} alt="Logo" className="logo" /> 
            </div>

            <div className="banner-right">
                <p className="logout">
                    <button> <LogOut size={20} /> Log Out</button>  
                </p>
            </div>
        </div>

    <HeaderSimple links={PATHS} />

    <div>
      <Outlet />
    </div>
    </div>
);

export default RootLayout;
