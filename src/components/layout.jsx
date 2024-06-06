import React, { useState } from "react";
import {
  Box,
  CssBaseline,
  ListItemIcon,
  Toolbar,
  Typography,
  IconButton,
} from "@mui/material";
import Sidebar from "./sideBar";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
const Layout = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false); // State to track sidebar visibility

  const handleToggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Sidebar open={isOpen} /> {/* Pass isOpen state to Sidebar component */}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar
          sx={{
            background: "#22222e",
            // border: "1px solid #d79f11",
            borderRadius: "10px",
            color: "#fff",
            display: "flex",
            justifyContent: "space-between", // Align items horizontally
          }}
        >
          {isOpen ? (
            <IconButton onClick={handleToggleSidebar}>
              <RestaurantMenuIcon style={{ color: "white" }} />
            </IconButton>
          ) : (
            <IconButton onClick={handleToggleSidebar}>
              <MenuIcon style={{ color: "white" }} />
            </IconButton>
          )}
          <Typography variant="h6" noWrap>
            Admin Panel
          </Typography>
        </Toolbar>
        {children}
      </Box>
    </Box>
  );
};

export default Layout;
