import "./App.css";
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
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
    const [account, setAccount] = useState<string>();

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
