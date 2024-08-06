import React, { useState } from "react";
import "../styles/PartyPromisesForm.css";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { List, ListItem, ListItemText } from "@mui/material";
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

    const handleAddPromise = (event: React.FormEvent<HTMLFormElement>) => {
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
            <TextField
                required
                id="filled-required-attester"
                label="Party Name"
                variant="filled"
                name="attester"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <PromisesList promises={promises} setPromises={setPromises} />
            <PromiseForm
                newPromise={newPromise}
                handleChange={handleChange}
                handleAddPromise={handleAddPromise}
            />
        </div>
    );
};

interface Promise {
    title: string;
    description: string;
    attester: string;
}

interface PromisesListProps {
    promises: Promise[];
    setPromises: React.Dispatch<React.SetStateAction<Promise[]>>;
}

const PromisesList: React.FC<PromisesListProps> = ({
    promises,
    setPromises,
}) => {
    const handleDelete = (index: number) => {
        const updatedPromises = promises.filter((_, i) => i !== index);
        setPromises(updatedPromises);
    };

    return (
        <List className="formItem">
            {promises.map((promise, index) => (
                <ListItem key={index} divider>
                    <ListItemText
                        primary={promise.title}
                        secondary={
                            <>
                                <div>Description: {promise.description}</div>
                                <div>Attester: {promise.attester}</div>
                            </>
                        }
                    />
                    <IconButton
                        type="submit"
                        color="error"
                        onClick={() => handleDelete(index)}
                    >
                        <DeleteIcon />
                    </IconButton>
                </ListItem>
            ))}
        </List>
    );
};

export default PromisesList;

interface NewPromise {
    title: string;
    description: string;
    attester: string;
}

interface PromiseFormProps {
    newPromise: NewPromise;
    handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    handleAddPromise: (event: React.FormEvent<HTMLFormElement>) => void;
}

const PromiseForm: React.FC<PromiseFormProps> = ({
    newPromise,
    handleChange,
    handleAddPromise,
}) => {
    return (
        <form onSubmit={handleAddPromise} className="promiseField">
            <Stack direction="column" spacing={1}>
                <Stack direction="row" spacing={1}>
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
                        required
                        id="filled-required-attester"
                        label="Attester Public Address"
                        variant="filled"
                        name="attester"
                        value={newPromise.attester}
                        onChange={handleChange}
                    />
                </Stack>
                <TextField
                    required
                    id="filled-multiline-static-description"
                    label="Description"
                    multiline
                    rows={4}
                    variant="filled"
                    name="description"
                    value={newPromise.description}
                    onChange={handleChange}
                />
                <Box display="flex" justifyContent="center">
                    <IconButton type="submit" color="success">
                        <AddIcon />
                    </IconButton>
                </Box>
            </Stack>
        </form>
    );
};
