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
  Button,
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  OutlinedInput,
  Paper,
  Typography,
} from "@mui/material";

// firebase
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";

// firebase service
import { db } from "../../firebaseConfig";

// component
import TabBar from "../../components/tabBar/tabBar";

// assets
import foodOnPlate1 from "../../assets/images/plateOnfood1.png";
import sadEmoji from "../../assets/images/sadEmoji.png";

import emptyPlate from "../../assets/images/emptyPlate.png";

// styles
import "./style.css";

const Orders = () => {
  const [ordersCount, setOrdersCount] = useState(0);
  const [orderData, setOrderData] = useState([]);
  const [selectedTab, setSelectedTab] = useState("Current");
  const [orderIDCard, setOrderIDCard] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [tablesBooked, setTablesBooked] = useState([]);
  const [currentTabIndex, setCurrentTabIndex] = useState(1);
  const [loader, setLoader] = useState(true);
  const tabs = [
    // { tbName: "All", id: 1 },
    { tbName: "Current", id: 2 },
    { tbName: "Delivered", id: 3 },
    { tbName: "Cancelled", id: 4 },
  ];

  // -------------------------------- USE EFFECTS --------------------------------

  useEffect(() => {
    // Mock data fetching
    const fetchDashboardData = () => {};

    fetchDashboardData();
  }, []);

  useEffect(() => {
    const fetchOrderData = () => {
      try {
        setLoader(true);
        const ordersCollection = collection(db, "orders");
        const unsubscribe = onSnapshot(ordersCollection, (orderSnapshot) => {
          const ordersList = orderSnapshot.docs
            .sort(
              (a, b) => b.data().orderTime.seconds - a.data().orderTime.seconds
            ) // Ensure correct property access
            .map((doc) => doc.data());
          if (ordersList.length) {
            setOrderData(ordersList);
            setOrderIDCard(ordersList[0].orderID);
          }
        });
        setTimeout(() => {
          setLoader(false);
        }, 1000);

        // Cleanup subscription on unmount
        return () => unsubscribe();
      } catch (error) {
        console.error("Error fetching order data: ", error);
      }
    };

    fetchOrderData();
  }, []);

  useEffect(() => {
    const sendTablesBookedToFirestore = async () => {
      try {
        const docRef = doc(db, "bookingData", "tablesBooked");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setTablesBooked(docSnap.data().tablesBooked);
        }
        console.log("Data sent to Firestore successfully.");
      } catch (error) {
        console.error("Error sending data to Firestore: ", error);
      }
    };

    sendTablesBookedToFirestore();
  }, []);

  useEffect(() => {
    if (selectedTab === "Current") {
      setCurrentTabIndex(1);
    } else if (selectedTab === "Delivered") {
      setCurrentTabIndex(2);
    } else if (selectedTab === "Cancelled") {
      setCurrentTabIndex(3);
    }
  }, [selectedTab]);

  // -------------------------------- COMPONENT STYLES --------------------------------

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

  const subGridItemStyles = {
    display: "flex",
    flexDirection: "column",
    alignItems: "start",
    cursor: "pointer",
    width: "100%",
    padding: 2,
    border: "none",
    color: "#000",
    transition: "color 0.2s ease-in-out, width 0.2s ease-in-out",
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
    width: { xs: "100%", md: "60%" },
    marginBottom: 2,
  };

  const buttonStyles = {
    height: 40,
    marginBottom: "10px",
    width: "40%",
    color: "#fff",
    alignItems: "center",
    justifyContent: "space-around",
    fontWeight: "bold",
    fontSize: { xs: 12, md: 12 },
    textTransform: "capitalize",
    mt: 2,
  };

  // -------------------------------- FUNCTIONALITIES --------------------------------

  const handleOrderCardClick = (index) => {
    setOrderIDCard(index);
  };

  const filteredOrders = orderData.filter((order) => {
    return order.orderID.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handleCancelFoodItem = async (order) => {
    try {
      let orderDetails = { ...order };
      // let orderStatus = 3;
      const orderDocRef = doc(db, "orders", order?.orderID);
      await updateDoc(orderDocRef, {
        ...orderDetails,
        orderStatus: 3,
      });
      console.log("Order cancelled successfully");
    } catch (error) {
      console.error("Error cancelling order:", error);
      console.log(JSON.stringify(error));
    }
  };

  const handlePayFoodItem = async (order) => {
    try {
      let orderDetails = { ...order };
      let orderStatus = 2;
      const orderDocRef = doc(db, "orders", order?.orderID);
      await updateDoc(orderDocRef, {
        ...orderDetails,
        orderStatus,
      });
      console.log("Paid successfully");
    } catch (error) {
      console.error("Error while payment:", error);
      console.log(JSON.stringify(error));
    }
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
            borderRadius: 2,
          }}
        >
          <Box sx={{ px: 2, mb: 1 }}>
            <OutlinedInput
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{ borderRadius: "10px" }}
              fullWidth
              placeholder="Search Order ID"
            />
          </Box>
          <Box sx={{ p: "15px" }}>
            <TabBar
              tabs={tabs}
              selectedTab={selectedTab}
              setSelectedTab={setSelectedTab}
              fontSize={16}
            />
          </Box>
          {!loader ? (
            <Box
              sx={{
                width: "100%",
                height: { xs: 220, md: 420 },
                backgroundColor: "#fff",
                ...scrollHorbarStyles,
                borderRadius: 2,
                borderBottom: "none",
              }}
            >
              {filteredOrders.filter((x) => x.orderStatus === currentTabIndex)
                .length === 0 ? (
                <Box
                  sx={{
                    height: 300,
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center ",
                    flexDirection: "column",
                  }}
                >
                  <img
                    src={sadEmoji}
                    style={{
                      width: 200,
                      height: 200,
                    }}
                    alt="img"
                  />
                  <Typography sx={{ fontWeight: 600, fontSize: 20, mt: 3 }}>
                    No Order Found
                  </Typography>
                </Box>
              ) : (
                filteredOrders
                  .filter((x) => x.orderStatus === currentTabIndex)
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
                            "background-color 0.2s ease-in-out, color 0.2s ease-in-out , border-left 0.2s ease-in-out",
                          ":hover": {
                            background: "#00000021",
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
                  ))
              )}
            </Box>
          ) : (
            <Box
              sx={{
                width: "100%",
                height: { xs: 220, md: 420 },
                backgroundColor: "#fff",
                ...scrollHorbarStyles,
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <CircularProgress />
            </Box>
          )}
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
          {orderData
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
                    # Order ID: {order.orderID}
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
                    flexDirection: "row",
                    width: "100%",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      width: "70%",
                      flexWrap: "wrap",
                      fontSize: 10,
                      flexDirection: "column",
                    }}
                  >
                    <Typography sx={textalignCenter}>
                      <PersonIcon
                        sx={{ m: 0, color: "#626fa0", fontSize: 25, mr: 2 }}
                      />
                      Name:
                      <Typography sx={{ fontWeight: 600, ml: 1 }}>
                        {order.name}
                      </Typography>
                    </Typography>
                    <Typography sx={textalignCenter}>
                      <LocalPhoneIcon
                        sx={{ m: 0, color: "#626fa0", fontSize: 25, mr: 2 }}
                      />
                      Phone Number:
                      <Typography sx={{ fontWeight: 600, ml: 1 }}>
                        {order.phoneNumber}
                      </Typography>
                    </Typography>
                    <Typography sx={textalignCenter}>
                      {order.deliveryMethod == "Dine-In" ? (
                        <DiningIcon
                          sx={{ m: 0, color: "#626fa0", fontSize: 25, mr: 2 }}
                        />
                      ) : (
                        <TakeoutDiningIcon
                          sx={{ m: 0, color: "#626fa0", fontSize: 25, mr: 2 }}
                        />
                      )}
                      Delivery Method:
                      <Typography sx={{ fontWeight: 600, ml: 1 }}>
                        {`${order.deliveryMethod}`}
                      </Typography>
                    </Typography>

                    <Typography sx={textalignCenter}>
                      {order.paymentMethod == "online" ? (
                        <AccountBalanceRoundedIcon
                          sx={{ m: 0, color: "#626fa0", fontSize: 25, mr: 2 }}
                        />
                      ) : (
                        <LocalAtmIcon
                          sx={{ m: 0, color: "#626fa0", fontSize: 25, mr: 2 }}
                        />
                      )}
                      Payment Method:
                      <Typography sx={{ fontWeight: 600, ml: 1 }}>
                        {order.paymentMethod}
                      </Typography>
                    </Typography>
                    <Typography sx={textalignCenter}>
                      Order Status:
                      <Typography
                        sx={{
                          fontWeight: 600,
                          ml: 1,
                          color:
                            order.orderStatus == 3
                              ? "red"
                              : order.orderStatus == 2
                              ? "green"
                              : "#22222E",
                        }}
                      >
                        {order.orderStatus == 3
                          ? "Cancelled"
                          : order.orderStatus == 2
                          ? "Delivered"
                          : "Current"}
                      </Typography>
                    </Typography>
                    {/* <Typography sx={{ ...textalignCenter, fontWeight: 600 }}>
                      Total Price:
                      <Typography sx={{ fontWeight: 600, ml: 1 }}>
                        ₹{order.totalPrice}
                      </Typography>
                    </Typography> */}
                  </Box>
                  <Box
                    sx={{ display: { md: "flex", xs: "none" }, width: "30%" }}
                  >
                    {order.orderStatus == 1 && (
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "row",
                          width: "100%",
                          justifyContent: "space-around",
                          alignItems: "center",
                        }}
                      >
                        <Button
                          onClick={() => handleCancelFoodItem(order)}
                          sx={{
                            ...buttonStyles,
                            borderColor: "red",
                            background: "red",
                            "&:hover": {
                              borderColor: "red",
                              background: "red",
                            },
                          }}
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={() => handlePayFoodItem(order)}
                          sx={{
                            ...buttonStyles,
                            borderColor: "#125238",
                            background: "#125238",
                            "&:hover": {
                              borderColor: "#125238",
                              background: "#125238",
                            },
                          }}
                        >
                          Pay
                        </Button>
                      </Box>
                    )}
                  </Box>
                </Box>
                <Typography sx={{ ...textalignCenter, fontWeight: 600 }}>
                  Total Price:
                  <Typography sx={{ fontWeight: 600, ml: 1 }}>
                    ₹{order.totalPrice}
                  </Typography>
                </Typography>
                <Box
                  sx={{ display: { md: "none", xs: "flex" }, width: "100%" }}
                >
                  {order.orderStatus == 1 && (
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        width: "100%",
                        justifyContent: "space-around",
                        alignItems: "center",
                      }}
                    >
                      <Button
                        onClick={() => handleCancelFoodItem(order)}
                        sx={{
                          ...buttonStyles,
                          borderColor: "red",
                          background: "red",
                          "&:hover": {
                            borderColor: "red",
                            background: "red",
                          },
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={() => handlePayFoodItem(order)}
                        sx={{
                          ...buttonStyles,
                          borderColor: "#125238",
                          background: "#125238",
                          "&:hover": {
                            borderColor: "#125238",
                            background: "#125238",
                          },
                        }}
                      >
                        Pay
                      </Button>
                    </Box>
                  )}
                </Box>

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
                <Typography
                  sx={{
                    fontSize: 16,
                    textTransform: "uppercase",
                    fontWeight: 600,
                  }}
                >
                  Table Booked:
                </Typography>
                <Box
                  sx={{ ...scrollbarStyles, display: "flex", width: "100%" }}
                >
                  {order.tablesSelected.length > 0 &&
                    order?.tablesSelected.map((table, index) => (
                      <div
                        key={index}
                        className="table-container mx-1 my-3 mb-4 d-flex flex-column"
                      >
                        <div className="table-chair-container w-100 px-4">
                          {table?.chairs
                            .slice(0, 2)
                            .map((chair, chairIndex) => (
                              <div
                                key={chairIndex}
                                className={
                                  order?.tablesSelected[index]?.chairs[
                                    chairIndex
                                  ].booked
                                    ? "chairBooked-already"
                                    : chair.booked
                                    ? "table-chair-booked"
                                    : "table-chair"
                                }
                              ></div>
                            ))}
                        </div>
                        <div className="dine-table flex-column  justify-content-evenly">
                          <div className="d-flex justify-content-evenly w-100 flex-wrap">
                            {table?.chairs
                              .slice(0, 4)
                              .map((chair, chairIndex) => (
                                <div key={index} className="mx-1 my-1">
                                  <img
                                    src={
                                      order?.tablesSelected[index]?.chairs[
                                        chairIndex
                                      ].booked
                                        ? foodOnPlate1
                                        : chair.booked
                                        ? foodOnPlate1
                                        : emptyPlate
                                    }
                                    alt="img"
                                    className={`table-plate  ${
                                      order?.tablesSelected[index]?.chairs[
                                        chairIndex
                                      ].booked
                                        ? "table-GrayScale"
                                        : "none"
                                    }`}
                                  />
                                </div>
                              ))}
                          </div>
                          <p className="table-number">{table.table}</p>
                        </div>
                        <div className="table-chair-container w-100 px-4">
                          {table.chairs.slice(2, 4).map((chair, chairIndex) => (
                            <div
                              key={chairIndex}
                              className={
                                order?.tablesSelected[index]?.chairs[
                                  chairIndex + 2
                                ].booked
                                  ? "chairBooked-bottom-already"
                                  : chair.booked
                                  ? "table-chair-bottom-booked"
                                  : "table-chair-bottom"
                              }
                            ></div>
                          ))}
                        </div>
                      </div>
                    ))}
                </Box>
              </Paper>
            ))}
        </Box>
      </Box>
    </Box>
  );
};

export default Orders;
