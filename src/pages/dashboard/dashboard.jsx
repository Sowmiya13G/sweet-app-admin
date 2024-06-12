import React, { useState, useEffect } from "react";

// mui components
import { Box, Typography, Paper, Grid, Divider } from "@mui/material";
import {
  ShoppingCart,
  TableRestaurant,
  Group,
  RestaurantMenu,
} from "@mui/icons-material";

// firebase
import { collection, onSnapshot } from "firebase/firestore";

// firebase service
import { db } from "../../firebaseConfig";

// packages
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  // local states
  const [ordersCount, setOrdersCount] = useState(0);
  const [tablesAvailable, setTablesAvailable] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [dishVariety, setDishVariety] = useState(0);
  const [selectedCard, setSelectedCard] = useState(0);
  const [orderData, setOrderData] = useState([]);
  const [orderIDCard, setOrderIDCard] = useState("");
  const [foodList, setFoodList] = useState([]);

  // variables
  const navigate = useNavigate();

  const filteredOrders = orderData.filter((order, index, self) => {
    return index === self.findIndex((o) => o.phoneNumber === order.phoneNumber);
  });

  const totalUsersCount = filteredOrders.length;
  const totalDishesVariety = foodList.length;

  // -------------------------------- USE EFFECTS --------------------------------

  useEffect(() => {
    const fetchDashboardData = () => {
      setTablesAvailable(15);
      setTotalUsers(totalUsersCount);
      setDishVariety(totalDishesVariety);
    };

    fetchDashboardData();
  }, []);

  // fetching orders 
  useEffect(() => {
    const fetchOrderData = () => {
      try {
        const ordersCollection = collection(db, "orders");
        const unsubscribe = onSnapshot(ordersCollection, (orderSnapshot) => {
          const ordersList = orderSnapshot.docs
            .sort(
              (a, b) => b.data().orderTime.seconds - a.data().orderTime.seconds
            ) // Ensure correct property access
            .map((doc) => doc.data());

          setOrderData(ordersList);
          setOrderIDCard(ordersList[0].orderID);

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

  // fetching dishes
  useEffect(() => {
    const fetchOrderData = () => {
      try {
        const ordersCollection = collection(db, "foodList");
        const unsubscribe = onSnapshot(ordersCollection, (orderSnapshot) => {
          const ordersList = orderSnapshot.docs.map((doc) => doc.data());
          setFoodList(ordersList);
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
      } catch (error) {
        console.error("Error fetching order data: ", error);
      }
    };

    fetchOrderData();
  }, []);

  // -------------------------------- COMPONENT STYLES --------------------------------

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

  // -------------------------------- FUNCTIONALITIES --------------------------------

  const handleCardClick = (index) => {
    if (index == 2) {
      navigate("/users");
    }
    setSelectedCard(index);
  };

  // -------------------------------- RENDER UI --------------------------------

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        p: { xs: 0, md: 2 },
      }}
    >
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
    </Box>
  );
};

export default Dashboard;
