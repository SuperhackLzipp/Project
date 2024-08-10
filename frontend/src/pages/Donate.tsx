import React, { useState, useEffect } from "react";
import AddressInputForm from "../components/AddressInputForm";
import DonationForm from "../components/DonationForm";
import { Box } from "@mui/material";
import Web3 from "web3";

import { ABI_PARTY } from "../config/config";

export const DonationPage: React.FC = () => {
    const [contractAddress, setContractAddress] = useState<string | null>(null);
    const [promises, setPromises] = useState<
        Array<{ title: string; description: string; amount: number }>
    >([]);

    useEffect(() => {
        const loadPromises = async () => {
            if (contractAddress === null) return;

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

                    const promisesData: [string[], string[], boolean[]] =
                        await contract.methods.GetPromises().call({
                            from: account,
                        });

                    const promiseTitles = promisesData[0].map((title: string) =>
                        web3.utils.hexToUtf8(title).replace(/\u0000/g, "")
                    );
                    const descriptions = promisesData[1];

                    console.log("Promise Titles:", promiseTitles);
                    console.log("Descriptions:", descriptions);
                    setPromises(
                        promiseTitles.map((title, index) => ({
                            title,
                            description: descriptions[index],
                            amount: 0,
                        }))
                    );
                } catch (error) {
                    console.error(error);
                }
            }
        };
        loadPromises();
    }, [contractAddress]);

    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="100vh"
            padding={1}
        >
            {contractAddress === null ? (
                <AddressInputForm setContractAddress={setContractAddress} />
            ) : (
                <DonationForm
                    contractAddress={contractAddress}
                    promises={promises}
                    setPromises={setPromises}
                />
            )}
        </Box>
    );
};

export default DonationPage;
