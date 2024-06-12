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
  TextField,
  OutlinedInput,
  Grid,
} from "@mui/material";
import { collection, doc, onSnapshot, setDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../../firebaseConfig";

const Tables = () => {
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

  useEffect(() => {
    const sendTablesBookedToFirestore = async () => {
      try {
        const docRef = doc(db, "bookingData", "tablesBooked");
        await setDoc(docRef, { tablesBooked });
        console.log("Data sent to Firestore successfully.");
      } catch (error) {
        console.error("Error sending data to Firestore: ", error);
      }
    };

    sendTablesBookedToFirestore();
  }, [tablesBooked]);

  // useEffect(() => {
  //   // const fetchOrderData = () => {
  //   //   try {
  //   //     const ordersCollection = collection(db, "orders");
  //   //     const unsubscribe = onSnapshot(ordersCollection, (orderSnapshot) => {
  //   //       const ordersList = orderSnapshot.docs
  //   //         .sort(
  //   //           (a, b) => b.data().orderTime.seconds - a.data().orderTime.seconds
  //   //         ) // Ensure correct property access
  //   //         .map((doc) => doc.data());

  //   //       setOrderData(ordersList);
  //   //       setOrderIDCard(ordersList[0].phoneNumber);

  //   //       setOrdersCount(ordersList.length);
  //   //     });

  //   //     // Cleanup subscription on unmount
  //   //     return () => unsubscribe();
  //   //   } catch (error) {
  //   //     console.error("Error fetching order data: ", error);
  //   //   }
  //   // };

  //   fetchOrderData();
  // }, []);

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

  return (
    <Box
      sx={{
        display: { xs: "block", md: "block" },
        width: "100%",
        // m: "10px",
      }}
    >
      <Typography variant="h5" gutterBottom sx={{ color: "#fff", mt: 4 }}>
        Tables
      </Typography>
      <Box sx={{ ...scrollbarStyles }}>
        {/* <Grid container spacing={2} sx={{ flexWrap: "nowrap" }}>
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
                    onClick={() => handleChairClick(table.table, chairIndex)}
                  ></div>
                ))}
              </div>
              <div className="dine-table flex-column  justify-content-evenly">
                <div className="d-flex justify-content-evenly w-100 flex-wrap">
                  {table.chairs.slice(0, 4).map((chair, chairIndex) => (
                    <div
                      key={index}
                      className="mx-1 my-1"
                      onClick={() => handleChairClick(table.table, chairIndex)}
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
        </Grid> */}
      </Box>
    </Box>
  );
};

export default Tables;
