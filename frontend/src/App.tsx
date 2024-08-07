import "./App.css";
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useSDK } from "@metamask/sdk-react";
import { ThemeProvider, Box } from "@mui/material";
import PartyPromisesAppBar from "./components/AppBar";
import PartyPromisesForm from "./components/PartyPromisesForm";
import Home from "./pages/Home";
import CreatePartyProgramPage from "./pages/Create";
import DonationPage from "./pages/Donate";
import Contact, { AttestationPage } from "./pages/Attest";
import EditPartyProgramPage from "./pages/Edit";
import theme from "./theme";

function App() {
    // const [account, setAccount] = useState<string>();
    // const { sdk, connected, connecting, provider, chainId } = useSDK();

    // useEffect(() => {
    //     const connect = async () => {
    //         try {
    //             const accounts = await sdk?.connect();
    //             setAccount(accounts?.[0]);
    //         } catch (err) {
    //             console.warn("Failed to connect:", err);
    //         }
    //     };

    //     connect();
    // }, []);

    return (
        <ThemeProvider theme={theme}>
            <Box
                sx={{
                    flexGrow: 1,
                    height: "100vh",
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                <Router>
                    <PartyPromisesAppBar />
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/donate" element={<DonationPage />} />
                        <Route path="/attest" element={<AttestationPage />} />
                        <Route
                            path="/create"
                            element={<CreatePartyProgramPage />}
                        />
                        <Route
                            path="/edit"
                            element={<EditPartyProgramPage />}
                        />
                    </Routes>
                </Router>
            </Box>
        </ThemeProvider>
    );
}

export default App;
