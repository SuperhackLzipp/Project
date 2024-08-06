import React, { useState } from "react";
import "../styles/PartyPromisesForm.css";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";

export const PartyPromisesForm: React.FC = () => {
    const [name, setName] = useState<string>("");
    const [promises, setPromises] = useState<
        Array<{ title: string; description: string; attester: string }>
    >([]);
    const [newPromise, setNewPromise] = useState<{
        title: string;
        description: string;
        attester: string;
    }>({ title: "", description: "", attester: "" });

    const handleAddPromise = (event: React.MouseEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (
            newPromise.title.trim() !== "" &&
            newPromise.description.trim() !== "" &&
            newPromise.attester.trim() !== ""
        ) {
            setPromises([...promises, newPromise]);
            setNewPromise({ title: "", description: "", attester: "" }); // Reset input fields after adding
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewPromise((prev) => ({ ...prev, [name]: value }));
    };

    return (
        <div>
            <form className="partyField">
                <label className="label" htmlFor="party">
                    Party Name
                </label>
                <input
                    className="textField"
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </form>
            <ul className="formItem">
                {promises.map((promise, index) => (
                    <li key={index}>
                        <div>
                            <label>Title</label>
                            <h3>{promise.title}</h3>
                        </div>
                        <div>
                            <label>Description</label>
                            <p>{promise.description}</p>
                        </div>
                        <div>
                            <label>Attester</label>
                            <p>{promise.attester}</p>
                        </div>
                        <button
                            onClick={() => {
                                const updatedPromises = promises.filter(
                                    (_, i) => i !== index
                                );
                                setPromises(updatedPromises);
                            }}
                        >
                            Delete
                        </button>
                    </li>
                ))}
            </ul>
            <form onSubmit={handleAddPromise} className="promiseField">
                <TextField
                    required
                    id="filled-required-title"
                    label="Title"
                    variant="filled"
                    name="title"
                    value={newPromise.title}
                    onChange={handleChange}
                />
                <TextField
                    id="filled-multiline-static-description"
                    label="Description"
                    multiline
                    rows={4}
                    variant="filled"
                    name="description"
                    value={newPromise.description}
                    onChange={handleChange}
                />
                <TextField
                    required
                    id="filled-required-attester"
                    label="Attester Public Address"
                    variant="filled"
                    name="attester"
                    value={newPromise.attester}
                    onChange={handleChange}
                />
                <Button type="submit" variant="contained">
                    Add
                </Button>
            </form>
        </div>
    );
};
