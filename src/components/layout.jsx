import React, { useState } from "react";

// mui components
import FoodBankIcon from "@mui/icons-material/FoodBank";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsIcon from "@mui/icons-material/Notifications";
import {
  Badge,
  Box,
  CssBaseline,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";

// custom components
import Sidebar from "./sideBar/sideBar";

const Layout = ({ children }) => {
  // local states
  const [isOpen, setIsOpen] = useState(false);

  // functions
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

            <Typography
              variant="h6"
              sx={{
                display: "flex",
                alignItems: "center",
              }}
              noWrap
            >
              <FoodBankIcon
                style={{ color: "white" }}
                sx={{ fontSize: 30, marginRight: 2 }}
              />
              Then Mittai
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
