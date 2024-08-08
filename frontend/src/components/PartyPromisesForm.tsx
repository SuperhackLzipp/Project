import React, { useState } from "react";
import { isAddress } from "web3-validator";
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
    const [expirationDate, setExpirationDate] = useState<string>("");
    const [promises, setPromises] = useState<
        Array<{ title: string; description: string; attester: string }>
    >([]);
    const [newPromise, setNewPromise] = useState<{
        title: string;
        description: string;
        attester: string;
    }>({ title: "", description: "", attester: "" });
    const [isAddressValid, setIsAddressValid] = useState<boolean>(true);
    const [isTitleUnique, setIsTitleUnique] = useState<boolean>(true);
    const [isDateValid, setIsDateValid] = useState<boolean>(true);
    const [promiseAddress, setPromiseAddress] = useState<string>("");

    const addPromise = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const titleExists = promises.some(
            (promise) =>
                promise.title.trim().toLowerCase() ===
                newPromise.title.trim().toLowerCase()
        );
        const addressIsValid = isAddress(newPromise.attester.trim());
        if (
            newPromise.title.trim() !== "" &&
            newPromise.description.trim() !== "" &&
            titleExists === false &&
            addressIsValid === true
        ) {
            setPromises([...promises, newPromise]);
            setNewPromise({ title: "", description: "", attester: "" }); // Reset input fields after adding
            setIsTitleUnique(true);
            setIsAddressValid(true);
        }

        setIsAddressValid(addressIsValid);
        setIsTitleUnique(!titleExists);
    };

    const uploadPromises = async () => {
        name;
        const expirationDateInt = new Date(expirationDate);
        const unixTime = Math.floor(expirationDateInt.getTime() / 1000);
        const titles = promises.map((promise) => promise.title);
        const descriptions = promises.map((promise) => promise.description);
        const attesters = promises.map((promise) => promise.attester);
		// call smrtcontract here
    };

    const checkDateValid = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedDate = new Date(e.target.value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const isValid = selectedDate >= today;
        if (isValid) {
            setExpirationDate(e.target.value);
        }
        setIsDateValid(isValid);
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
                    id="party-name-field"
                    label="Party Name"
                    variant="outlined"
                    name="attester"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    fullWidth
                />
                <Tooltip title="Upload the Promises">
                    <IconButton color="success" size="large" edge="start">
                        <FileUploadIcon />
                    </IconButton>
                </Tooltip>
            </Stack>
            {isDateValid ? (
                <TextField
                    required
                    id="date-field"
                    label="Expiration Date"
                    type="date"
                    name="promiseDate"
                    value={expirationDate}
                    onChange={checkDateValid}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    fullWidth
                />
            ) : (
                <TextField
                    required
                    error
                    id="date-field"
                    label="Expiration Date"
                    helperText="Must be a future date"
                    type="date"
                    name="promiseDate"
                    value={expirationDate}
                    onChange={checkDateValid}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    fullWidth
                />
            )}
            <Stack direction="row">
                <PromiseForm
                    newPromise={newPromise}
                    isAddressValid={isAddressValid}
                    isTitleUnique={isTitleUnique}
                    handleChange={handleChange}
                    addPromise={addPromise}
                />
                {promises.length > 0 && (
                    <PromisesList
                        promises={promises}
                        setPromises={setPromises}
                    />
                )}
            </Stack>
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
        <List className="formItem scrollable-list">
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
    isAddressValid: boolean;
    isTitleUnique: boolean;
    handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    addPromise: (event: React.FormEvent<HTMLFormElement>) => void;
}

const PromiseForm: React.FC<PromiseFormProps> = ({
    newPromise,
    isAddressValid,
    isTitleUnique,
    handleChange,
    addPromise,
}) => {
    return (
        <form onSubmit={addPromise} className="stack">
            <Stack direction="column" spacing={1} padding={1}>
                <Stack direction="row" spacing={1}>
                    <Box flex={2}>
                        {isTitleUnique == false ? (
                            <TextField
                                required
                                error
                                id="title-field"
                                label="Title"
                                helperText="Must be unique"
                                variant="outlined"
                                name="title"
                                value={newPromise.title}
                                onChange={handleChange}
                                fullWidth
                            />
                        ) : (
                            <TextField
                                required
                                id="title-field"
                                label="Title"
                                variant="outlined"
                                name="title"
                                value={newPromise.title}
                                onChange={handleChange}
                                fullWidth
                            />
                        )}
                    </Box>
                    <Box flex={1}>
                        {isAddressValid === false ? (
                            <TextField
                                required
                                error
                                id="attester-field"
                                label="Attester Public Address"
                                helperText="Not a valid Address"
                                variant="outlined"
                                name="attester"
                                value={newPromise.attester}
                                onChange={handleChange}
                                fullWidth
                            />
                        ) : (
                            <TextField
                                required
                                id="attester-field-error"
                                label="Attester Public Address"
                                variant="outlined"
                                name="attester"
                                value={newPromise.attester}
                                onChange={handleChange}
                                fullWidth
                            />
                        )}
                    </Box>
                </Stack>
                <TextField
                    required
                    id="filled-multiline-static-description"
                    label="Description"
                    multiline
                    rows={10}
                    variant="outlined"
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
