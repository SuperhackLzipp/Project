import React from "react";
import { PartyPromisesForm } from "../components/PartyPromisesForm";
import { Box } from "@mui/material";

export const CreatePartyProgramPage: React.FC = () => {
    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="100vh"
            padding={1}
        >
            <PartyPromisesForm />
        </Box>
    );
};

export default CreatePartyProgramPage;
