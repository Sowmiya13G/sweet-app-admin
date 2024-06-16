import React, { useState } from "react";
import {
  Box,
  CssBaseline,
  ListItemIcon,
  Toolbar,
  Typography,
  IconButton,
  Badge,
} from "@mui/material";
import Sidebar from "./sideBar/sideBar";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import NotificationsIcon from "@mui/icons-material/Notifications";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
const Layout = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false); // State to track sidebar visibility

  const handleToggleSidebar = () => {
    setIsOpen(false);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Sidebar open={isOpen} setOpen={handleToggleSidebar} />{" "}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 1,
          pt: 2,
          height: "auto",
          opacity: isOpen ? 0 : 1,
          overflow: "hidden",
          transition: "opacity 0.3s ease-in-out, height 0.3s ease-in-out",
        }}
      >
        <Toolbar
          sx={{
            background: "#22222e",
            borderRadius: "10px",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: { md: "space-between", xs: "space-between" },
          }}
        >
          <div className="d-flex align-items-center">
            <IconButton
              sx={{ display: { xs: "block", md: "none" } }}
              onClick={() => setIsOpen(true)}
            >
              <MenuIcon style={{ color: "white" }} sx={{ fontSize: 30 }} />
            </IconButton>

            <Typography variant="h6" sx={{ marginX: 2 }} noWrap>
              Foodie
            </Typography>
          </div>

          <Badge badgeContent={400} overlap="circular" color="success">
            <NotificationsIcon
              style={{ color: "white" }}
              sx={{ fontSize: 34 }}
            />
          </Badge>
        </Toolbar>
        {children}
      </Box>
    </Box>
  );
};

export default Layout;
