import React from "react";
import DonationPromisesList from "./DonationPromisesList";
import { Box, IconButton, Stack, Tooltip } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Web3 from "web3";
import { ABI_PARTY } from "../config/config";

interface Promise {
    title: string;
    description: string;
    amount: number;
}

interface DonationFormProps {
    contractAddress: string;
    promises: Promise[];
    setPromises: React.Dispatch<React.SetStateAction<Promise[]>>;
}

const DonationForm: React.FC<DonationFormProps> = ({
    contractAddress,
    promises,
    setPromises,
}) => {
    const donate = async (event: React.FormEvent) => {
        event.preventDefault();
        console.log("Donating to Party");
        const totalAmount = promises.reduce(
            (acc, promise) => acc + promise.amount,
            0
        );
        if (totalAmount <= 0) return;
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

                const totalAmountInWei = web3.utils.toWei(
                    totalAmount.toString(),
                    "ether"
                );
                const promisesDonatedTo = promises.map((promise) => {
                    return web3.utils.padRight(
                        web3.utils.asciiToHex(promise.title),
                        64
                    );
                });
                const amountsDonated = promises.map((promise) => {
                    return web3.utils.toWei(promise.amount.toString(), "ether");
                });

                const receipt = await contract.methods
                    .Donate(totalAmountInWei, promisesDonatedTo, amountsDonated)
                    .send({
                        from: account,
                        value: totalAmountInWei,
                    });
                console.log("Receipt:", receipt);
            } catch (error) {
                console.error(error);
            }
        }
    };
    return (
        <form onSubmit={donate} className="stack">
            <Stack
                direction="column"
                spacing={1}
                padding={1}
                justifyContent="center"
                alignItems="center"
            >
                <DonationPromisesList
                    promises={promises}
                    setPromises={setPromises}
                />
                <Box display="flex" justifyContent="flex-end">
                    <Tooltip title="Donate to Party">
                        <IconButton color="success" type="submit">
                            <CheckCircleIcon />
                        </IconButton>
                    </Tooltip>
                </Box>
            </Stack>
        </form>
    );
};

export default DonationForm;
