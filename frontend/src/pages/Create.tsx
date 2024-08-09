import React from "react";
import { PartyPromisesForm } from "../components/PartyPromisesForm";
import { Box, Button } from "@mui/material";
import { Link } from "react-router-dom";
import NoteAddIcon from "@mui/icons-material/NoteAdd";

export const CreatePartyProgramPage: React.FC = () => {
    const [contractCreated, setContractCreated] =
        React.useState<boolean>(false);

    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="100vh"
            padding={1}
        >
            {contractCreated === false ? (
                <PartyPromisesForm setContractCreated={setContractCreated} />
            ) : (
                <Button
                    component={Link}
                    variant="contained"
                    to="/create"
                    size="large"
                    color="inherit"
                    startIcon={<NoteAddIcon />}
                    sx={{ mr: 2 }}
                    onClick={() => setContractCreated(false)}
                >
                    Create new Party Program
                </Button>
            )}
        </Box>
    );
};

export default CreatePartyProgramPage;
