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
    handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    addPromise: (event: React.FormEvent<HTMLFormElement>) => void;
}

const NewPromiseForm: React.FC<NewPromiseFormProps> = ({
    newPromise,
    isAddressValid,
    isTitleUnique,
    handleChange,
    addPromise,
}) => {
    const [titleLen, setTitleLen] = useState<number>(0);

    return (
        <form onSubmit={addPromise} className="stack">
            <Stack direction="column" spacing={1} padding={1}>
                <Stack direction="row" spacing={1}>
                    <TextField
                        required
                        error={isTitleUnique === false}
                        id="title-field"
                        label="Title"
                        helperText={
                            isTitleUnique === false ? "Must be unique" : ""
                        }
                        variant="outlined"
                        name="title"
                        value={newPromise.title}
                        onChange={handleChange}
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
