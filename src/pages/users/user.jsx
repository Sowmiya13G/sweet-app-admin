import React, { useEffect, useState } from "react";

// mui components
import AccountBalanceRoundedIcon from "@mui/icons-material/AccountBalanceRounded";
import DiningIcon from "@mui/icons-material/Dining";
import LocalAtmIcon from "@mui/icons-material/LocalAtm";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import PersonIcon from "@mui/icons-material/Person";
import RamenDiningRoundedIcon from "@mui/icons-material/RamenDiningRounded";
import TakeoutDiningIcon from "@mui/icons-material/TakeoutDining";
import {
  Avatar,
  Box,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  OutlinedInput,
  Paper,
  Typography
} from "@mui/material";

const Users = () => {
  // local states
  const [orderIDCard, setOrderIDCard] = useState("");
  const [orderData, setOrderData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  // -------------------------------- USE EFFECTS --------------------------------

  useEffect(() => {
    const fetchOrderData = () => {
      try {
        // write logic to fetch data
      } catch (error) {
        console.error("Error fetching order data: ", error);
      }
    };

    fetchOrderData();
  }, []);

  // -------------------------------- COMPONENT STYLES --------------------------------

  const subGridItemStyles = {
    display: "flex",
    flexDirection: "column",
    alignItems: "start",
    cursor: "pointer",
    width: "100%",
    padding: 2,
    border: "none",
    color: "#000",
    transition: "color 1.2s ease-in-out, width 1.2s ease-in-out",
  };
  const taskGridItemStyles = {
    display: "flex",
    flexDirection: "column",
    alignItems: "start",
    width: "100%",
    backgroundColor: "none",
    cursor: "pointer",
  };
  const iconStyle = {
    fontSize: 40,
    marginBottom: 1,
  };

  const scrollHorbarStyles = {
    overflowY: "auto",
    overflowX: "auto",
    "&::-webkit-scrollbar": {
      height: 0,
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: "transparent",
    },
    "-ms-overflow-style": "none", 
    "scrollbar-width": "none", 
  };

  const iconContainerStyle = {
    width: "100%",
    height: 60,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-around",
    borderRadius: 2,
    backgroundColor: "#00000011", 
    marginBottom: 1,
  };
  const textalignCenter = {
    display: "flex",
    alignItems: "center",
    justifyContent: "start",
    paddingLeft: 2,
    width: { xs: "100%", md: "50%" },
    marginBottom: 2,
  };

  const nameCardStyle = {
    display: "flex",
    flexDirection: "column",
    mb: "10px",
    backgroundColor: "#00000011",
    color: "#000",
    px: 2,
    width: "100%",
    height: 60,
    justifyContent: "space-around",
    borderRadius: 2,
  };

  // -------------------------------- FUNCTIONALITIES --------------------------------

  const handleOrderCardClick = (phoneNumber, index) => {
    setOrderIDCard(phoneNumber);
  };

  // Filter orderData based on searchQuery

  const filteredOrders = orderData
    .filter((order, index, self) => {
      return (
        index === self.findIndex((o) => o.phoneNumber === order.phoneNumber)
      );
    })
    .filter((order) => {
      return (
        order.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.phoneNumber.includes(searchQuery)
      );
    });

  // -------------------------------- RENDER UI --------------------------------

  const userList = () => {
    return (
      <Box
        sx={{
          width: { xs: "100%", md: "35%" },
          height: { xs: 450, md: 550 },
          mr: 1,
          p: 1,
          backgroundColor: "#fff",
          borderRadius: 2,
        }}
      >
        <Typography
          gutterBottom
          sx={{
            color: "#000",
            fontSize: 20,
            mt: 1,
            fontWeight: 600,
            textAlign: "center",
          }}
        >
          User List
        </Typography>
        <Box sx={{ px: 2, mb: 1 }}>
          <OutlinedInput
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ borderRadius: "10px" }}
            fullWidth
            placeholder="Search Name"
          />
        </Box>
        {filteredOrders.length ? (
          <Box
            sx={{
              ...scrollHorbarStyles,
              width: "100%",
              height: 460,
            }}
          >
            {filteredOrders.map((order, index) => (
              <Paper
                key={index}
                sx={{
                  ...taskGridItemStyles,
                  px: 2,
                }}
                onClick={() => handleOrderCardClick(order.phoneNumber, index)}
              >
                <Box
                  sx={{
                    ...nameCardStyle,
                    borderLeft:
                      orderIDCard === order.phoneNumber
                        ? "5px solid #22222E"
                        : "none",
                    transition:
                      "background-color 0.2s ease-in-out, color 0.2s ease-in-out, border-left 0.2s ease-in-out",
                    ":hover": {
                      background: "#00000020",
                    },
                  }}
                >
                  <Typography sx={{ fontWeight: "bold", fontSize: 16 }}>
                    Name: {order.name}
                  </Typography>
                  <Typography sx={{ fontWeight: "bold", fontSize: 16 }}>
                    Phone Number: {order.phoneNumber}
                  </Typography>
                </Box>
              </Paper>
            ))}
          </Box>
        ) : (
          <Box
            sx={{
              width: "100%",
              height: 460,
              textAlign: "center",
              mt: "30%",
            }}
          >
            No Users
          </Box>
        )}
      </Box>
    );
  };

  const orderDetails = () => {
    return (
      <Box
        sx={{
          width: { xs: "100%", md: "65%" },
          height: 550,

          backgroundColor: "#ffffff",
          ...scrollHorbarStyles,
          borderRadius: 2,
        }}
      >
        <Typography
          gutterBottom
          sx={{
            color: "#000",
            fontSize: 20,
            m: 1,
            fontWeight: 600,
            textAlign: "center",
          }}
        >
          Order Details
        </Typography>
        {orderData
          .filter((x) => x.phoneNumber === orderIDCard)
          .map((order, index) => (
            <Paper
              key={index}
              sx={{
                ...subGridItemStyles,
              }}
            >
              <Box
                sx={{
                  ...iconContainerStyle,
                  justifyContent: "space-between",
                  px: 2,
                }}
              >
                <Typography sx={{ fontWeight: "bold", fontSize: 16 }}>
                  Order ID: {order.orderID}
                </Typography>
                <RamenDiningRoundedIcon
                  sx={{ ...iconStyle, color: "#626fa0" }}
                />
              </Box>

              <Divider
                sx={{ backgroundColor: "#00000090", width: "100%", my: 1 }}
              />
              <Box
                sx={{
                  display: "flex",
                  width: "100%",
                  flexWrap: "wrap",
                  fontSize: 10,
                }}
              >
                <Typography sx={textalignCenter}>
                  Name:
                  <PersonIcon sx={{ m: 0, color: "#626fa0", fontSize: 25 }} />
                  {order.name}
                </Typography>
                <Typography sx={textalignCenter}>
                  Phone Number:
                  <LocalPhoneIcon
                    sx={{ m: 0, color: "#626fa0", fontSize: 25 }}
                  />
                  {order.phoneNumber}
                </Typography>
                <Typography sx={textalignCenter}>
                  Delivery Method:
                  {order.deliveryMethod == "Dine-In" ? (
                    <DiningIcon sx={{ m: 0, color: "#626fa0", fontSize: 25 }} />
                  ) : (
                    <TakeoutDiningIcon
                      sx={{ m: 0, color: "#626fa0", fontSize: 25 }}
                    />
                  )}
                  {order.deliveryMethod}
                </Typography>

                <Typography sx={textalignCenter}>
                  Payment Method:
                  {order.paymentMethod == "online" ? (
                    <AccountBalanceRoundedIcon
                      sx={{ m: 0, color: "#626fa0", fontSize: 25 }}
                    />
                  ) : (
                    <LocalAtmIcon
                      sx={{ m: 0, color: "#626fa0", fontSize: 25 }}
                    />
                  )}
                  {order.paymentMethod}
                </Typography>
                <Typography sx={textalignCenter}>
                  Order Status: {order.orderStatus}
                </Typography>
              </Box>

              <Typography sx={{ ...textalignCenter, fontWeight: 600 }}>
                Total Price: ₹{order.totalPrice}
              </Typography>
              <Divider
                sx={{ backgroundColor: "#00000090", width: "100%", my: 1 }}
              />

              <Typography
                sx={{
                  fontSize: 16,
                  textTransform: "uppercase",
                  fontWeight: 600,
                }}
              >
                Order Items:
              </Typography>
              <List>
                {order.cartItems.map((item, idx) => (
                  <ListItem key={idx}>
                    <ListItemAvatar>
                      <Avatar src={item.img} alt={item.dishName} />
                    </ListItemAvatar>
                    <ListItemText
                      primary={`${item.dishName} (QTY:${item.quantity})`}
                      secondary={`Category: ${item.category}, Price: ${item.price}`}
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          ))}
      </Box>
    );
  };
  return (
    <Box
      sx={{
        display: { xs: "block", md: "block" },
        width: "100%",
        m: 2,
      }}
    >
      <Box
        sx={{
          display: { xs: "block", md: "flex" },
          width: "100%",
          justifyContent: "space-between",
        }}
      ></Box>
      <Box
        sx={{
          display: { xs: "block", md: "flex" },
          width: "100%",
        }}
      >
        {userList()}
        {orderIDCard && orderDetails()}
      </Box>
    </Box>
  );
};

export default Users;
