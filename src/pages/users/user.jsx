import AccountBalanceRoundedIcon from "@mui/icons-material/AccountBalanceRounded";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";
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
import { collection, onSnapshot } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../../firebaseConfig";

const Users = () => {
  const [orderIDCard, setOrderIDCard] = useState("");
  const [orderData, setOrderData] = useState([]);
  const [ordersCount, setOrdersCount] = useState(0);

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
          setOrderIDCard(ordersList[0].phoneNumber);

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

  const findDupNumbers = () => {
    const uniqueNumber = new Set();
    return orderData.reduce((accumulator, current) => {
      if (!uniqueNumber.has(current.phoneNumber)) {
        uniqueNumber.add(current.phoneNumber);
        accumulator.push(uniqueNumber);
      }
      return accumulator;
    }, []);
  };

  console.log(orderData);

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

  const handleOrderCardClick = (phoneNumber, index) => {
    setOrderIDCard(phoneNumber);
  };
  const filteredOrderData = orderData.filter((order, index, self) => {
    return index === self.findIndex((o) => o.phoneNumber === order.phoneNumber);
  });

  return (
    <Box
      sx={{
        display: { xs: "block", md: "flex" },
        width: "100%",
      }}
    >
      <Box
        sx={{
          width: { xs: "100%", md: "40%" },
          height: 450,
          mr: 1,
          my: 2,

          py: 2,
          backgroundColor: "#fff",
          ...scrollHorbarStyles,
          borderRadius: 2,
        }}
      >
        {filteredOrderData.map((order, index) => (
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
                ...iconContainerStyle,
                justifyContent: "space-between",
                backgroundColor:
                  orderIDCard === order.phoneNumber ? "#22222e" : "#00000011",
                color: orderIDCard === order.phoneNumber ? "#fff" : "#000",
                px: 2,
                transition:
                  "background-color 0.2s ease-in-out, color 0.2s ease-in-out",
                ":hover": {
                  background:
                    orderIDCard === order.phoneNumber ? "#22222e" : "#00000020",
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
      <Box
        sx={{
          width: { xs: "100%", md: "60%" },
          my: 2,
          height: 450,
          mr: 1,
          backgroundColor: "#ffffff",
          ...scrollHorbarStyles,
          borderRadius: 2,
        }}
      >
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
    </Box>
  );
};

export default Users;

// import React, { useEffect, useState } from "react";

// // mui components
// import {
//   Box,
//   Divider,
//   List,
//   ListItem,
//   ListItemText,
//   ListItemAvatar,
//   Avatar,
//   Grid,
//   Paper,
//   Typography,
// } from "@mui/material";
// import AccountBalanceRoundedIcon from "@mui/icons-material/AccountBalanceRounded";
// import LocalAtmIcon from "@mui/icons-material/LocalAtm";
// import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
// import DiningIcon from "@mui/icons-material/Dining";
// import TakeoutDiningIcon from "@mui/icons-material/TakeoutDining";
// import PersonIcon from "@mui/icons-material/Person";
// // firebase
// import { collection, onSnapshot } from "firebase/firestore";

// // firebase service
// import { db } from "../../firebaseConfig";

// const Users = () => {
//   // local states
//   const [users, setUsers] = useState([]);
//   const [usersCount, setUsersCount] = useState(0);
//   const [selectedCard, setSelectedCard] = useState("");
//   const [userDetails, setUserDetails] = useState(null);

//   // -------------------------------- USE EFFECTS --------------------------------

//   useEffect(() => {
//     const fetchOrderData = () => {
//       try {
//         const ordersCollection = collection(db, "orders");
//         const unsubscribe = onSnapshot(ordersCollection, (orderSnapshot) => {
//           const ordersList = orderSnapshot.docs
//             .sort(
//               (a, b) => b.data().orderTime.seconds - a.data().orderTime.seconds
//             )
//             .map((doc) => doc.data());
//           setUsers(ordersList);

//           if (ordersList.length > 0) {
//             setSelectedCard(ordersList[0].phoneNumber);
//             setUserDetails(ordersList[0]);
//           }

//           setUsersCount(ordersList.length);
//         });

//         // Cleanup subscription on unmount
//         return () => unsubscribe();
//       } catch (error) {
//         console.error("Error fetching order data: ", error);
//       }
//     };

//     fetchOrderData();
//   }, []);

//   // -------------------------------- COMPONENT STYLES --------------------------------

//   const scrollbarStyles = {
//     minHeight: { xs: 60, md: 50 },
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "start",
//     borderRadius: 2,
//     padding: 2,
//     cursor: "pointer",
//     transition: "background-color 0.2s ease-in-out, color 0.2s ease-in-out",
//     width: "35%",
//     backgroundColor: "#d7d7d78a",
//     height: 600,
//   };

//   const scrollVerbarStyles = {
//     overflowY: "auto",
//     width: "100%",

//     // overflowX: "auto",
//     "&::-webkit-scrollbar": {
//       height: 0,
//     },
//     "&::-webkit-scrollbar-thumb": {
//       backgroundColor: "transparent",
//     },
//     "-ms-overflow-style": "none", // IE and Edge
//     "scrollbar-width": "none", // Firefox
//   };

//   const iconContainerStyle = {
//     width: "100%",
//     height: 60,
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "space-around",
//     borderRadius: 2,
//     backgroundColor: "#00000011", // Adjust opacity for background color
//     marginBottom: 1,
//   };

//   const subGridItemStyles = {
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "start",
//     cursor: "pointer",
//     width: "100%",
//     padding: 2,
//     border: "none",
//     color: "#000",
//     transition: "color 1.2s ease-in-out, width 1.2s ease-in-out",
//   };

//   const textalignCenter = {
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "start",
//     paddingLeft: 2,
//     width: { xs: "100%", md: "50%" },
//     marginBottom: 2,
//   };
//   // -------------------------------- FUNCTIONALITIES --------------------------------

//   const handleCardClick = (order, index) => {
//     setSelectedCard(order.phoneNumber);
//     setUserDetails(order);
//   };

//   return (
//     <Box
//       sx={{
//         display: "flex",
//         flexDirection: "column",
//         gap: 2,
//         p: { xs: 0, md: 2 },
//       }}
//     >
//       <Box sx={{ ...scrollbarStyles }}>
//         <Box sx={{ ...scrollVerbarStyles }}>
//           <Typography variant="h5" gutterBottom sx={{ color: "#fff", mb: 5 }}>
//             Users {usersCount}
//           </Typography>
//           {users.map((item, index) => (
//             <Grid item key={item.id}>
//               <Paper
//                 elevation={6}
//                 sx={{
//                   backgroundColor: "#fffeee",
//                   color: "#000",
//                   marginBottom: "5px",
//                   width: "100%",
//                   borderLeft:
//                     selectedCard === item.phoneNumber
//                       ? "5px solid #22222E"
//                       : "none",
//                 }}
//                 onClick={() => handleCardClick(item, index)}
//               >
//                 <Box
//                   sx={{
//                     display: "flex",
//                     flexDirection: "column",
//                     width: "100%",
//                     padding: "5px",
//                   }}
//                 >
//                   <Typography
//                     sx={{
//                       color: "#000",
//                     }}
//                   >
//                     {item.name}
//                   </Typography>
//                   <Typography
//                     sx={{
//                       color: "#000",
//                     }}
//                   >
//                     {item.phoneNumber}
//                   </Typography>
//                 </Box>
//               </Paper>
//             </Grid>
//           ))}
//         </Box>
//       </Box>
//       {/* --------------------- USER DETAILS BOX --------------------- */}
//       <Box
//         sx={{
//           display: "flex",
//           flexDirection: "row",
//           alignItems: "start",
//           width: "100%",
//           justifyContent: "space-between",
//           flexDirection: { xs: "column", md: "row" },
//         }}
//       >
//         {users

//           .map((order, index) => (
//             <Paper
//               key={index}
//               sx={{
//                 ...subGridItemStyles,
//               }}
//             >
//               <Box
//                 sx={{
//                   ...iconContainerStyle,
//                   justifyContent: "space-between",
//                   px: 2,
//                 }}
//               >
//                 <Typography sx={{ fontWeight: "bold", fontSize: 16 }}>
//                   Order ID: {order.orderID}
//                 </Typography>
//               </Box>

//               <Divider
//                 sx={{ backgroundColor: "#00000090", width: "100%", my: 1 }}
//               />
//               <Box
//                 sx={{
//                   display: "flex",
//                   width: "100%",
//                   flexWrap: "wrap",
//                   fontSize: 10,
//                 }}
//               >
//                 <Typography sx={textalignCenter}>
//                   Name:
//                   <PersonIcon sx={{ m: 0, color: "#626fa0", fontSize: 25 }} />
//                   {order.name}
//                 </Typography>
//                 <Typography sx={textalignCenter}>
//                   Phone Number:
//                   <LocalPhoneIcon
//                     sx={{ m: 0, color: "#626fa0", fontSize: 25 }}
//                   />
//                   {order.phoneNumber}
//                 </Typography>
//                 <Typography sx={textalignCenter}>
//                   Delivery Method:
//                   {order.deliveryMethod == "Dine-In" ? (
//                     <DiningIcon sx={{ m: 0, color: "#626fa0", fontSize: 25 }} />
//                   ) : (
//                     <TakeoutDiningIcon
//                       sx={{ m: 0, color: "#626fa0", fontSize: 25 }}
//                     />
//                   )}
//                   {order.deliveryMethod}
//                 </Typography>

//                 <Typography sx={textalignCenter}>
//                   Payment Method:
//                   {order.paymentMethod == "online" ? (
//                     <AccountBalanceRoundedIcon
//                       sx={{ m: 0, color: "#626fa0", fontSize: 25 }}
//                     />
//                   ) : (
//                     <LocalAtmIcon
//                       sx={{ m: 0, color: "#626fa0", fontSize: 25 }}
//                     />
//                   )}
//                   {order.paymentMethod}
//                 </Typography>
//                 <Typography sx={textalignCenter}>
//                   Order Status: {order.orderStatus}
//                 </Typography>
//               </Box>

//               <Typography sx={{ ...textalignCenter, fontWeight: 600 }}>
//                 Total Price: ₹{order.totalPrice}
//               </Typography>
//               <Divider
//                 sx={{ backgroundColor: "#00000090", width: "100%", my: 1 }}
//               />

//               <Typography
//                 sx={{
//                   fontSize: 16,
//                   textTransform: "uppercase",
//                   fontWeight: 600,
//                 }}
//               >
//                 Order Items:
//               </Typography>
//               <List>
//                 {order.cartItems.map((item, idx) => (
//                   <ListItem key={idx}>
//                     <ListItemAvatar>
//                       <Avatar src={item.img} alt={item.dishName} />
//                     </ListItemAvatar>
//                     <ListItemText
//                       primary={`${item.dishName} (QTY:${item.quantity})`}
//                       secondary={`Category: ${item.category}, Price: ${item.price}`}
//                     />
//                   </ListItem>
//                 ))}
//               </List>
//             </Paper>
//           ))}
//       </Box>
//     </Box>
//   );
// };

// export default Users;
