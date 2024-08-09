import React, { useState } from "react";
import { isAddress } from "web3-validator";
import Web3 from "web3";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import {
    List,
    ListItem,
    ListItemText,
    Modal,
    Tooltip,
    Typography,
} from "@mui/material";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";

import CopyableTextfield from "./CopyableTextfield";

import ABI from "../../../contracts/out/PartyPromisesFactory.sol/PartyPromisesFactory.json";

import "../styles/PartyPromisesForm.css";

export const PartyPromisesForm: React.FC = () => {
    const [name, setName] = useState<string | null>(null);
    const [expirationDate, setExpirationDate] = useState<string | null>(null);
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
    const [isDateValid, setIsDateValid] = useState<boolean>(false);
    const [promiseAddress, setPromiseAddress] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [modalTitle, setModalTitle] = useState("");
    const [modalDescription, setModalDescription] = useState("");

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
            setNewPromise({ title: "", description: "", attester: "" });
            setIsTitleUnique(true);
            setIsAddressValid(true);
        }

        setIsAddressValid(addressIsValid);
        setIsTitleUnique(!titleExists);
    };

    const uploadPromises = async () => {
        if (name === null || !name.trim()) {
            return;
        }

        if (expirationDate === null || !expirationDate.trim() || !isDateValid) {
            console.error("Valid expiration date is required");
            return;
        }

        if (promises.length === 0) {
            console.error("At least one promise is required");
            return;
        }

        const unixTime = Math.floor(new Date(expirationDate).getTime() / 1000);
        const titles = promises.map((promise) => promise.title);
        const descriptions = promises.map((promise) => promise.description);
        const partyProgramURL = "example";
        const attesters = promises.map((promise) => promise.attester);

        // call smartcontract here
        if ((window as any).ethereum) {
            const web3 = new Web3((window as any).ethereum);
            await (window as any).ethereum.enable();

            // Contract address and ABI
            const contractAddress =
                "0xb7e0f07a837e95c26f86e8230c79dfe461f06b2a";
            console.log("contractAddress", contractAddress);
            const contract = new web3.eth.Contract(ABI.abi, contractAddress);

            try {
                const accounts = await web3.eth.getAccounts();
                console.log("accounts", accounts);
                const account = accounts[0];

                // Call the CreateParty method
                console.log("Creating party...");
                // const receipt = await contract.methods
                //     .CreateParty(
                //         Web3.utils.padRight(Web3.utils.asciiToHex(name), 64), // Convert name to bytes32
                //         unixTime,
                //         partyProgramURL, // Assuming partyProgramURL is defined
                //         titles.map((title) =>
                //             Web3.utils.padRight(
                //                 Web3.utils.asciiToHex(title),
                //                 64
                //             )
                //         ), // Convert each title to bytes32
                //         descriptions
                //     )
                //     .send({ from: account });
                let receipt: any;
                try {
                    receipt = await contract.methods
                        .CreateParty(
                            Web3.utils.padRight(
                                Web3.utils.asciiToHex(name),
                                64
                            ), // Convert name to bytes32
                            unixTime,
                            partyProgramURL, // Assuming partyProgramURL is defined
                            titles.map((title) =>
                                Web3.utils.padRight(
                                    Web3.utils.asciiToHex(title),
                                    64
                                )
                            ), // Convert each title to bytes32
                            descriptions
                        )
                        .send({ from: account });

                    // If the call succeeds, log the receipt and proceed with further actions
                    console.log("Transaction receipt:", receipt);
                    // Continue with further actions here
                } catch (error) {
                    // Log the error to understand what went wrong
                    console.error("Error creating party:", error);
                    // Handle the error appropriately, e.g., show an error message to the user
                }
                console.log("receipt", receipt);
                if (receipt.events && receipt.events.PartyCreated) {
                    const address = receipt.events.PartyCreated
                        .returnValues[0] as string;
                    console.log("receipt", receipt);
                    setPromiseAddress(address);
                    setModalTitle("Success");
                    setModalDescription(
                        "Your Party Promises have been created at " + address
                    );
                } else {
                    throw new Error("PartyCreated event not found in receipt");
                }
            } catch (error) {
                setModalTitle("Error");
                setModalDescription(
                    "Error creating party: " + (error as Error).message
                );
            } finally {
                setIsModalOpen(true);
            }
        }
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
        <>
            <Stack direction="column" spacing={1} padding={1} className="stack">
                <Stack direction="row" spacing={1}>
                    {name === null || name.trim() ? (
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
                    ) : (
                        <TextField
                            required
                            error
                            id="party-name-field"
                            label="Party Name"
                            helperText="Name is required"
                            variant="outlined"
                            name="attester"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            fullWidth
                        />
                    )}
                    <Tooltip title="Upload the Promises">
                        <IconButton
                            color="success"
                            size="large"
                            edge="start"
                            onClick={uploadPromises}
                        >
                            <FileUploadIcon />
                        </IconButton>
                    </Tooltip>
                </Stack>
                {expirationDate === null || expirationDate.trim() ? (
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
            <Modal
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box id="modal">
                    <Stack display="flex" flex-direction="column">
                        <Typography
                            id="modal-modal-title"
                            variant="h6"
                            component="h2"
                        >
                            {modalTitle}
                        </Typography>
                        {promiseAddress !== null ? (
                            <CopyableTextfield value={promiseAddress} />
                        ) : (
                            <Typography>
                                "Party Promises could not be created"
                            </Typography>
                        )}
                    </Stack>
                </Box>
            </Modal>
        </>
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
