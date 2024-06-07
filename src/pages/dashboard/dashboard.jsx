// src/components/Dashboard.js
import { Box, Typography, Paper, Grid, Divider } from "@mui/material";
import {
  ShoppingCart,
  TableRestaurant,
  Group,
  RestaurantMenu,
} from "@mui/icons-material";
import React, { useState, useEffect } from "react";

const Dashboard = () => {
  // Mock state for orders count, tables available, total users, and dish variety
  const [ordersCount, setOrdersCount] = useState(0);
  const [tablesAvailable, setTablesAvailable] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [dishVariety, setDishVariety] = useState(0);

  useEffect(() => {
    // Mock data fetching
    const fetchDashboardData = () => {
      setOrdersCount(123); // Replace with real data fetching
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
    backgroundColor: "#fffeee",
    borderRadius: 2,
    color: "#000",
    minWidth: 250,
    transition: "background-color 0.2s ease-in-out, color 0.2s ease-in-out",
    ":hover": {
      backgroundColor: "#3c3c4e",
      color: "#fff",
    },
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

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, p: 2 }}>
      <Typography variant="h5" gutterBottom sx={{ color: "#fff" }}>
        Welcome to the Admin Dashboard
      </Typography>
      <Box sx={{ ...scrollbarStyles }}>
        {" "}
        <Grid container spacing={2} sx={{ flexWrap: "nowrap" }}>
          {" "}
          <Grid item>
            <Paper elevation={6} sx={{ padding: 2, ...gridItemStyles }}>
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
            <Paper elevation={6} sx={{ padding: 2, ...gridItemStyles }}>
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
            <Paper elevation={6} sx={{ padding: 2, ...gridItemStyles }}>
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
            <Paper elevation={6} sx={{ padding: 2, ...gridItemStyles }}>
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
