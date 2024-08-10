import React from "react";
import { List, ListItem, ListItemText, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

interface Promise {
    title: string;
    description: string;
    attester: string;
}

interface PromisesListProps {
    promises: Promise[];
    setPromises: React.Dispatch<React.SetStateAction<Promise[]>>;
}

const PromisesList: React.FC<PromisesListProps> = ({
    promises,
    setPromises,
}) => {
    const handleDelete = (index: number) => {
        const updatedPromises = promises.filter((_, i) => i !== index);
        setPromises(updatedPromises);
    };

    return (
        <List className="formItem scrollable-list">
            {promises.map((promise, index) => (
                <ListItem key={index} divider>
                    <ListItemText
                        primary={promise.title}
                        secondary={
                            <>
                                <div>Description: {promise.description}</div>
                                <div>Attester: {promise.attester}</div>
                            </>
                        }
                    />
                    <IconButton
                        type="submit"
                        color="error"
                        onClick={() => handleDelete(index)}
                    >
                        <DeleteIcon />
                    </IconButton>
                </ListItem>
            ))}
        </List>
    );
};

export default PromisesList;
