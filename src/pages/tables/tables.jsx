import { Box, Button, Grid, List, Typography, Modal } from "@mui/material";
import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../../firebaseConfig";
// assets
import emptyPlate from "../../assets/images/emptyPlate.png";
import foodOnPlate1 from "../../assets/images/plateOnfood1.png";
import "./style.css";
import TableBarIcon from "@mui/icons-material/TableBarTwoTone";
import { AddCircleOutlineSharp, AddCircleTwoTone } from "@mui/icons-material";
import EventSeatIcon from "@mui/icons-material/EventSeat";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import Tooltip from "@mui/material/Tooltip";

const Tables = () => {
  const [tablesBooked, setTablesBooked] = useState([]);
  const [open, setOpen] = useState(false);
  const [addNewOpen, setAddNewOpen] = useState(false);
  const [selectedTable, setSelectedTable] = useState(null);

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
  const modalstyle = {
    width: "100%",
    height: 60,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-around",
    borderRadius: 2,
    backgroundColor: "#00000011",
    marginBottom: 1,
  };
  const iconStyle = {
    fontSize: 40,
    marginBottom: 1,
  };

  // -------------------------------- FUNCTIONALITIES --------------------------------

  const handleClickTable = (table, index) => {
    console.log(table);
    setSelectedTable(table);
    setOpen(true);
    setAddNewOpen(false);
  };
  const handleClose = () => {
    setOpen(false);
    setSelectedTable(null);
    setAddNewOpen(false);
  };
  const handleDelete = () => {
    // Implement your delete logic here
    handleClose();
  };

  return (
    <Box
      sx={{
        display: { xs: "block", md: "flex" },
        width: "100%",
        // m: "10px",
      }}
    >
      <Box
        sx={{
          width: { xs: "100%", md: "45%" },
          height: { xs: 400, md: 600 },
          m: 3,
          p: 2,
          backgroundColor: "#ffffff",
          // backgroundImage:
          //   "url('https://cdn.pixabay.com/photo/2016/06/02/02/33/triangles-1430105_1280.png')",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          borderRadius: 2,
          borderRadius: 2,
        }}
      >
        <Box
          sx={{
            ...iconContainerStyle,
            justifyContent: "space-between",
            px: 2,
          }}
        >
          <Typography sx={{ fontWeight: "bold", fontSize: 20 }}>
            Avaliable Table list
            <TableBarIcon
              sx={{ color: "#626fa0", mx: 2, fontSize: 30, my: 2 }}
            />
          </Typography>
        </Box>

        <Box
          sx={{
            ...iconContainerStyle,
            justifyContent: "start ",
            px: 2,
          }}
        >
          <Typography sx={{ fontWeight: "bold", fontSize: 16 }}>
            <FiberManualRecordIcon
              sx={{ color: "#000000", mr: 1, fontSize: 10, my: 2 }}
            />
            Not Avaliable
            <EventSeatIcon
              sx={{ color: "#1ab46a", mx: 2, fontSize: 30, my: 2 }}
            />
          </Typography>{" "}
          |
          <Typography sx={{ fontWeight: "bold", fontSize: 16, ml: 2 }}>
            <FiberManualRecordIcon
              sx={{ color: "#000000", mr: 1, fontSize: 10, my: 2 }}
            />
            Avaliable
            <EventSeatIcon
              sx={{ color: "#000000", mx: 2, fontSize: 30, my: 2 }}
            />
          </Typography>
        </Box>
        <Box sx={{ ...scrollbarStyles, width: "100%" }}>
          <List
            key={1}
            container
            spacing={2}
            sx={{
              flexWrap: "wrap",
              display: "flex",
              justifyContent: "space-evenly",
            }}
          >
            {tablesBooked?.map((table, index) => (
              <div
                key={index}
                className="table-container-page mx-1 my-3 mb-4 d-flex flex-column"
              >
                <div className="table-chair-container-page w-100 px-4">
                  {table.chairs.slice(0, 2).map((chair, chairIndex) => (
                    <Tooltip
                      key={chairIndex}
                      title={
                        chair.booked
                          ? "This chair is booked #ORD0012"
                          : "This chair is available"
                      }
                      arrow
                    >
                      <div
                        className={
                          tablesBooked[index].chairs[chairIndex].booked
                            ? "chairBooked-already-page"
                            : chair.booked
                            ? "table-chair-booked-page"
                            : "table-chair-page"
                        }
                      ></div>
                    </Tooltip>
                  ))}
                </div>
                <div
                  className="dine-table-page flex-column  justify-content-evenly"
                  onClick={() => {
                    handleClickTable(table, index);
                  }}
                >
                  <div className="d-flex justify-content-evenly w-100 flex-wrap">
                    {table.chairs.slice(0, 4).map((chair, chairIndex) => (
                      <div key={index} className="mx-1 my-1">
                        <img
                          src={
                            tablesBooked[index].chairs[chairIndex].booked
                              ? foodOnPlate1
                              : chair.booked
                              ? foodOnPlate1
                              : emptyPlate
                          }
                          alt="img"
                          className={`table-plate-page `}
                        />
                      </div>
                    ))}
                  </div>
                  <p className="table-number">{table.table}</p>
                </div>
                <div className="table-chair-container-page w-100 px-4">
                  {table.chairs.slice(2, 4).map((chair, chairIndex) => (
                    <Tooltip
                      key={chairIndex}
                      title={
                        chair.booked
                          ? "This chair is booked #ORD001"
                          : "This chair is available"
                      }
                      arrow
                    >
                      <div
                        className={
                          tablesBooked[index].chairs[chairIndex + 2].booked
                            ? "chairBooked-bottom-already-page"
                            : chair.booked
                            ? "table-chair-bottom-booked-page"
                            : "table-chair-bottom-page"
                        }
                      ></div>
                    </Tooltip>
                  ))}
                </div>
              </div>
            ))}
          </List>
        </Box>
      </Box>
      <Box
        sx={{
          width: { xs: "100%", md: "50%" },
          height: { xs: 400, md: 600 },
          m: 3,
          p: 2,
          backgroundColor: "#ffffff",
          // backgroundImage:
          //   "url('https://cdn.pixabay.com/photo/2016/06/02/02/33/triangles-1430105_1280.png')",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          borderRadius: 2,
          borderRadius: 2,
        }}
      >
        <Box
          sx={{
            ...iconContainerStyle,
            justifyContent: "space-between",
            px: 2,
          }}
        >
          <Typography sx={{ fontWeight: "bold", fontSize: 20 }}>
            {addNewOpen ? "Add New Table" : "Details About Tables"}
            <TableBarIcon
              sx={{ color: "#626fa0", mx: 2, fontSize: 30, my: 2 }}
            />
          </Typography>
          <Button
            onClick={() => {
              setOpen(true);
              setAddNewOpen(true);
              setSelectedTable({
                chairs: [
                  {
                    booked: false,
                    id: 1,
                  },
                  {
                    id: 2,
                    booked: false,
                  },
                  {
                    booked: false,
                    id: 3,
                  },
                  {
                    id: 4,
                    booked: false,
                  },
                ],
                table: "",
              });
            }}
            variant="outlined"
            sx={{
              borderColor: "#626fa0",
              "&:hover": {
                borderColor: "#626fa0",
              },
            }}
          >
            <AddCircleOutlineSharp style={{ color: "#626fa0" }} />
            <Typography
              sx={{ fontWeight: "bold", fontSize: 16, mx: 2, color: "#626fa0" }}
            >
              ADD NEW
            </Typography>
          </Button>
        </Box>

        <Box sx={{ ...scrollbarStyles, width: "100%" }}>
          <Box sx={{ display: "flex" }}>
            <List
              key={1}
              container
              spacing={2}
              sx={{
                flexWrap: "wrap",
                display: "flex",
                justifyContent: "start",
                width: "50%",
              }}
            >
              <div
                key={1}
                className="table-container-page mx-1 my-3 mb-4 d-flex flex-column"
              >
                <div className="table-chair-container-page w-100 px-4">
                  {selectedTable?.chairs
                    .slice(0, 2)
                    .map((chair, chairIndex) => (
                      <Tooltip
                        key={chairIndex}
                        title={
                          chair.booked
                            ? "This chair is booked #ORD0012"
                            : "This chair is available"
                        }
                        arrow
                      >
                        {console.log(chair)}
                        <div
                          className={
                            chair.booked
                              ? "chairBooked-already-page"
                              : "table-chair-page"
                          }
                        ></div>
                      </Tooltip>
                    ))}
                </div>
                <div className="dine-table-page flex-column  justify-content-evenly">
                  <div className="d-flex justify-content-evenly w-100 flex-wrap">
                    {selectedTable?.chairs
                      .slice(0, 4)
                      .map((chair, chairIndex) => (
                        <div key={chairIndex} className="mx-1 my-1">
                          <img
                            src={
                              chair.booked
                                ? foodOnPlate1
                                : chair.booked
                                ? foodOnPlate1
                                : emptyPlate
                            }
                            alt="img"
                            className={`table-plate-page `}
                          />
                        </div>
                      ))}
                  </div>
                  <p className="table-number">{selectedTable?.table}</p>
                </div>
                <div className="table-chair-container-page w-100 px-4">
                  {selectedTable?.chairs
                    .slice(2, 4)
                    .map((chair, chairIndex) => (
                      <Tooltip
                        key={chairIndex}
                        title={
                          chair.booked
                            ? "This chair is booked #ORD001"
                            : "This chair is available"
                        }
                        arrow
                      >
                        <div
                          className={
                            chair.booked
                              ? "chairBooked-bottom-already-page"
                              : "table-chair-bottom-page"
                          }
                        ></div>
                      </Tooltip>
                    ))}
                </div>
              </div>
            </List>
            {selectedTable && (
              <List
                key={2}
                container
                spacing={2}
                sx={{
                  flexWrap: "wrap",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "start ",
                  flexDirection:"column",
                  width: "50%",
                }}
              >
                {selectedTable.chairs.map((chair, index) => (
                  <ul key={index}>
                    {chair.booked ? (
                      <li>
                        Chair {index + 1} - #{chair.orderId}
                      </li>
                    ) : (
                      <li>Chair {index + 1} - Available</li>
                    )}
                  </ul>
                ))}
              </List>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Tables;
