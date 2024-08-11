import React from "react";
import { List, ListItem, IconButton, TextField, Stack } from "@mui/material";

interface Promise {
    title: string;
    description: string;
    attester: string;
}

interface ViewPromisesListProps {
    promises: Promise[];
}

const ViewPromisesList: React.FC<ViewPromisesListProps> = ({ promises }) => {
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
                            multiline
                            rows={5}
                            variant="outlined"
                            label="Description"
                            style={{ width: "100%" }}
                            InputProps={{
                                readOnly: true,
                            }}
                        />
                    </Stack>
                </ListItem>
            ))}
        </List>
    );
};

export default ViewPromisesList;
