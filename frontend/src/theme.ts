import { createTheme } from "@mui/material/styles";

// Create a theme instance.
const theme = createTheme({
    palette: {
        mode: "dark", // Set the overall theme mode to dark
        primary: {
            main: "#BB86FC", // A sophisticated purple for primary actions
        },
        secondary: {
            main: "#03DAC6", // A contrasting teal for secondary actions
        },
        background: {
            default: "#121212", // A deep dark background for overall components
            paper: "#1E1E1E", // Slightly lighter dark shade for paper components
        },
        text: {
            primary: "#E0E0E0", // Light grey for primary text to ensure readability
            secondary: "#A7A7A7", // Slightly dimmed grey for secondary text
        },
    },
});

export default theme;
