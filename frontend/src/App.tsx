import { useState } from "react";

import theme from "./theme";

// own components
import { PartyPromisesForm } from "./components/PartyPromisesForm";
import { ThemeProvider } from "@emotion/react";

function App() {
    const [count, setCount] = useState(0);

    return (
        <ThemeProvider theme={theme}>
            <div>
                <h1>Party Promise Form</h1>
            </div>
            <PartyPromisesForm />
        </ThemeProvider>
    );
}

export default App;
