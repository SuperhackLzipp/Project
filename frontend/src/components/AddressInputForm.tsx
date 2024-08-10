import React, { useState } from "react";
import { Box, Stack, TextField, Tooltip, IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { isAddress } from "web3-validator";
import web3 from "web3";

interface AddressInputFormProps {
    setContractAddress: (address: string) => void;
}

const AddressInputForm: React.FC<AddressInputFormProps> = ({
    setContractAddress,
}) => {
    const [address, setAddress] = useState<string | null>(null);
    const [isAddressValid, setIsAddressValid] = useState<boolean | null>(null);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (address === null) return;
        const trimmedAddress = address.trim();
        if (!isAddress(trimmedAddress)) {
            setIsAddressValid(false);
            return;
        }
        setIsAddressValid(true);
        setContractAddress(web3.utils.toChecksumAddress(trimmedAddress));
    };

    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="100vh"
            padding={1}
        >
            <form onSubmit={handleSubmit}>
                <Stack
                    direction="row"
                    spacing={1}
                    padding={1}
                    className="stack"
                >
                    {isAddressValid === false ||
                    (address !== null && !address.trim()) ? (
                        <TextField
                            required
                            error
                            id="outlined-error-helper-text"
                            label="Contract Address"
                            helperText="Not a valid Address"
                            value={address || ""}
                            onChange={(e) => {
                                setAddress(e.target.value);
                                setIsAddressValid(null);
                            }}
                            fullWidth
                        />
                    ) : (
                        <TextField
                            required
                            id="party-name-field"
                            label="Contract Address"
                            variant="outlined"
                            value={address || ""}
                            onChange={(e) => setAddress(e.target.value)}
                            fullWidth
                        />
                    )}
                    <Tooltip title="Upload the Promises">
                        <IconButton
                            color="success"
                            size="large"
                            edge="start"
                            type="submit"
                        >
                            <SearchIcon />
                        </IconButton>
                    </Tooltip>
                </Stack>
            </form>
        </Box>
    );
};

export default AddressInputForm;
