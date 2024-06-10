// src/components/Dashboard.js
import {
  Box,
  Typography,
  Paper,
  Grid,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
} from "@mui/material";
import {
  ShoppingCart,
  TableRestaurant,
  Group,
  RestaurantMenu,
} from "@mui/icons-material";
import React, { useState, useEffect } from "react";
import { collection, getDocs, onSnapshot } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import RamenDiningRoundedIcon from "@mui/icons-material/RamenDiningRounded";
import AccountBalanceRoundedIcon from "@mui/icons-material/AccountBalanceRounded";
import LocalAtmIcon from "@mui/icons-material/LocalAtm";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import DiningIcon from "@mui/icons-material/Dining";
import TakeoutDiningIcon from "@mui/icons-material/TakeoutDining";
import PersonIcon from "@mui/icons-material/Person";
import TabBar from "../../components/tabBar/tabBar";

const Dashboard = () => {
  // Mock state for orders count, tables available, total users, and dish variety
  const [ordersCount, setOrdersCount] = useState(0);
  const [tablesAvailable, setTablesAvailable] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [dishVariety, setDishVariety] = useState(0);
  const [selectedCard, setSelectedCard] = useState(0);
  const [orderData, setOrderData] = useState([]);
  const [selectedTab, setSelectedTab] = useState(1);

  const tabs = [
    { tbName: "ORDERS", id: 1 },
    { tbName: "TABLES", id: 2 },
  ];
  useEffect(() => {
    // Mock data fetching
    const fetchDashboardData = () => {
      setTablesAvailable(15); // Replace with real data fetching
      setTotalUsers(456); // Replace with real data fetching
      setDishVariety(78); // Replace with real data fetching
    };

    fetchDashboardData();
  }, []);

  const gridItemStyles = {
    height: { xs: 150, md: 200 },
    display: "flex",
    flexDirection: "column",
    alignItems: "start",
    justifyContent: "center",
    borderRadius: 2,
    minWidth: 250,
    cursor: "pointer",
    transition: "background-color 0.2s ease-in-out, color 0.2s ease-in-out",
  };
  const subGridItemStyles = {
    minHeight: { xs: 150, md: 400 },
    display: "flex",
    flexDirection: "column",
    alignItems: "start",
    borderRadius: 2,
    width: { xs: "100%", md: "100%" },
    marginBottom: 2,
    padding: 2,
    cursor: "pointer",
    transition: "background-color 0.2s ease-in-out, color 0.2s ease-in-out",
  };
  const taskGridItemStyles = {
    display: "flex",
    flexDirection: "column",
    alignItems: "start",
    width: { xs: "100%", md: "100%" },
    cursor: "pointer",
  };
  const iconStyle = {
    fontSize: 40,
    marginBottom: 1,
  };
  const scrollbarStyles = {
    overflowX: "auto",
    "&::-webkit-scrollbar": {
      height: 0,
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: "transparent",
    },
    "-ms-overflow-style": "none", // IE and Edge
    "scrollbar-width": "none", // Firefox
  };

  const scrollHorbarStyles = {
    overflowy: "auto",
    "&::-webkit-scrollbar": {
      height: 0,
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: "transparent",
    },
    "-ms-overflow-style": "none", // IE and Edge
    "scrollbar-width": "none", // Firefox
  };
  const iconContainerStyle = {
    width: "100%",
    height: 60,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-around",
    borderRadius: 2,
    backgroundColor: "#00000011", // Adjust opacity for background color
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

  const handleCardClick = (index) => {
    setSelectedCard(index);
  };
  useEffect(() => {
    const fetchOrderData = () => {
      try {
        const ordersCollection = collection(db, "orders");
        const unsubscribe = onSnapshot(ordersCollection, (orderSnapshot) => {
          const ordersList = orderSnapshot.docs.map((doc) => doc.data());
          setOrderData(ordersList);
          setOrdersCount(ordersList.length);
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
      } catch (error) {
        console.error("Error fetching order data: ", error);
      }
    };

    fetchOrderData();
  }, []);

  console.log(orderData);
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        p: { xs: 0, md: 2 },
      }}
    >
      <Typography variant="h5" gutterBottom sx={{ color: "#fff" }}>
        Welcome to the Admin Dashboard
      </Typography>

      <Box sx={{ ...scrollbarStyles }}>
        {" "}
        <Grid container spacing={2} sx={{ flexWrap: "nowrap" }}>
          {" "}
          <Grid item>
            <Paper
              elevation={6}
              sx={{
                padding: 2,
                ...gridItemStyles,
                backgroundColor: selectedCard === 0 ? "#3c3c4e" : "#fffeee",
                color: selectedCard === 0 ? "#ffffff" : "#000",
              }}
              onClick={() => {
                handleCardClick(0);
              }}
            >
              <Box sx={{ ...iconContainerStyle }}>
                <Typography variant="h6">Total Orders</Typography>
                <ShoppingCart sx={{ ...iconStyle, color: "#7291ff" }} />
              </Box>
              <Divider
                sx={{ backgroundColor: "#00000090", width: "100%", my: 1 }}
              />
              <Typography variant="h4" fontWeight={600}>
                {ordersCount}
              </Typography>
            </Paper>
          </Grid>
          <Grid item>
            <Paper
              elevation={6}
              sx={{
                padding: 2,
                ...gridItemStyles,
                backgroundColor: selectedCard === 1 ? "#3c3c4e" : "#fffeee",
                color: selectedCard === 1 ? "#ffffff" : "#000",
              }}
              onClick={() => {
                handleCardClick(1);
              }}
            >
              <Box sx={{ ...iconContainerStyle }}>
                <Typography variant="h6">Tables Available</Typography>
                <TableRestaurant sx={{ ...iconStyle, color: "#00ccff" }} />
              </Box>
              <Divider
                sx={{ backgroundColor: "#00000090", width: "100%", my: 1 }}
              />
              <Typography variant="h4" fontWeight={600}>
                {tablesAvailable}
              </Typography>
            </Paper>
          </Grid>
          <Grid item>
            <Paper
              elevation={6}
              sx={{
                padding: 2,
                ...gridItemStyles,
                backgroundColor: selectedCard === 2 ? "#3c3c4e" : "#fffeee",
                color: selectedCard === 2 ? "#ffffff" : "#000",
              }}
              onClick={() => {
                handleCardClick(2);
              }}
            >
              <Box sx={{ ...iconContainerStyle }}>
                <Typography variant="h6">Total Users</Typography>
                <Group sx={{ ...iconStyle, color: "#00f5be  " }} />
              </Box>
              <Divider
                sx={{ backgroundColor: "#00000090", width: "100%", my: 1 }}
              />
              <Typography variant="h4" fontWeight={600}>
                {totalUsers}
              </Typography>
            </Paper>
          </Grid>
          <Grid item>
            <Paper
              elevation={6}
              sx={{
                padding: 2,
                ...gridItemStyles,
                backgroundColor: selectedCard === 3 ? "#3c3c4e" : "#fffeee",
                color: selectedCard === 3 ? "#ffffff" : "#000",
              }}
              onClick={() => {
                handleCardClick(3);
              }}
            >
              <Box sx={{ ...iconContainerStyle }}>
                <Typography variant="h6">Dish Variety</Typography>
                <RestaurantMenu sx={{ ...iconStyle, color: "#626fa0" }} />
              </Box>
              <Divider
                sx={{ backgroundColor: "#00000090", width: "100%", my: 1 }}
              />
              <Typography variant="h4" fontWeight={600}>
                {dishVariety}
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>
      <Box
        sx={{
          display: "flex",
          width: "100%",
          ...scrollHorbarStyles,
          backgroundColor: "#fff",
          height: "40%",
        }}
      >
        <Box sx={{ width: "40%", }}>
          {orderData
            .sort((a, b) => b.orderTime.seconds - a.orderTime.seconds)
            .map((order, index) => (
              <Paper
                key={index}
                sx={{
                  ...taskGridItemStyles,
                  px: 2,
                }}
                onClick={() => handleCardClick(index)}
              >
                <Box
                  sx={{
                    ...iconContainerStyle,
                    justifyContent: "space-between",
                    px: 2,
                    mb: 0,
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
                  sx={{ backgroundColor: "#00000090", width: "100%", my: 2 }}
                />
              </Paper>
            ))}
        </Box>
        <Box>
          {orderData
            .sort((a, b) => b.orderTime.seconds - a.orderTime.seconds)
            .map((order, index) => (
              <Paper
                key={index}
                elevation={6}
                sx={{
                  ...subGridItemStyles,
                  backgroundColor: "#fffeee",
                  color: "#000",
                }}
                onClick={() => handleCardClick(index)}
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
                      <DiningIcon
                        sx={{ m: 0, color: "#626fa0", fontSize: 25 }}
                      />
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
                <Divider
                  sx={{ backgroundColor: "#00000090", width: "100%", my: 1 }}
                />
                <Typography
                  // variant="h6"
                  sx={{ ...textalignCenter, fontWeight: 600 }}
                >
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
                <Divider
                  sx={{ backgroundColor: "#00000090", width: "100%", my: 1 }}
                />
                {/* <Typography variant="h6">Tables Selected:</Typography> */}
                {/* {order.tablesSelected.map((table, tableIdx) => (
              <Box key={tableIdx} sx={{ marginBottom: 1 }}>
                <Typography variant="h6">Table {table.table}</Typography>
                <List>
                  {table.chairs.map((chair, chairIdx) => (
                    <ListItem key={chairIdx}>
                      <ListItemText
                        primary={`Chair ${chair.id}`}
                        secondary={`Booked: ${chair.booked ? "Yes" : "No"}`}
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            ))} */}
              </Paper>
            ))}
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
