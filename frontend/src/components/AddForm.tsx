import React, { useState } from "react";
import {
    Box,
    IconButton,
    Modal,
    Stack,
    TextField,
    Typography,
    Tooltip,
} from "@mui/material";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import Web3 from "web3";
import { isAddress } from "web3-validator";
import { ABI_PARTY } from "../config/config";

import NewPromiseForm from "./NewPromiseForm";
import NewPromisesList from "./NewPromisesList";
import ViewPromisesList from "./ViewPromisesList";

interface Promise {
    title: string;
    description: string;
}

interface NewPromise {
    title: string;
    description: string;
    attester: string;
}

interface AddFormProps {
    contractAddress: string;
    oldPromises: Array<Promise>;
}

const AddForm: React.FC<AddFormProps> = ({ contractAddress, oldPromises }) => {
    const [promises, setPromises] = useState<Array<NewPromise>>([]);
    const [newPromise, setNewPromise] = useState<NewPromise>({
        title: "",
        description: "",
        attester: "",
    });
    const [isAddressValid, setIsAddressValid] = useState<boolean>(true);
    const [isTitleUnique, setIsTitleUnique] = useState<boolean>(true);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [modalTitle, setModalTitle] = useState("");

    const addPromise = (event: React.FormEvent<HTMLFormElement>) => {
        console.log("new promise", newPromise);
        event.preventDefault();
        const titleExists =
            oldPromises.some(
                (promise) =>
                    promise.title.trim().toLowerCase() ===
                    newPromise.title.trim().toLowerCase()
            ) ||
            promises.some(
                (promise) =>
                    promise.title.trim().toLowerCase() ===
                    newPromise.title.trim().toLowerCase()
            );
        console.log("titleExists", titleExists);
        const addressIsValid = isAddress(newPromise.attester.trim());
        if (
            newPromise.title.trim() !== "" &&
            newPromise.description.trim() !== "" &&
            titleExists === false &&
            addressIsValid === true
        ) {
            console.log("triggered");
            setPromises([...promises, newPromise]);
            console.log("promises 1", promises);
            setNewPromise({ title: "", description: "", attester: "" });
            console.log("promises 2", promises);
        }

        setIsAddressValid(addressIsValid);
        setIsTitleUnique(!titleExists);
        console.log("promises 3", promises);
    };

    const uploadPromises = async () => {
        if (promises.length === 0) return;

        const partyProgramURL = "example";
        const attesters = promises.map((promise) => promise.attester);

        // call smartcontract here
        if ((window as any).ethereum) {
            const web3 = new Web3((window as any).ethereum);
            await (window as any).ethereum.enable();

            const contract = new web3.eth.Contract(
                ABI_PARTY.abi,
                contractAddress
            );

            try {
                const accounts = await web3.eth.getAccounts();
                const account = accounts[0];

                const promiseTitles = promises.map((promise) =>
                    web3.utils.padRight(
                        web3.utils.asciiToHex(promise.title),
                        64
                    )
                );
                const descriptions = promises.map(
                    (promise) => promise.description
                );
                const attesters = promises.map((promise) => promise.attester);
                const receipt = await contract.methods
                    .UploadPromises(promiseTitles, descriptions)
                    .send({ from: account });
                if (receipt.events && receipt.events.PromiseAdded) {
                    setModalTitle("Success");
                } else {
                    throw new Error("Promises not added");
                }
            } catch (error) {
                setModalTitle("Error");
            } finally {
                setIsModalOpen(true);
            }
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewPromise((prev) => ({ ...prev, [name]: value }));
    };

    return (
        <>
            <Stack direction="row" className="stack">
                <NewPromiseForm
                    newPromise={newPromise}
                    isAddressValid={isAddressValid}
                    isTitleUnique={isTitleUnique}
                    setIsTitleUnique={setIsTitleUnique}
                    handleChange={handleChange}
                    promises={promises}
                    addPromise={addPromise}
                />
                {(oldPromises.length > 0 || promises.length > 0) && (
                    <Stack direction="column" spacing={1} padding={1}>
                        {oldPromises.length > 0 && (
                            <ViewPromisesList promises={oldPromises} />
                        )}
                        {promises.length > 0 && (
                            <NewPromisesList
                                promises={promises}
                                setPromises={setPromises}
                            />
                        )}
                    </Stack>
                )}
            </Stack>
            <Modal
                open={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setPromises([]);
                    setNewPromise({ title: "", description: "", attester: "" });
                    setIsAddressValid(true);
                    setIsTitleUnique(true);
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

                        <Typography>"Promises added!"</Typography>
                    </Stack>
                </Box>
            </Modal>
        </>
    );
};

export default AddForm;
