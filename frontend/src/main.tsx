import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { DAppProvider } from "@usedapp/core";

import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <DAppProvider config={{}}>
            <App />
        </DAppProvider>
    </React.StrictMode>
);
