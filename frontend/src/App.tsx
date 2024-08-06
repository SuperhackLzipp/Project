import { useState, useEffect } from "react";

import theme from "./theme";

// own components
import { PartyPromisesForm } from "./components/PartyPromisesForm";
import { PartyPromisesAppBar } from "./components/AppBar";
import { ThemeProvider } from "@emotion/react";
import { Box } from "@mui/material";

function App() {
    return (
        <ThemeProvider theme={theme}>
            <Box sx={{ flexGrow: 1 }}>
                <PartyPromisesAppBar />
                <PartyPromisesForm />
            </Box>
        </ThemeProvider>
    );
}

export default App;
