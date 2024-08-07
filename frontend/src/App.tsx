import "./App.css";
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { ThemeProvider, Box } from "@mui/material";
import PartyPromisesAppBar from "./components/AppBar";
import Home from "./pages/Home";
import CreatePartyProgramPage from "./pages/Create";
import DonationPage from "./pages/Donate";
import { AttestationPage } from "./pages/Attest";
import EditPartyProgramPage from "./pages/Edit";
import theme from "./theme";
import { useEthers, useEtherBalance } from "@usedapp/core";

function App() {
    const { activateBrowserWallet, account } = useEthers();
    const etherBalance = useEtherBalance(account);

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
                    <PartyPromisesAppBar
                        account={account}
                        etherBalance={etherBalance}
                        activateBrowserWallet={activateBrowserWallet}
                    />
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
