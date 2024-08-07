import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    Drawer,
    List,
    ListItem,
    ListItemText,
    Button,
    Box,
    Tooltip,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import WalletIcon from "@mui/icons-material/Wallet";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

export const PartyPromisesAppBar: React.FC = () => {
    return (
        <AppBar position="static">
            <Toolbar>
                <IconButton
                    component={Link}
                    to="/"
                    size="large"
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    sx={{ mr: 2 }}
                    onClick={() => {}}
                >
                    <HomeIcon />
                </IconButton>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    MyApp
                </Typography>
                <Tooltip title="Create new Party Program">
                    <IconButton
                        component={Link}
                        to="/create"
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2 }}
                        onClick={() => {}}
                    >
                        <NoteAddIcon />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Attest Party Promise">
                    <IconButton
                        component={Link}
                        to="/attest"
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2 }}
                        onClick={() => {}}
                    >
                        <CheckCircleIcon />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Donate for Party Promise">
                    <IconButton
                        component={Link}
                        to="/donate"
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2 }}
                        onClick={() => {}}
                    >
                        <MonetizationOnIcon />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Connect Wallet">
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2 }}
                        onClick={() => {}}
                    >
                        <WalletIcon />
                    </IconButton>
                </Tooltip>
            </Toolbar>
        </AppBar>
    );
};

export default PartyPromisesAppBar;
