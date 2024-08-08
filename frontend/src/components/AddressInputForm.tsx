import React, { useState } from "react";
import { Box, Stack, IconButton, TextField, Tooltip } from "@mui/material";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import { isAddress } from "web3-validator";

interface AddressInputFormProps {
    contractAddress: string;
    setContractAddress: React.Dispatch<React.SetStateAction<string>>;
}

const AddressInputForm: React.FC<AddressInputFormProps> = ({
    contractAddress,
    setContractAddress,
}) => {
    const [isAddressValid, setIsAddressValid] = useState<boolean | null>(null);

    const loadContract = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!isAddress(contractAddress)) {
            setIsAddressValid(false);
            return;
        }
        setIsAddressValid(true);
    };

    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="100vh"
            padding={1}
        >
            <form onSubmit={loadContract}>
                <Stack
                    direction="row"
                    spacing={1}
                    padding={1}
                    className="stack"
                >
                    {isAddressValid === false ? (
                        <TextField
                            required
                            error
                            id="outlined-error-helper-text"
                            label="Contract Address"
                            helperText="Not a valid Address"
                            value={contractAddress}
                            onChange={(e) => setContractAddress(e.target.value)}
                            fullWidth
                        />
                    ) : (
                        <TextField
                            required
                            id="party-name-field"
                            label="Contract Address"
                            variant="outlined"
                            value={contractAddress}
                            onChange={(e) => setContractAddress(e.target.value)}
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
                            <FileUploadIcon />
                        </IconButton>
                    </Tooltip>
                </Stack>
            </form>
        </Box>
    );
};

export default AddressInputForm;
