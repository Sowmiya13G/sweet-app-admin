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
  Typography,
} from "@mui/material";

// firebase
import { collection, onSnapshot } from "firebase/firestore";

// firebase service
import { db } from "../../firebaseConfig";

// component
import TabBar from "../../components/tabBar/tabBar";

// assets
import foodOnPlate1 from "../../assets/images/plateOnfood1.png";
import emptyPlate from "../../assets/images/emptyPlate.png";

// styles
import "./style.css";

const Orders = () => {
  const [ordersCount, setOrdersCount] = useState(0);
  const [orderData, setOrderData] = useState([]);
  const [selectedTab, setSelectedTab] = useState("All");
  const [orderIDCard, setOrderIDCard] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [tables, setTables] = useState([
    {
      table: 1,
      chairs: [
        {
          id: 1,
          booked: false,
        },
        {
          id: 2,
          booked: false,
        },
        {
          id: 3,
          booked: false,
        },
        {
          id: 4,
          booked: false,
        },
      ],
    },
    {
      table: 2,
      chairs: [
        {
          id: 1,
          booked: false,
        },
        {
          id: 2,
          booked: false,
        },
        {
          id: 3,
          booked: false,
        },
        {
          id: 4,
          booked: false,
        },
      ],
    },
    {
      table: 3,
      chairs: [
        {
          id: 1,
          booked: false,
        },
        {
          id: 2,
          booked: false,
        },
        {
          id: 3,
          booked: false,
        },
        {
          id: 4,
          booked: false,
        },
      ],
    },
    {
      table: 4,
      chairs: [
        {
          id: 1,
          booked: false,
        },
        {
          id: 2,
          booked: false,
        },
        {
          id: 3,
          booked: false,
        },
        {
          id: 4,
          booked: false,
        },
      ],
    },
    {
      table: 5,
      chairs: [
        {
          id: 1,
          booked: false,
        },
        {
          id: 2,
          booked: false,
        },
        {
          id: 3,
          booked: false,
        },
        {
          id: 4,
          booked: false,
        },
      ],
    },
  ]);
  const [tablesBooked, setTablesBooked] = useState([
    {
      table: 1,
      chairs: [
        {
          id: 1,
          booked: true,
        },
        {
          id: 2,
          booked: false,
        },
        {
          id: 3,
          booked: false,
        },
        {
          id: 4,
          booked: true,
        },
      ],
    },
    {
      table: 2,
      chairs: [
        {
          id: 1,
          booked: true,
        },
        {
          id: 2,
          booked: true,
        },
        {
          id: 3,
          booked: false,
        },
        {
          id: 4,
          booked: false,
        },
      ],
    },
    {
      table: 3,
      chairs: [
        {
          id: 1,
          booked: false,
        },
        {
          id: 2,
          booked: false,
        },
        {
          id: 3,
          booked: false,
        },
        {
          id: 4,
          booked: false,
        },
      ],
    },
    {
      table: 4,
      chairs: [
        {
          id: 1,
          booked: false,
        },
        {
          id: 2,
          booked: false,
        },
        {
          id: 3,
          booked: false,
        },
        {
          id: 4,
          booked: false,
        },
      ],
    },
    {
      table: 5,
      chairs: [
        {
          id: 1,
          booked: false,
        },
        {
          id: 2,
          booked: false,
        },
        {
          id: 3,
          booked: false,
        },
        {
          id: 4,
          booked: false,
        },
      ],
    },
  ]);
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

  const filteredOrders = orderData.filter((order) => {
    return order.orderID.toLowerCase().includes(searchQuery.toLowerCase());
  });
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

  const handleChairClick = (tableId, chairIndex) => {
    if (!tablesBooked[tableId - 1].chairs[chairIndex].booked) {
      setTables((prevTables) => {
        const updatedTables = [...prevTables];
        const tableIndex = updatedTables.findIndex((x) => x.table === tableId);
        const chair = updatedTables[tableIndex].chairs[chairIndex];
        chair.booked = !chair.booked;
        return updatedTables;
      });
      setTimeout(() => {
        // handleChairError();
      }, 100);
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
          <Box
            sx={{
              width: "100%",
              height: { xs: 220, md: 420 },
              backgroundColor: "#fff",
              ...scrollHorbarStyles,
              borderRadius: 2,
            }}
          >
            {filteredOrders.map((order, index) => (
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
            ))}
          </Box>
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
                  {order?.tablesSelected.map((table, index) => (
                    <div
                      key={index}
                      className="table-container mx-1 my-3 mb-4 d-flex flex-column"
                    >
                      <div className="table-chair-container w-100 px-4">
                        {table.chairs.slice(0, 2).map((chair, chairIndex) => (
                          <div
                            key={chairIndex}
                            className={
                              tablesBooked[index].chairs[chairIndex].booked
                                ? "chairBooked-already"
                                : chair.booked
                                ? "table-chair-booked"
                                : "table-chair"
                            }
                            onClick={() =>
                              handleChairClick(table.table, chairIndex)
                            }
                          ></div>
                        ))}
                      </div>
                      <div className="dine-table flex-column  justify-content-evenly">
                        <div className="d-flex justify-content-evenly w-100 flex-wrap">
                          {table.chairs.slice(0, 4).map((chair, chairIndex) => (
                            <div
                              key={index}
                              className="mx-1 my-1"
                              onClick={() =>
                                handleChairClick(table.table, chairIndex)
                              }
                            >
                              <img
                                src={
                                  tablesBooked[index].chairs[chairIndex].booked
                                    ? foodOnPlate1
                                    : chair.booked
                                    ? foodOnPlate1
                                    : emptyPlate
                                }
                                alt="img"
                                className={`table-plate  ${
                                  tablesBooked[index].chairs[chairIndex].booked
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
                              tablesBooked[index].chairs[chairIndex + 2].booked
                                ? "chairBooked-bottom-already"
                                : chair.booked
                                ? "table-chair-bottom-booked"
                                : "table-chair-bottom"
                            }
                            onClick={() =>
                              handleChairClick(table.table, chairIndex + 2)
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
