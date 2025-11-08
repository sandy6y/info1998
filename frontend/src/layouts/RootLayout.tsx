import { HeaderSimple } from "../components/Header";
import { PATHS } from "../constants/Navigation";
import { Outlet } from "react-router-dom";
import logo from "../images/POPLLECTION.jpg";

const RootLayout = () => (
    <div>
        <h1>
            <img src = {logo} alt="Logo" className="logo" />
        </h1>
        <HeaderSimple links={PATHS} />
        <div>
            <Outlet />
        </div>
    </div>
);

export default RootLayout;
