import React, { useState, useEffect } from "react";
import AddressInputForm from "../components/AddressInputForm";
import AddForm from "../components/AddForm";
import { Box } from "@mui/material";
import Web3 from "web3";

import { ABI_PARTY } from "../config/config";

interface Promise {
    title: string;
    description: string;
}

export const EditPartyPromisePage: React.FC = () => {
    const [contractAddress, setContractAddress] = useState<string | null>(null);
    const [promises, setPromises] = useState<Array<Promise>>([]);

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
                console.log("address", contractAddress);

                try {
                    const accounts = await web3.eth.getAccounts();
                    const account = accounts[0];

                    const promisesData: [string[], string[], boolean[]] =
                        await contract.methods.GetPromises().call({
                            from: account,
                        });
                    console.log(promisesData);
                    const promiseTitles = promisesData[0].map((title: string) =>
                        web3.utils.hexToUtf8(title).replace(/\u0000/g, "")
                    );
                    const descriptions = promisesData[1];

                    setPromises(
                        promiseTitles.map((title, index) => ({
                            title,
                            description: descriptions[index],
                        }))
                    );
                    for (let i = 0; i < promiseTitles.length; i++) {
                        console.log(promiseTitles[i], descriptions[i]);
                    }
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
                <AddForm
                    contractAddress={contractAddress}
                    oldPromises={promises}
                />
            )}
        </Box>
    );
};

export default EditPartyPromisePage;
