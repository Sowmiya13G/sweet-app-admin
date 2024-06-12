import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import ContentPasteSearchIcon from "@mui/icons-material/ContentPasteSearch";
import DinnerDiningIcon from "@mui/icons-material/DinnerDining";
import TableBarIcon from "@mui/icons-material/TableBar";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";

const Sidebar = ({ open, setOpen }) => {
  const [isOpen, setIsOpen] = React.useState(false); // State for sidebar visibility
  const [selectedLink, setSelectedLink] = React.useState("/dashboard"); // State to track selected link

  const drawerWidth = open ? "80%" : 240;
  const handleMouseEnter = () => {
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    setIsOpen(false);
  };

  const handleClick = (link) => {
    setOpen(false);
    setSelectedLink(link);
  };
  useEffect(() => {
    setIsOpen(open);
  }, [open]);
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: isOpen ? drawerWidth : 90,
        flexShrink: 0,
        display: { xs: open ? "block" : "none", md: "block" },
        transition: "width 0.3s ease-in-out",
        "& .MuiDrawer-paper": {
          width: isOpen ? drawerWidth : 90,
          boxSizing: "border-box",
          backgroundColor: "#22222E",
          color: "#fff",
          borderTopRightRadius: "30px",
          borderBottomRightRadius: "30px",
          overflow: "hidden",
        },
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* <Toolbar>
        <Typography variant="h6" noWrap >
          Admin Panel
        </Typography>
      </Toolbar> */}
      <List disablePadding dense={true}>
        {" "}
        <ListItem
          button
          component={Link}
          to="/dashboard"
          style={{
            margin: "15px",
            height: "70px",
            borderRadius: "15px",
            backgroundColor:
              selectedLink === "/dashboard" ? "#d79f11" : "transparent", // Set background color to gold (hex code #d79f11) for selected link
          }}
          selected={selectedLink === "/dashboard"}
          onClick={() => handleClick("/dashboard")}
        >
          {" "}
          <ListItemIcon>
            <DashboardIcon style={{ color: "white" }} />
          </ListItemIcon>
          <ListItemText
            style={{ display: isOpen ? "flex" : "none" }}
            primary="Dashboard"
          />
        </ListItem>
        <ListItem
          button
          component={Link}
          to="/categories"
          style={{
            margin: "15px",
            height: "70px",
            borderRadius: "15px",
            backgroundColor:
              selectedLink === "/categories" ? "#d79f11" : "transparent", // Set background color to gold (hex code #d79f11) for selected link
          }}
          onClick={() => handleClick("/categories")}
        >
          <ListItemIcon>
            <DinnerDiningIcon style={{ color: "white" }} />
          </ListItemIcon>
          <ListItemText
            style={{ display: isOpen ? "flex" : "none" }}
            primary="Categories"
          />
        </ListItem>
        <ListItem
          button
          component={Link}
          to="/offers"
          style={{
            margin: "15px",
            height: "70px",
            borderRadius: "15px",
            backgroundColor:
              selectedLink === "/offers" ? "#d79f11" : "transparent",
          }}
          selected={selectedLink === "/offers"}
          onClick={() => handleClick("/offers")}
        >
          <ListItemIcon>
            <LocalOfferIcon style={{ color: "white" }} />
          </ListItemIcon>
          <ListItemText
            style={{ display: isOpen ? "flex" : "none" }}
            primary="Offers"
          />
        </ListItem>
        <ListItem
          button
          component={Link}
          to="/orders"
          style={{
            margin: "15px",
            height: "70px",
            borderRadius: "15px",
            backgroundColor:
              selectedLink === "/orders" ? "#d79f11" : "transparent", // Set background color to gold (hex code #d79f11) for selected link
          }}
          onClick={() => handleClick("/orders")}
        >
          <ListItemIcon>
            <ContentPasteSearchIcon style={{ color: "white" }} />
          </ListItemIcon>
          <ListItemText
            style={{ display: isOpen ? "flex" : "none" }}
            primary="Order List"
          />
        </ListItem>
        <ListItem
          button
          component={Link}
          to="/tables"
          style={{
            margin: "15px",
            height: "70px",
            borderRadius: "15px",
            backgroundColor:
              selectedLink === "/tables" ? "#d79f11" : "transparent", // Set background color to gold (hex code #d79f11) for selected link
          }}
          onClick={() => handleClick("/tables")}
        >
          <ListItemIcon>
            <TableBarIcon style={{ color: "white" }} />
          </ListItemIcon>
          <ListItemText
            style={{ display: isOpen ? "flex" : "none" }}
            primary="Tables"
          />
        </ListItem>
        <ListItem
          button
          component={Link}
          to="/users"
          style={{
            margin: "15px",
            height: "70px",
            borderRadius: "15px",
            backgroundColor:
              selectedLink === "/users" ? "#d79f11" : "transparent", // Set background color to gold (hex code #d79f11) for selected link
          }}
          onClick={() => handleClick("/users")}
        >
          <ListItemIcon>
            <PeopleIcon style={{ color: "white" }} />
          </ListItemIcon>
          <ListItemText
            style={{ display: isOpen ? "flex" : "none" }}
            primary="Users"
          />
        </ListItem>
        <ListItem
          button
          component={Link}
          to="/users"
          style={{
            margin: "15px",
            height: "70px",
            borderRadius: "15px",
            backgroundColor:
              selectedLink === "/users" ? "#d79f11" : "transparent", // Set background color to gold (hex code #d79f11) for selected link
          }}
          onClick={() => handleClick("/users")}
        >
          <ListItemIcon>
            <PeopleIcon style={{ color: "white" }} />
          </ListItemIcon>
          <ListItemText
            style={{ display: isOpen ? "flex" : "none" }}
            primary="Logout"
          />
        </ListItem>
      </List>
    </Drawer>
  );
};

export default Sidebar;
