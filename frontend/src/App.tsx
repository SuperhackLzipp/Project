import "./App.css"
import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { ThemeProvider, Box } from "@mui/material";
import PartyPromisesAppBar from "./components/AppBar";
import PartyPromisesForm from "./components/PartyPromisesForm";
import Home from "./pages/Home";
import CreatePartyProgramPage from "./pages/Create";
import DonationPage from "./pages/Donate";
import Contact, { AttestationPage } from "./pages/Attest";
import theme from "./theme";

function App() {
    return (
        <ThemeProvider theme={theme}>
            <Box sx={{ flexGrow: 1, height: "100vh", display: "flex", flexDirection: "column" }}>
                <Router>
                    <PartyPromisesAppBar />
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/donate" element={<DonationPage />} />
                        <Route path="/attest" element={<AttestationPage />} />
                        <Route path="/create" element={<CreatePartyProgramPage />} />
                    </Routes>
                </Router>
                <PartyPromisesForm />
            </Box>
        </ThemeProvider>
    );
}

export default App;
