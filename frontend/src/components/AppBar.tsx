import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
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

import { useEthers, useEtherBalance } from "@usedapp/core";

import HomeIcon from "@mui/icons-material/Home";
import WalletIcon from "@mui/icons-material/Wallet";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import EditIcon from "@mui/icons-material/Edit";

interface PartyPromisesAppBarProps {
    account: string | null | undefined;
    etherBalance: any; // You can replace `any` with the specific type if known
    activateBrowserWallet: () => void;
}

export const PartyPromisesAppBar: React.FC<PartyPromisesAppBarProps> = ({
    account,
    etherBalance,
    activateBrowserWallet,
}) => {
    const location = useLocation();

    const isActive = (path: string) => location.pathname === path;
    return (
        <AppBar position="sticky">
            <Toolbar>
                <IconButton
                    component={Link}
                    to="/"
                    size="large"
                    edge="start"
                    color={isActive("/") ? "secondary" : "inherit"}
                    aria-label="menu"
                    sx={{ mr: 2 }}
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
                        color={isActive("/create") ? "secondary" : "inherit"}
                        aria-label="menu"
                        sx={{ mr: 2 }}
                    >
                        <NoteAddIcon />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Edit existing Program">
                    <IconButton
                        component={Link}
                        to="/edit"
                        size="large"
                        edge="start"
                        color={isActive("/edit") ? "secondary" : "inherit"}
                        aria-label="menu"
                        sx={{ mr: 2 }}
                    >
                        <EditIcon />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Attest Party Promise">
                    <IconButton
                        component={Link}
                        to="/attest"
                        size="large"
                        edge="start"
                        color={isActive("/attest") ? "secondary" : "inherit"}
                        aria-label="menu"
                        sx={{ mr: 2 }}
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
                        color={isActive("/donate") ? "secondary" : "inherit"}
                        aria-label="menu"
                        sx={{ mr: 2 }}
                    >
                        <MonetizationOnIcon />
                    </IconButton>
                </Tooltip>
                <ConnectButton
                    account={account}
                    etherBalance={etherBalance}
                    activateBrowserWallet={activateBrowserWallet}
                />
            </Toolbar>
        </AppBar>
    );
};

interface ConnectButtonProps {
    account: string | null | undefined;
    etherBalance: any; // You can replace `any` with the specific type if known
    activateBrowserWallet: () => void;
}

export const ConnectButton: React.FC<ConnectButtonProps> = ({
    account,
    etherBalance,
    activateBrowserWallet,
}) => {
    return account ? (
        <Box display="flex" alignItems="center">
            <Typography color="white" variant="body1">
                {etherBalance && JSON.stringify(etherBalance)} ETH
            </Typography>
        </Box>
    ) : (
        <IconButton color="inherit" onClick={() => activateBrowserWallet()}>
            <WalletIcon />
        </IconButton>
    );
};

export default PartyPromisesAppBar;
