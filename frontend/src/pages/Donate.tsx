import React, { useState } from "react";
import AddressInputForm from "../components/AddressInputForm";
import { Box } from "@mui/material";

export const DonationPage: React.FC = () => {
    const [contractAddress, setContractAddress] = useState<string | null>(null);
    const [validAddressSet, setValidAddressSet] = useState<boolean>(false);
    const [promises, setPromises] = useState<
        Array<{ title: string; description: string; amount: number }>
    >([]);

    const loadContract = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!isAddress(contractAddress)) {
            setIsAddressValid(false);
            setValidAddressSet(false);
            return;
        }
        setIsAddressValid(true);
        setValidAddressSet(true);
        setContractAddress(web3.utils.toChecksumAddress(contractAddress));
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

                const receipt = await contract.methods.GetPromiseTitles();
            } catch (error) {
                console.error(error);
            }
        }
    };

    const getPromises = async () => {};
    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="100vh"
            padding={1}
        >
            {validAddressSet === false ? (
                <AddressInputForm
                    contractAddress={contractAddress}
                    setContractAddress={setContractAddress}
                    setValidAddressSet={setValidAddressSet}
                />
            ) : (
                <></>
            )}
        </Box>
    );
};

export default DonationPage;
