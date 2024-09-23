import React, { useEffect } from "react";

// mui components
import ContentPasteSearchIcon from "@mui/icons-material/ContentPasteSearch";
import DashboardIcon from "@mui/icons-material/Dashboard";
import DinnerDiningIcon from "@mui/icons-material/DinnerDining";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import PeopleIcon from "@mui/icons-material/People";
import PlaceIcon from "@mui/icons-material/Place";
import ViewCarouselIcon from '@mui/icons-material/ViewCarousel';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";

// custom components

// firebase

// other packages
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Sidebar = ({ open, setOpen }) => {
  // local states
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedLink, setSelectedLink] = React.useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setSelectedLink(location.pathname);
  }, [location]);

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
  
  const handleLogout = async () => {
    try {
      toast.success("Logout successful");
      navigate("/login");
    } catch (error) {
      toast.error(`Error: ${error.message}`);
    }
  };

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
              selectedLink === "/dashboard" ? "#d79f11" : "transparent",
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
              selectedLink === "/categories" ? "#d79f11" : "transparent",
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
              selectedLink === "/orders" ? "#d79f11" : "transparent",
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
          to="/users"
          style={{
            margin: "15px",
            height: "70px",
            borderRadius: "15px",
            backgroundColor:
              selectedLink === "/users" ? "#d79f11" : "transparent",
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
          to="/banner"
          style={{
            margin: "15px",
            height: "70px",
            borderRadius: "15px",
            backgroundColor:
              selectedLink === "/banner" ? "#d79f11" : "transparent",
          }}
          onClick={() => handleClick("/banner")}
        >
          <ListItemIcon>
            <ViewCarouselIcon style={{ color: "white" }} />
          </ListItemIcon>
          <ListItemText
            style={{ display: isOpen ? "flex" : "none" }}
            primary="location"
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
              selectedLink === "/logout" ? "#d79f11" : "transparent",
          }}
          onClick={() => handleLogout("/logout")}
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
