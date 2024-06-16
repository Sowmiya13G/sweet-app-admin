import { Group, RestaurantMenu, ShoppingCart } from "@mui/icons-material";
import EventSeatIcon from "@mui/icons-material/EventSeat";
import { Box, Divider, Grid, Paper, Typography } from "@mui/material";
import { collection, doc, onSnapshot } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Area,
  AreaChart,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { db } from "../../firebaseConfig";

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
      monthlyData.push({ name: `W - ${i + 1}`, TotalSale: 0 });
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
        monthlyData[weekNumber - 1].TotalSale += parseInt(order.totalPrice); // Ensure totalPrice is converted to number
      }
    });

    return monthlyData;
  };

  const generateMonthlyData = (orders) => {
    // Initialize data structure for all months
    const yearlyData = [];

    // Loop through each month of the year (January to December)
    for (let month = 0; month < 12; month++) {
      // Initialize monthly total sell
      let TotalSale = 0;

      // Calculate start and end of current month
      const startDate = new Date(new Date().getFullYear(), month, 1);
      const endDate = new Date(new Date().getFullYear(), month + 1, 0);

      // Process each order for the current month
      orders.forEach((order) => {
        const orderDate = new Date(order.orderTime.seconds * 1000); // Convert seconds to milliseconds

        // Check if orderDate is within the current month
        if (orderDate >= startDate && orderDate <= endDate) {
          // Accumulate totalPrice to total for the current month
          TotalSale += parseInt(order.totalPrice); // Ensure totalPrice is converted to number
        }
      });

      // Push monthly total sell to yearlyData
      yearlyData.push({
        month: startDate.toLocaleString("default", { month: "short" }), // Get full month name (e.g., January, February, etc.)
        TotalSale: TotalSale,
      });
    }

    return yearlyData;
  };

  // Function to calculate total available and total chairs

  const calculateTotalChairs = (data) => {
    let totalAvailableChairs = 0;
    let totalBookedChairs = 0;

    // Iterate over each table object
    data.forEach((table) => {
      // Iterate over chairs array of each table
      table.chairs.forEach((chair) => {
        // Increment total chairs count
        if (chair.booked) {
          totalBookedChairs++;
        } else {
          totalAvailableChairs++;
        }
      });
    });

    return { totalAvailableChairs, totalBookedChairs };
  };

  const [ordersCount, setOrdersCount] = useState(0);
  const [tablesAvailable, setTablesAvailable] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [dishVariety, setDishVariety] = useState(0);
  const [selectedCard, setSelectedCard] = useState(5);
  const [orderData, setOrderData] = useState([]);
  const [tablesData, setTables] = useState([]);
  const [foodList, setFoodList] = useState([]);
  const navigate = useNavigate();
  const yearlyChartData = generateMonthlyData(orderData);
  const weeklyChartData = generateCurrentMonthData(orderData);
  // Calculate total available chairs
  const totalAvailableChairs = calculateTotalChairs(tablesData);
  console.log("Total available chairs:", totalAvailableChairs);
  console.log(tablesData);
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
      setTablesAvailable(totalAvailableChairs?.totalAvailableChairs);
      setTotalUsers(totalUsersCount);
      setDishVariety(totalDishesVariety);
    };
    fetchDashboardData();
  }, [totalAvailableChairs]);

  const COLORS = ["#FE5B5B", "#00B074"];

  const data = [
    { name: "Booked Tables", value: totalAvailableChairs.totalBookedChairs },
    {
      name: "Available Tables",
      value: totalAvailableChairs.totalAvailableChairs,
    },
  ];
  useEffect(() => {
    const fetchTablesBookedFromFirestore = async () => {
      try {
        const docRef = doc(db, "bookingData", "tablesBooked");
        // Listen to real-time updates
        const unsubscribe = onSnapshot(docRef, (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data().tablesBooked;
            setTables(data);
          } else {
            console.log("No such document!");
          }
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
      } catch (error) {
        console.error("Error fetching data from Firestore: ", error);
      }
    };

    fetchTablesBookedFromFirestore();
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
    if (index === 0) {
      navigate("/orders");
    } else if (index === 1) {
      navigate("/tables");
    } else if (index === 2) {
      navigate("/users");
    } else if (index === 3) {
      navigate("/categories");
    }
    // setSelectedCard(index);
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
        mt:2,
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
                <Typography variant="h6">Available Chair</Typography>
                <EventSeatIcon sx={{ ...iconStyle, color: "#00ccff" }} />
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
      <Box
        sx={{
          width: "100%",
          display: { xs: "block", md: "flex" },
          mt: 4,
          backgroundColor: "#eff1e410",
          borderRadius: 3,
        }}
      >
        <Paper
          elevation={0}
          sx={{
            width: { xs: "100%", md: "50%" },
            padding: 2,
            background: "none",
          }}
        >
          <Typography
            sx={{
              color: "#eee",
              fontSize: 20,
              fontWeight: 600,
              textAlign: "center",
            }}
          >
            weekly sales
          </Typography>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={weeklyChartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="TotalSale" stroke="#9960a6" />
            </LineChart>
          </ResponsiveContainer>
        </Paper>

        <Paper
          elevation={0}
          sx={{
            width: { xs: "100%", md: "50%" },

            padding: 2,
            background: "none",
          }}
        >
          <Typography
            sx={{
              color: "#eee",
              fontSize: 20,
              fontWeight: 600,
              textAlign: "center",
            }}
          >
            Top Selling Dish
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                dataKey="totalSales"
                data={top5SellingDishes}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#9960a6"
                label
              />
              <Tooltip
                formatter={(value, name, props) => [
                  props.payload.dishName,
                  value,
                ]}
              />
              {/* <Legend
                formatter={(value, entry) => `${entry.payload.dishName}`}
                iconType="square"
              /> */}
            </PieChart>
          </ResponsiveContainer>
        </Paper>
        <Paper
          elevation={0}
          sx={{
            width: { xs: "100%", md: "50%" },

            padding: 2,
            background: "none",
            // backgroundImage: "linear-gradient(to bottom right, #00000011, #000000)",
          }}
        >
          <Typography
            sx={{
              color: "#eee",
              fontSize: 20,
              fontWeight: 600,
              textAlign: "center",
            }}
          >
            Avaliable chair
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                label
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Paper>
      </Box>
      <Paper
        elevation={0}
        sx={{
          width: { xs: "100%", md: "50%" },
          padding: 2,
          backgroundColor: "#eff1e410",
          borderRadius: 3,
        }}
      >
        <Typography
          sx={{
            color: "#eee",
            fontSize: 20,
            fontWeight: 600,
            textAlign: "center",
          }}
        >
          Yearly sale
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={yearlyChartData}>
            <defs>
              <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#9960a6" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#9960a6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />

            <Area
              type="monotone"
              dataKey="TotalSale"
              stroke="#8884d8"
              fillOpacity={1}
              fill="url(#colorTotal)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </Paper>
    </Box>
  );
};

export default Dashboard;
