import React, { useState } from "react";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import { List, ListItem, ListItemText, Tooltip } from "@mui/material";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";

import "../styles/PartyPromisesForm.css";

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
        <Stack direction="column" spacing={1} padding={1} className="stack">
            <Stack direction="row" spacing={1}>
                <TextField
                    required
                    id="filled-required-attester"
                    label="Party Name"
                    variant="filled"
                    name="attester"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    fullWidth
                />
                <Tooltip title="Upload the Promises">
                    <IconButton type="submit" color="success">
                        <FileUploadIcon />
                    </IconButton>
                </Tooltip>
            </Stack>
            <PromisesList promises={promises} setPromises={setPromises} />
            <PromiseForm
                newPromise={newPromise}
                handleChange={handleChange}
                handleAddPromise={handleAddPromise}
            />
        </Stack>
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
        <form onSubmit={handleAddPromise} className="stack">
            <Stack direction="column" spacing={1} padding={1}>
                <Stack direction="row" spacing={1}>
                    <Box flex={2}>
                        <TextField
                            required
                            id="filled-required-title"
                            className="titleField"
                            label="Title"
                            variant="filled"
                            name="title"
                            value={newPromise.title}
                            onChange={handleChange}
                            fullWidth
                        />
                    </Box>
                    <Box flex={1}>
                        <TextField
                            required
                            id="filled-required-attester"
                            label="Attester Public Address"
                            variant="filled"
                            name="attester"
                            value={newPromise.attester}
                            onChange={handleChange}
                            fullWidth
                        />
                    </Box>
                </Stack>
                <TextField
                    required
                    id="filled-multiline-static-description"
                    label="Description"
                    multiline
                    rows={10}
                    variant="filled"
                    name="description"
                    value={newPromise.description}
                    onChange={handleChange}
                    fullWidth
                />
                <Box display="flex" justifyContent="right">
                    <Tooltip title="Add Promise">
                        <IconButton type="submit" color="success">
                            <AddIcon />
                        </IconButton>
                    </Tooltip>
                </Box>
            </Stack>
        </form>
    );
};

export default PartyPromisesForm;
