import React, { useState } from "react";

import { Box, IconButton, Tooltip, TextField, Stack } from "@mui/material";

import AddIcon from "@mui/icons-material/Add";

interface NewPromise {
    title: string;
    description: string;
    attester: string;
}

interface NewPromiseFormProps {
    newPromise: NewPromise;
    isAddressValid: boolean;
    isTitleUnique: boolean;
    setIsTitleUnique: (isTitleUnique: boolean) => void;
    handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    promises: Array<{ title: string; description: string; attester: string }>;
    addPromise: (event: React.FormEvent<HTMLFormElement>) => void;
}

const NewPromiseForm: React.FC<NewPromiseFormProps> = ({
    newPromise,
    isAddressValid,
    isTitleUnique,
    setIsTitleUnique,
    handleChange,
    promises,
    addPromise,
}) => {
    const [titleLen, setTitleLen] = useState<number>(0);

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const input = e.target.value;
        const encoder = new TextEncoder();
        const encodedInput = encoder.encode(input);
        setTitleLen(encodedInput.length);
        const titleExists = promises.some(
            (promise) =>
                promise.title.trim().toLowerCase() ===
                input.trim().toLowerCase()
        );
        setIsTitleUnique(!titleExists);
    };

    return (
        <form onSubmit={addPromise} className="stack">
            <Stack direction="column" spacing={1} padding={1}>
                <Stack direction="row" spacing={1}>
                    <TextField
                        required
                        error={isTitleUnique === false || titleLen > 32}
                        id="title-field"
                        label="Title"
                        helperText={
                            isTitleUnique === false
                                ? "Must be unique"
                                : newPromise.title.length > 32
                                ? "Title is too long"
                                : ""
                        }
                        variant="outlined"
                        name="title"
                        value={newPromise.title}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            handleChange(e);
                            handleTitleChange(e);
                        }}
                        style={{ flex: 2 }}
                    />
                    <TextField
                        required
                        error={isAddressValid === false}
                        id="attester-field"
                        label="Attester Public Address"
                        helperText={
                            isAddressValid === false
                                ? "Not a valid Address"
                                : ""
                        }
                        variant="outlined"
                        name="attester"
                        value={newPromise.attester}
                        onChange={handleChange}
                        fullWidth
                        style={{ flex: 1 }}
                    />
                </Stack>
                <TextField
                    required
                    id="filled-multiline-static-description"
                    label="Description"
                    multiline
                    rows={10}
                    variant="outlined"
                    name="description"
                    value={newPromise.description}
                    onChange={handleChange}
                    fullWidth
                />
                <Box display="flex" justifyContent="right">
                    <Tooltip title="Add Promise">
                        <IconButton type="submit" color="success">
                            <AddIcon />
                        </IconButton>
                    </Tooltip>
                </Box>
            </Stack>
        </form>
    );
};

export default NewPromiseForm;
