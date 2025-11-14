import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { AuthProvider } from "./context/AuthContext";
import { CollectedProvider } from "./context/CollectedContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <AuthProvider>
            <CollectedProvider>
                <App />
            </CollectedProvider>
        </AuthProvider>
    </React.StrictMode>
);
