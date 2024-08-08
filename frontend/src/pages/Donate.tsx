import React, { useState } from "react";
import AddressInputForm from "../components/AddressInputForm";
import { Box } from "@mui/material";

export const DonationPage: React.FC = () => {
    const [contractAddress, setContractAddress] = useState<string>("");
    const [validAddressSet, setValidAddressSet] = useState<boolean>(false);

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
