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
  Paper,
  Typography,
} from "@mui/material";

// firebase
import { collection, onSnapshot } from "firebase/firestore";

// firebase service
import { db } from "../../firebaseConfig";

// component
import TabBar from "../../components/tabBar/tabBar";

const Orders = () => {
  const [ordersCount, setOrdersCount] = useState(0);
  const [orderData, setOrderData] = useState([]);
  const [selectedTab, setSelectedTab] = useState("All");
  const [orderIDCard, setOrderIDCard] = useState("");
  const tabs = [
    { tbName: "All", id: 1 },
    { tbName: "Current", id: 2 },
    { tbName: "Delivered", id: 3 },
    { tbName: "Canceled", id: 4 },
  ];

  const filteredFoodListByTab =
    selectedTab === "All"
      ? orderData
      : orderData.filter(
          (food) =>
            food.categorized ===
            (selectedTab === "Current"
              ? "current"
              : selectedTab === "Delivered"
              ? "delivered"
              : "canceled")
        );

  // -------------------------------- USE EFFECTS --------------------------------

  useEffect(() => {
    // Mock data fetching
    const fetchDashboardData = () => {};

    fetchDashboardData();
  }, []);

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

  // -------------------------------- FUNCTIONALITIES --------------------------------

  const handleOrderCardClick = (index) => {
    setOrderIDCard(index);
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
      <Box
        sx={{
          display: { xs: "block", md: "flex" },
          width: "100%",
        }}
      >
        <Box
          sx={{
            width: { xs: "100%", md: "35%" },
            height: { xs: 400, md: 600 },
            mr: 1,
            my: 2,
            py: 2,
            backgroundColor: "#fff",
            ...scrollHorbarStyles,
            borderRadius: 2,
          }}
        >
          <Box sx={{ p: "15px" }}>
            <TabBar
              tabs={tabs}
              selectedTab={selectedTab}
              setSelectedTab={setSelectedTab}
              fontSize={16}
            />
          </Box>
          {orderData
            // .sort((a, b) => b.orderTime.seconds - a.orderTime.seconds)
            .map((order, index) => (
              <Paper
                key={index}
                sx={{
                  ...taskGridItemStyles,
                  px: 2,
                }}
                onClick={() => handleOrderCardClick(order.orderID)}
              >
                <Box
                  sx={{
                    ...iconContainerStyle,
                    justifyContent: "space-between",
                    borderLeft:
                      orderIDCard === order.orderID
                        ? "5px solid #22222E"
                        : "none",
                    // backgroundColor:
                    //   orderIDCard === order.orderID ? "#22222e" : "#00000011",
                    // color: orderIDCard === order.orderID ? "#fff" : "#000",
                    px: 2,
                    transition:
                      "background-color 0.2s ease-in-out, color 0.2s ease-in-out",
                    ":hover": {
                      background: "#00000011",
                    },
                  }}
                >
                  <Typography sx={{ fontWeight: "bold", fontSize: 16 }}>
                    # Order ID: {order.orderID}
                  </Typography>
                  {/* <ArrowCircleRightIcon
                    sx={{ ...iconStyle, color: "#626fa0", mb: 0 }}
                  /> */}
                </Box>
              </Paper>
            ))}
        </Box>
        <Box
          sx={{
            width: { xs: "100%", md: "65%" },
            my: 2,
            height: { xs: 400, md: 600 },
            mr: 1,
            backgroundColor: "#ffffff",
            ...scrollHorbarStyles,
            borderRadius: 2,
          }}
        >
          {filteredFoodListByTab
            .filter((x) => x.orderID === orderIDCard)
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
      </Box>
    </Box>
  );
};

export default Orders;
