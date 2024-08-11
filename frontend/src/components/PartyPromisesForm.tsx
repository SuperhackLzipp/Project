import React, { useState } from "react";
import { isAddress } from "web3-validator";
import Web3 from "web3";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import { Modal, Tooltip, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import CopyableTextfield from "./CopyableTextfield";
import NewPromiseForm from "./NewPromiseForm";
import NewPromisesList from "./NewPromisesList";

import { ABI_FACTORY } from "../config/config.ts";

import "../styles/PartyPromisesForm.css";

import { ETH_SEPOLIA_FACTORY_ADDRESS } from "../config/config";

interface PartyPromisesFormProps {
    setContractCreated: React.Dispatch<React.SetStateAction<boolean>>;
}

export const PartyPromisesForm: React.FC<PartyPromisesFormProps> = ({
    setContractCreated,
}) => {
    const [name, setName] = useState<string | null>(null);
    const [nameLen, setNameLen] = useState<number>(0);
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
        }

        setIsAddressValid(addressIsValid);
        setIsTitleUnique(!titleExists);
    };

    const uploadPromises = async () => {
        if (name === null || !name.trim()) return;
        if (expirationDate === null || !expirationDate.trim() || !isDateValid)
            return;
        if (promises.length === 0) return;

        const unixTime = Math.floor(new Date(expirationDate).getTime() / 1000);
        const titles = promises.map((promise) => promise.title);
        const descriptions = promises.map((promise) => promise.description);
        const partyProgramURL = "example";
        const attesters = promises.map((promise) => promise.attester);

        // call smartcontract here
        if ((window as any).ethereum) {
            const web3 = new Web3((window as any).ethereum);
            await (window as any).ethereum.enable();

            const contract = new web3.eth.Contract(
                ABI_FACTORY.abi,
                ETH_SEPOLIA_FACTORY_ADDRESS
            );

            try {
                const accounts = await web3.eth.getAccounts();
                const account = accounts[0];

                const receipt = await contract.methods
                    .CreateParty(
                        Web3.utils.padRight(Web3.utils.asciiToHex(name), 64), // Convert name to bytes32
                        unixTime,
                        partyProgramURL,
                        titles.map((title) =>
                            Web3.utils.padRight(
                                Web3.utils.asciiToHex(title),
                                64
                            )
                        ),
                        descriptions
                    )
                    .send({ from: account });
                if (receipt.events && receipt.events.PartyCreated) {
                    const address = receipt.events.PartyCreated
                        .returnValues[0] as string;
                    setPromiseAddress(address);
                    setModalTitle("Success");
                } else {
                    throw new Error("PartyCreated event not found in receipt");
                }
            } catch (error) {
                setModalTitle("Error");
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

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const input = e.target.value;
        const encoder = new TextEncoder();
        const encodedInput = encoder.encode(input);
        setNameLen(encodedInput.length);
        setName(input);
    };

    return (
        <>
            <Stack direction="column" spacing={1} padding={1} className="stack">
                <Stack direction="row" spacing={1}>
                    <TextField
                        required
                        error={
                            !((name === null || name.trim()) && nameLen < 32)
                        }
                        id="party-name-field"
                        label="Party Name"
                        helperText={
                            !((name === null || name.trim()) && nameLen < 32)
                                ? nameLen >= 32
                                    ? "Name is too long"
                                    : "Name is required"
                                : ""
                        }
                        variant="outlined"
                        name="attester"
                        value={name}
                        onChange={handleNameChange}
                        fullWidth
                    />
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
                    error={!(expirationDate === null || expirationDate.trim())}
                    helperText={
                        !(expirationDate === null || expirationDate.trim())
                            ? "Must be a future date"
                            : ""
                    }
                />
                <Stack direction="row">
                    <NewPromiseForm
                        newPromise={newPromise}
                        isAddressValid={isAddressValid}
                        isTitleUnique={isTitleUnique}
                        handleChange={handleChange}
                        addPromise={addPromise}
                    />
                    {promises.length > 0 && (
                        <NewPromisesList
                            promises={promises}
                            setPromises={setPromises}
                        />
                    )}
                </Stack>
            </Stack>
            <Modal
                open={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setContractCreated(true);
                    setName(null);
                    setExpirationDate(null);
                    setPromises([]);
                    setNewPromise({ title: "", description: "", attester: "" });
                    setIsAddressValid(true);
                    setIsTitleUnique(true);
                    setIsDateValid(false);
                    setPromiseAddress(null);
                }}
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

export default PartyPromisesForm;
