import React from "react";
import DonationPromisesList from "./DonationPromisesList";
import { Box, IconButton, Stack } from "@mui/material";
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
    const [amount, setAmount] = React.useState<number>(0);

    const donate = async () => {
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
                    return web3.utils.utf8ToHex(promise.title);
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
            } catch (error) {
                console.error(error);
            }
        }
    };
    return (
        <form>
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
                <IconButton color="success">
                    <CheckCircleIcon />
                </IconButton>
            </Stack>
        </form>
    );
};

export default DonationForm;
