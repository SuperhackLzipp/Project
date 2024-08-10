import React from "react";
import {
    List,
    ListItem,
    IconButton,
    TextField,
    Stack,
    Box,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

interface Promise {
    title: string;
    description: string;
    attester: string;
}

interface NewPromisesListProps {
    promises: Promise[];
    setPromises: React.Dispatch<React.SetStateAction<Promise[]>>;
}

const NewPromisesList: React.FC<NewPromisesListProps> = ({
    promises,
    setPromises,
}) => {
    const handleDelete = (index: number) => {
        const updatedPromises = promises.filter((_, i) => i !== index);
        setPromises(updatedPromises);
    };

    const handleFieldChange = (
        index: number,
        field: keyof Promise,
        value: string
    ) => {
        const updatedPromises = promises.map((promise, i) =>
            i === index ? { ...promise, [field]: value } : promise
        );
        setPromises(updatedPromises);
    };

    return (
        <List className="formItem scrollable-list">
            {promises.map((promise, index) => (
                <ListItem key={index} divider>
                    <Stack
                        direction="column"
                        spacing={1}
                        padding={1}
                        style={{ width: "100%" }}
                    >
                        <Stack
                            direction="row"
                            spacing={1}
                            style={{ width: "100%" }}
                        >
                                <TextField
                                    value={promise.title}
                                    variant="outlined"
                                    label="Title"
                                    style={{ flex: 2 }}
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                />
                                <TextField
                                    value={promise.attester}
                                    variant="outlined"
                                    label="Attester"
                                    style={{ flex: 1 }}
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                />
                        </Stack>
                        <TextField
                            value={promise.description}
                            onChange={(e) =>
                                handleFieldChange(
                                    index,
                                    "description",
                                    e.target.value
                                )
                            }
                            multiline
                            rows={5}
                            variant="outlined"
                            label="Description"
                            style={{ width: "100%" }}
                        />
                        <IconButton
                            type="submit"
                            color="error"
                            onClick={() => handleDelete(index)}
                            style={{ alignSelf: "flex-end" }}
                        >
                            <DeleteIcon />
                        </IconButton>
                    </Stack>
                </ListItem>
            ))}
        </List>
    );
};

export default NewPromisesList;
