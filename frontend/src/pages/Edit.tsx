import React, { useState } from "react";
import AddressInputForm from "../components/AddressInputForm";
import { Box } from "@mui/material";

export const EditPartyPromisePage: React.FC = () => {
    const [contractAddress, setContractAddress] = useState<string>("");

    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="100vh"
            padding={1}
        >
            {contractAddress === "" ? (
                <AddressInputForm
                    contractAddress={contractAddress}
                    setContractAddress={setContractAddress}
                />
            ) : (
                <></>
            )}
        </Box>
    );
};

export default EditPartyPromisePage;
