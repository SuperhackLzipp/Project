import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

// own components
import { PartyPromisesForm } from "./components/PartyPromisesForm";

function App() {
    const [count, setCount] = useState(0);

    return (
        <>
            <div>
                <h1>Party Promise Form</h1>
            </div>
            <PartyPromisesForm />
        </>
    );
}

export default App;
