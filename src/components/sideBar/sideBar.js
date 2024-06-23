import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
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
import PlaceIcon from "@mui/icons-material/Place";
import { signOut } from "firebase/auth";
import { auth } from "../../firebaseConfig";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import CorporateFareIcon from "@mui/icons-material/CorporateFare";
import { useSelector } from "react-redux";
const Sidebar = ({ open, setOpen }) => {
  const [isOpen, setIsOpen] = React.useState(false); // State for sidebar visibility
  const [selectedLink, setSelectedLink] = React.useState(""); // State to track selected link
  const navigate = useNavigate();
  const location = useLocation();
  const superAdmin = useSelector((state) => state.auth.isuperAdmin);
  console.log(superAdmin);
  useEffect(() => {
    setSelectedLink(location.pathname); // Update selected link based on current path
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
      await signOut(auth);
      toast.success("Logout successful");
      navigate("/login"); // Navigate to /login after logout
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
        {superAdmin && (
          <ListItem
            button
            component={Link}
            to="/hotels"
            style={{
              margin: "15px",
              height: "70px",
              borderRadius: "15px",
              backgroundColor:
                selectedLink === "/hotels" ? "#d79f11" : "transparent", // Set background color to gold (hex code #d79f11) for selected link
            }}
            selected={selectedLink === "/hotels"}
            onClick={() => handleClick("/hotels")}
          >
            {" "}
            <ListItemIcon>
              <CorporateFareIcon style={{ color: "white" }} />
            </ListItemIcon>
            <ListItemText
              style={{ display: isOpen ? "flex" : "none" }}
              primary="Hotels Management"
            />
          </ListItem>
        )}
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
          to="/location"
          style={{
            margin: "15px",
            height: "70px",
            borderRadius: "15px",
            backgroundColor:
              selectedLink === "/location" ? "#d79f11" : "transparent", // Set background color to gold (hex code #d79f11) for selected link
          }}
          onClick={() => handleClick("/location")}
        >
          <ListItemIcon>
            <PlaceIcon style={{ color: "white" }} />
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
              selectedLink === "/logout" ? "#d79f11" : "transparent", // Set background color to gold (hex code #d79f11) for selected link
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
