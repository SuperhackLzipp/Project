import React, { useState } from "react";
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
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

export const PartyPromisesAppBar: React.FC = () => {
    const [drawerOpen, setDrawerOpen] = useState(false);

    const toggleDrawer =
        (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
            if (
                event.type === "keydown" &&
                ((event as React.KeyboardEvent).key === "Tab" ||
                    (event as React.KeyboardEvent).key === "Shift")
            ) {
                return;
            }

            setDrawerOpen(open);
        };

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    {/* <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2 }}
                        onClick={() => setDrawerOpen(true)}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography
                        variant="h6"
                        component="div"
                        sx={{ flexGrow: 1 }}
                    >
                        MyApp
                    </Typography> */}
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2 }}
                        onClick={() => setDrawerOpen(true)}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography
                        variant="h6"
                        component="div"
                        sx={{ flexGrow: 1 }}
                    >
                        MyApp
                    </Typography>
                    {/* <Button color="inherit">Create Program</Button>
                    <Button color="inherit">Login</Button>
                    <Button color="inherit">Signup</Button> */}
                </Toolbar>
            </AppBar>
            {/* <Drawer
                anchor="left"
                open={drawerOpen}
                onClose={toggleDrawer(false)}
            >
                <List>
                    <ListItem onClick={toggleDrawer(false)}>
                        <ListItemText primary="Option 1" />
                    </ListItem>
                    <ListItem onClick={toggleDrawer(false)}>
                        <ListItemText primary="Option 2" />
                    </ListItem>
                </List>
            </Drawer> */}
        </Box>
    );
};

export default PartyPromisesAppBar;
