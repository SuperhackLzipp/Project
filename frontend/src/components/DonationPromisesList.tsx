import React from "react";
import { List, ListItem, TextField, Stack, Box } from "@mui/material";

interface Promise {
    title: string;
    description: string;
    amount: number;
}

interface NewPromisesListProps {
    promises: Promise[];
    setPromises: React.Dispatch<React.SetStateAction<Promise[]>>;
}

const NewPromisesList: React.FC<NewPromisesListProps> = ({
    promises,
    setPromises,
}) => {
    const handleAmountChange = (index: number, newAmount: number) => {
        const updatedPromises = promises.map((promise, i) =>
            i === index ? { ...promise, amount: newAmount } : promise
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
                                type="number"
                                value={promise.amount}
                                onChange={(e) =>
                                    handleAmountChange(
                                        index,
                                        parseFloat(e.target.value)
                                    )
                                }
                                label="Amount"
                                variant="outlined"
                                size="small"
                                style={{ flex: 1 }}
                            />
                        </Stack>
                        <TextField
                            value={promise.description}
                            multiline
                            rows={5}
                            variant="outlined"
                            InputProps={{
                                readOnly: true,
                            }}
                            style={{ width: "100%" }}
                        />
                    </Stack>
                </ListItem>
            ))}
        </List>
    );
};

export default NewPromisesList;
