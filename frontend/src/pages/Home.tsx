import React from "react";
import { Link } from "react-router-dom";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { Button, Typography, Box, Stack } from "@mui/material";

export const Home: React.FC = () => {
    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="100vh"
            padding={1}
        >
            <Stack spacing={1} padding={2} direction="column">
                <Typography variant="h2" component="div" sx={{ flexGrow: 1 }}>
                    Welcome! How about you try one of these options...
                </Typography>
                <Stack spacing={1} padding={2} direction="row">
                    <Button
                        component={Link}
                        variant="contained"
                        to="/create"
                        size="large"
                        color="inherit"
                        startIcon={<NoteAddIcon />}
                        sx={{ mr: 2 }}
                    >
                        Create new Party Program
                    </Button>
                    <Button
                        component={Link}
                        variant="contained"
                        to="/attest"
                        size="large"
                        color="inherit"
                        startIcon={<CheckCircleIcon />}
                        sx={{ mr: 2 }}
                    >
                        Attest Party Promise
                    </Button>
                    <Button
                        component={Link}
                        variant="contained"
                        to="/donate"
                        size="large"
                        color="inherit"
                        startIcon={<MonetizationOnIcon />}
                        sx={{ mr: 2 }}
                    >
                        Donate for Party Promise
                    </Button>
                </Stack>
            </Stack>
        </Box>
    );
};

export default Home;
