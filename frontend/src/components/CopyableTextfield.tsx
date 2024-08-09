import React, { useState } from "react";
import { TextField, IconButton, InputAdornment } from "@mui/material";
import { ContentCopy as ContentCopyIcon } from "@mui/icons-material";

const CopyableTextField = ({ value }: { value: string }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(value).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000); // Reset copied state after 2 seconds
        });
    };

    return (
        <TextField
            value={value}
            InputProps={{
                readOnly: true,
                endAdornment: (
                    <InputAdornment position="end">
                        <IconButton onClick={handleCopy}>
                            <ContentCopyIcon />
                        </IconButton>
                    </InputAdornment>
                ),
            }}
        />
    );
};

export default CopyableTextField;
