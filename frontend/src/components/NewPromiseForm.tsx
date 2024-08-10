import {
    Box, IconButton, Tooltip,
    TextField, Stack
} from "@mui/material";
 
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
    return (
        <form onSubmit={addPromise} className="stack">
            <Stack direction="column" spacing={1} padding={1}>
                <Stack direction="row" spacing={1}>
                    <Box flex={2}>
                        {isTitleUnique == false ? (
                            <TextField
                                required
                                error
                                id="title-field"
                                label="Title"
                                helperText="Must be unique"
                                variant="outlined"
                                name="title"
                                value={newPromise.title}
                                onChange={handleChange}
                                fullWidth
                            />
                        ) : (
                            <TextField
                                required
                                id="title-field"
                                label="Title"
                                variant="outlined"
                                name="title"
                                value={newPromise.title}
                                onChange={handleChange}
                                fullWidth
                            />
                        )}
                    </Box>
                    <Box flex={1}>
                        {isAddressValid === false ? (
                            <TextField
                                required
                                error
                                id="attester-field"
                                label="Attester Public Address"
                                helperText="Not a valid Address"
                                variant="outlined"
                                name="attester"
                                value={newPromise.attester}
                                onChange={handleChange}
                                fullWidth
                            />
                        ) : (
                            <TextField
                                required
                                id="attester-field-error"
                                label="Attester Public Address"
                                variant="outlined"
                                name="attester"
                                value={newPromise.attester}
                                onChange={handleChange}
                                fullWidth
                            />
                        )}
                    </Box>
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
