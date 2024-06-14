import React, { useEffect, useRef, useState } from "react";

// mui components
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { AddCircleOutlineSharp } from "@mui/icons-material";
import DeleteIcon from "@mui/icons-material/Delete";
import EventSeatIcon from "@mui/icons-material/EventSeat";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import TableBarIcon from "@mui/icons-material/TableBarTwoTone";
import {
  Box,
  Button,
  List,
  Typography,
  Modal,
  IconButton,
  Grid,
} from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import CancelIcon from "@mui/icons-material/Cancel";
import DownloadIcon from "@mui/icons-material/Download";

// firebase
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";

// packages
// import QRCode from "react-qr-code";
import QRCode from "qrcode.react";
// assets
import emptyPlate from "../../assets/images/emptyPlate.png";
import foodOnPlate1 from "../../assets/images/plateOnfood1.png";

// styles
import "./style.css";

const Tables = () => {
  // use ref
  const qrCodeRef = useRef(null);
  // local states
  const [tables, setTables] = useState([]);
  const [open, setOpen] = useState(false);
  const [addNewOpen, setAddNewOpen] = useState(false);
  const [selectedTable, setSelectedTable] = useState(null);
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [qrData, setQrData] = useState("");
  const [openQR, setOpenQR] = useState(false);
  const [chairId, setChairId] = useState("");

  // -------------------------------- USE EFFECTS --------------------------------

  useEffect(() => {
    const fetchTablesBookedFromFirestore = async () => {
      try {
        const docRef = doc(db, "bookingData", "tablesBooked");
        console.log(docRef);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data().tablesBooked;
          setTables(data);
          if (data.length > 0) {
            setSelectedTable(data[0]);
          }
        }
      } catch (error) {
        console.error("Error fetching data from Firestore: ", error);
      }
    };

    fetchTablesBookedFromFirestore();
  }, []);

  // -------------------------------- COMPONENTS STYLES  --------------------------------

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
  const chairCardStyle = {
    color: "#000",
    fontSize: 16,
    fontWeight: 600,
    width: "100%",
    height: 60,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-around",
    borderRadius: 2,
    backgroundColor: "#00000011",
    marginBottom: "10px",
    padding: "10px",
  };

  // -------------------------------- FUNCTIONALITIES --------------------------------

  const handleClickTable = (table, index) => {
    setSelectedTable(table);
    setOpen(true);
    setAddNewOpen(false);
  };

  const handleDelete = async () => {
    if (!selectedTable) return;

    try {
      const tableToDelete = selectedTable.table;

      const updatedTables = tables.filter(
        (table) => table.table !== tableToDelete
      );
      setTables(updatedTables);

      const tablesRef = doc(db, "bookingData", "tablesBooked");
      await updateDoc(tablesRef, {
        tablesBooked: updatedTables,
      });
      if (updatedTables.length > 0) {
        setSelectedTable(updatedTables[updatedTables.length - 1]);
      } else {
        setSelectedTable(null);
      }
    } catch (error) {
      console.error("Error deleting table from Firestore: ", error);
    }
  };

  const handleAddTable = async () => {
    setSelectedTable(null);
    try {
      const newTable = {
        table: selectedTable.table,
        chairs: selectedTable.chairs.map((chair) => ({ ...chair })),
        tableQRDetails: {
          table: selectedTable.table,
          chairs: selectedTable.chairs.map((chair) => ({ ...chair })),
        },
      };

      const tablesRef = doc(db, "bookingData", "tablesBooked");
      await updateDoc(tablesRef, {
        tablesBooked: [...tables, newTable],
      });

      setTables([...tables, newTable]);
      setSelectedTable(newTable);
      setAddNewOpen(false);
    } catch (error) {
      console.error("Error adding table to Firestore: ", error);
    }
  };

  const generateQRCodeData = (chair) => {
    if (!chair) return "";
    const qrData = {
      tableNumber: selectedTable.table,
      chairs: {
        id: chair.id,
        booked: true,
      },
    };
    const jsonString = JSON.stringify(qrData);
    const base64Data = btoa(jsonString); // Encode JSON string in base64
    // const url = `https://food-order-eight-iota.vercel.app/?data=${encodeURIComponent(
    //   base64Data
    // )}`;
    return jsonString;
  };

  const handleShowQr = (chair) => {
    const qrCodeUrl = generateQRCodeData(chair);
    setQrData(qrCodeUrl);
    setChairId(chair?.id);
    setQrModalOpen(true);
  };

  const handleCloseQrModal = () => {
    setOpenQR(false);
    setQrModalOpen(false);
    setQrData("");
  };

  const handleDownloadQRCode = () => {
    const canvas = qrCodeRef.current.querySelector('canvas');
    if (canvas) {
      const pngUrl = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.href = pngUrl;
      downloadLink.download = `table-${selectedTable?.table}_chair-${chairId}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    } else {
      console.error("Canvas element not found.");
    }
  };

  
  

  // -------------------------------- RENDER UI --------------------------------

  return (
    <Box
      sx={{
        width: "100%",
      }}
    >
      <Box
        sx={{
          width: {
            xs: "100%",
            md: "95%",
          },
          height: { xs: 400, md: 600 },
          m: 3,
          p: 2,
          backgroundColor: "#eee",
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
          <Button
            onClick={() => {
              setOpen(true);
              setAddNewOpen(true);

              const newTableId = `${tables.length + 1}`;
              setSelectedTable({
                table: newTableId,
                chairs: [
                  {
                    booked: false,
                    id: 1,
                  },
                  {
                    booked: false,
                    id: 2,
                  },
                  {
                    booked: false,
                    id: 3,
                  },
                  {
                    booked: false,
                    id: 4,
                  },
                ],
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
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            width: "100%",
            height: "75%",
            borderRadius: "15px",
          }}
        >
          <Box sx={{ ...scrollbarStyles, width: "60%" }}>
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
              {tables.length > 0 ? (
                <>
                  {tables?.map((table, index) => (
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
                                tables[index].chairs[chairIndex].booked
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
                                  tables[index].chairs[chairIndex].booked
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
                                tables[index].chairs[chairIndex + 2].booked
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
                </>
              ) : (
                <>
                  <Typography> ADD TABLES </Typography>
                </>
              )}
            </List>
          </Box>

          <Box
            sx={{
              ...scrollbarStyles,
              width: "35%",
              backgroundColor: "#00000011",
              display: "flex",
              flexDirection: "column",
              padding: "5px",
              borderRadius: "10px",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                width: "100%",
              }}
            >
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

              <Button
                variant="contained"
                onClick={Boolean(addNewOpen) ? handleAddTable : handleDelete}
                sx={{
                  height: 40,
                  width: "40%",
                  backgroundColor: "#fff",
                  color: "#000",
                  alignItems: "center",
                  justifyContent: "space-around",
                }}
              >
                {Boolean(addNewOpen) ? (
                  <AddCircleOutlineIcon />
                ) : (
                  <DeleteIcon />
                )}
                {Boolean(addNewOpen) ? "Add Table" : "Delete Table"}
              </Button>
            </Box>
            {selectedTable && (
              <>
                <List
                  key={2}
                  container
                  spacing={2}
                  sx={{
                    flexWrap: "wrap",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "start ",
                    flexDirection: "column",
                    width: "100%",
                  }}
                >
                  {selectedTable.chairs.map((chair, index) => (
                    <ul
                      key={index}
                      style={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "space-around",
                      }}
                    >
                      {chair.booked ? (
                        <li
                          style={{
                            ...chairCardStyle,
                          }}
                        >
                          Chair {index + 1} - #{chair.orderId}
                          <Button
                            onClick={() => handleShowQr(chair)}
                            variant="outlined"
                            sx={{
                              borderColor: "#626fa0",
                              "&:hover": {
                                borderColor: "#626fa0",
                              },
                            }}
                          >
                            show <QrCodeScannerIcon sx={{ ml: 2 }} />
                          </Button>
                        </li>
                      ) : (
                        <li
                          style={{
                            ...chairCardStyle,
                          }}
                        >
                          Chair {index + 1} - Available
                          <Button
                            onClick={() => handleShowQr(chair)}
                            variant="outlined"
                            sx={{
                              borderColor: "#626fa0",
                              "&:hover": {
                                borderColor: "#626fa0",
                              },
                            }}
                          >
                            show
                            <QrCodeScannerIcon sx={{ ml: 2 }} />
                          </Button>
                        </li>
                      )}
                    </ul>
                  ))}
                </List>
              </>
            )}
          </Box>
        </Box>
      </Box>
      <Modal
        open={qrModalOpen}
        onClose={handleCloseQrModal}
        aria-labelledby="qr-code-modal"
        aria-describedby="qr-code-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: openQR ? 300 : 350,
            bgcolor: "background.paper",
            border: "none",
            boxShadow: 24,
            borderRadius: 5,
            p: 4,
            display: "flex",
            flexDirection: openQR ? "column" : "row",
            alignItems: "center",
          }}
        >
          <IconButton
            onClick={handleCloseQrModal}
            sx={{ position: "absolute", top: 10, right: 10 }}
          >
            <CancelIcon />
          </IconButton>
          <Box  ref={qrCodeRef} sx={{ display: "flex", justifyContent: "center", mb: 2 }} >
            <QRCode
            id="qr-canvas"
            level="H"
            size={openQR ? 400 : 200} 
              value={qrData}
              onClick={() => {
                // setQrModalOpen(false);
                // setTimeout(() => setQrModalOpen(true), 200);
                setOpenQR(!openQR);
              }}
              style={{
                cursor: "pointer",
                height: openQR ? 200 : 100,
                width: openQR ? 200 : 100,
              }}
            />
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              paddingX: "20px",
              alignItems: "center",
            }}
          >
            <Typography variant="h6">
              Table {selectedTable?.table} - Chair {chairId}
            </Typography>
            <Button
              onClick={handleDownloadQRCode}
              variant="outlined"
              startIcon={<DownloadIcon />}
              sx={{ mt: 2 }}
            >
              Download
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default Tables;
