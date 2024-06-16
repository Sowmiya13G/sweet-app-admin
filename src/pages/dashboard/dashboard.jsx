import React, { useState, useEffect } from "react";
import { Box, Typography, Paper, Grid, Divider } from "@mui/material";
import {
  ShoppingCart,
  TableRestaurant,
  Group,
  RestaurantMenu,
} from "@mui/icons-material";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  AreaChart,
  Area,
} from "recharts";

const piewData = [
  { name: "Group A", value: 400 },
  { name: "Group B", value: 300 },
  { name: "Group C", value: 300 },
  { name: "Group D", value: 200 },
];
const Dashboard = () => {
  const generateCurrentMonthData = (orders) => {
    // Initialize monthly data with dynamically calculated weeks
    const monthlyData = [];

    // Get the current date
    const currentDate = new Date();

    // Calculate start and end of current month
    const startOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    );
    const endOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    );

    // Calculate the number of weeks in the month
    const numWeeks = Math.ceil(
      (endOfMonth.getDate() + startOfMonth.getDay()) / 7
    );

    // Initialize weekly data structure
    for (let i = 0; i < numWeeks; i++) {
      monthlyData.push({ name: `week${i + 1}`, totalSell: 0 });
    }

    // Process each order
    orders.forEach((order) => {
      const orderDate = new Date(order.orderTime.seconds * 1000); // Convert seconds to milliseconds

      // Check if orderDate is within the current month
      if (orderDate >= startOfMonth && orderDate <= endOfMonth) {
        // Determine the week number within the current month
        const weekNumber = Math.ceil(
          (orderDate.getDate() + startOfMonth.getDay()) / 7
        );

        // Accumulate totalPrice to total for the corresponding week
        monthlyData[weekNumber - 1].totalSell += order.totalPrice;
      }
    });

    return monthlyData;
  };

  const [ordersCount, setOrdersCount] = useState(0);
  const [tablesAvailable, setTablesAvailable] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [dishVariety, setDishVariety] = useState(0);
  const [selectedCard, setSelectedCard] = useState(0);
  const [orderData, setOrderData] = useState([]);
  const [orderIDCard, setOrderIDCard] = useState("");
  const [foodList, setFoodList] = useState([]);
  const navigate = useNavigate();
  const weeklyChartData = generateCurrentMonthData(orderData);

  const salesMap = {};

  orderData.forEach((order) => {
    order.cartItems.forEach((item) => {
      const { dishName, quantity } = item;
      if (salesMap[dishName]) {
        salesMap[dishName] += quantity;
      } else {
        salesMap[dishName] = quantity;
      }
    });
  });

  // Step 2: Convert salesMap to an array of objects
  const topSellingDishes = Object.keys(salesMap).map((dishName) => ({
    dishName,
    totalSales: salesMap[dishName],
  }));

  // Step 3: Sort the array by totalSales in descending order and get top 5
  topSellingDishes.sort((a, b) => b.totalSales - a.totalSales);
  const top5SellingDishes = topSellingDishes.slice(0, 5);

  useEffect(() => {
    const fetchDashboardData = () => {
      setTablesAvailable(15);
      setTotalUsers(totalUsersCount);
      setDishVariety(totalDishesVariety);
    };
    fetchDashboardData();
  }, []);

  useEffect(() => {
    const fetchOrderData = () => {
      try {
        const ordersCollection = collection(db, "orders");
        const unsubscribe = onSnapshot(ordersCollection, (orderSnapshot) => {
          const ordersList = orderSnapshot.docs.map((doc) => doc.data());
          console.log(ordersList);
          setOrdersCount(ordersList.length);
          setOrderData(ordersList);
        });

        return () => unsubscribe();
      } catch (error) {
        console.error("Error fetching order data: ", error);
      }
    };

    fetchOrderData();
  }, []);

  useEffect(() => {
    const fetchFoodList = () => {
      try {
        const foodCollection = collection(db, "foodList");
        const unsubscribe = onSnapshot(foodCollection, (foodSnapshot) => {
          const foodList = foodSnapshot.docs.map((doc) => doc.data());
          setFoodList(foodList);
        });

        return () => unsubscribe();
      } catch (error) {
        console.error("Error fetching food list: ", error);
      }
    };

    fetchFoodList();
  }, []);

  const filteredOrders = orderData.filter((order, index, self) => {
    return index === self.findIndex((o) => o.phoneNumber === order.phoneNumber);
  });

  const totalUsersCount = filteredOrders.length;
  const totalDishesVariety = foodList.length;

  const handleCardClick = (index) => {
    if (index === 2) {
      navigate("/users");
    }
    setSelectedCard(index);
  };

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
        <Grid container spacing={2} sx={{ flexWrap: "nowrap" }}>
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
                <Group sx={{ ...iconStyle, color: "#00f5be" }} />
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
      <Box sx={{ width: "100%", display: { xs: "block", md: "flex" }, mt: 4 }}>
        {/* <ResponsiveContainer width="50%" height={300}>
          <BarChart data={weeklyChartData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="total" fill="#8884d8" />
          </BarChart>
          
        </ResponsiveContainer> */}
        {/* <ResponsiveContainer width="50%" height={300}>
          <AreaChart data={weeklyChartData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area dataKey="total" fill="#8884d8" />
          </AreaChart>
        </ResponsiveContainer> */}
        <ResponsiveContainer width="50%" height={300}>
          <AreaChart data={weeklyChartData}>
            <defs>
              <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area
              type="monotone"
              dataKey="totalSell"
              stroke="#8884d8"
              fillOpacity={1}
              fill="url(#colorTotal)"
            />
          </AreaChart>
        </ResponsiveContainer>
        <ResponsiveContainer width="50%" height={300}>
          <PieChart>
            <Pie
              dataKey="value"
              data={piewData}
              cx="50%"
              cy="50%"
              fill="#8884d8"
              outerRadius={80}
              label
            />
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
};

export default Dashboard;
