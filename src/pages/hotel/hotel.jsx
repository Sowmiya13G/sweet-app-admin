import { Box, Button, Grid, Paper, TextField, Typography } from "@mui/material";
import { sendSignInLinkToEmail } from "firebase/auth"; // Import auth methods
import { collection, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Loader from "../../components/loader/loader";
import { auth, db } from "../../firebaseConfig"; // Ensure auth is imported
import { useDispatch, useSelector } from "react-redux";
import { updateHotelID } from "../../redux/reducers/authSlice";

const HotelManagement = () => {
  const disptach = useDispatch();
  const [cusLoader, setCusLoader] = useState(false);
  const [hotelName, setHotelName] = useState("");
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [hotels, setHotels] = useState([]);
  const hotelDetails = useSelector((state) => state.auth.hotelID);
  const navigate = useNavigate();
  console.log(hotelDetails);
  const gridItemStyles = {
    height: { xs: 100, md: 130 },
    display: "flex",
    flexDirection: "column",
    color: "#000",
    backgroundColor: "#fff",
    padding: 1,
    alignItems: "center",
    justifyContent: "end",
    borderRadius: 2,
    width: { xs: 150, md: 150 },
    maxWidth: { xs: 150, md: 200 },
    cursor: "pointer",
    transition: "background-color 0.2s ease-in-out, color 0.2s ease-in-out",
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

  const categoriesStyle = {
    cursor: "pointer",
    transition: "background-color 0.2s ease-in-out, color 0.2s ease-in-out",
    width: "100%",
    backgroundColor: "#00000001",
    padding: "15px",
    borderRadius: "10px",
  };

  // -------------------------------- FUNCTIONALITIES --------------------------------

  useEffect(() => {
    const fetchHotels = async () => {
      setCusLoader(true);
      const querySnapshot = await getDocs(collection(db, "hotels"));
      const hotelsList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setHotels(hotelsList);
      const filterHotelList = hotelsList.filter((x) => x.uid === hotelDetails);
      setSelectedHotel(filterHotelList[0]);

      setCusLoader(false);
    };

    fetchHotels();
  }, [hotelDetails]);

  const handleHotelClick = (item) => {
    disptach(updateHotelID(item?.uid));
  };

  const handleSendVerificationEmail = async () => {
    if (!email || !hotelName) {
      toast.error("Please enter both your email and hotel name");
      return;
    }

    try {
      const actionCodeSettings = {
        url: `https://food-order-eight-iota.vercel.app/completeRegistration?email=${encodeURIComponent(
          email
        )}&hotelName=${encodeURIComponent(hotelName)}`,
        handleCodeInApp: true,
      };
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      toast.info("Verification email sent. Please check your inbox.");
    } catch (error) {
      console.error("Error sending email:", error);
      toast.error(`Error sending email: ${error.message}`);
    }
  };

  const hotelListBox = () => (
    <Paper elevation={6} sx={categoriesStyle}>
      <Typography variant="h6">Add New Hotel</Typography>
      <TextField
        label="Hotel Name"
        value={hotelName}
        onChange={(e) => setHotelName(e.target.value)}
        fullWidth
        margin="normal"
      />

      <TextField
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        fullWidth
        margin="normal"
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleSendVerificationEmail}
        sx={{ mt: 2 }}
      >
        Send Hotel Verification
      </Button>
    </Paper>
  );

  const hotelDetailsListBox = () => (
    <Paper elevation={6} sx={categoriesStyle}>
      <Typography variant="h6">Selected Hotel Details</Typography>
      <TextField
        label="Hotel Name"
        value={selectedHotel.name}
        // onChange={(e) => setHotelName(e.target.value)}
        fullWidth
        disabled
        margin="normal"
      />
      <TextField
        label="Details"
        value={selectedHotel.details}
        // onChange={(e) => setEmail(e.target.value)}
        fullWidth
        disabled
        margin="normal"
      />

      <TextField
        label="Email"
        value={selectedHotel.emailId}
        // onChange={(e) => setEmail(e.target.value)}
        fullWidth
        margin="normal"
        disabled
      />
      <TextField
        label="Hotel-ID"
        value={selectedHotel.uid}
        // onChange={(e) => setEmail(e.target.value)}
        fullWidth
        margin="normal"
        disabled
      />
    </Paper>
  );
  console.log(selectedHotel);
  return (
    <>
      {!cusLoader ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            p: { xs: 2, md: 2 },
            m: 2,
            background: "#eee",
            borderRadius: 2,
            // height: "80vh",
          }}
        >
          <Typography
            gutterBottom
            sx={{ color: "#000", fontSize: 20, mt: 1, fontWeight: 600 }}
          >
            Hotel Management
          </Typography>

          <Box sx={{ ...scrollbarStyles }}>
            <Grid
              container
              spacing={2}
              sx={{ flexWrap: "nowrap", p: 2, pt: 0 }}
            >
              {hotels.map((item) => (
                <Grid item key={item.id} sx={{ pt: 0 }}>
                  <Paper
                    elevation={6}
                    sx={{
                      ...gridItemStyles,
                      backgroundColor:
                        selectedHotel?.uid === item.uid ? "#3c3c4e" : "#fff",
                      color: selectedHotel?.uid === item.uid ? "#fff" : "#000",
                    }}
                    onClick={() => handleHotelClick(item)}
                  >
                    <Box
                      sx={{
                        width: { xs: "70px", md: "90px" },
                        height: { xs: "70px", md: "90px" },
                        mb: 0.5,
                      }}
                    >
                      <img
                        src={item.imgSrc}
                        width="100%"
                        height="100%"
                        style={{
                          borderRadius: 10,
                          objectFit: "contain",
                          backgroundColor: "#ffff",
                          boxShadow: "0px 15px 20px 0px #00000031",
                        }}
                        alt="Hotel"
                      />
                    </Box>
                    <Typography
                      sx={{
                        fontSize: { xs: 12, md: 16 },
                        fontWeight: 600,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        px: 2,
                      }}
                      noWrap
                    >
                      {item.name}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>

          <Box
            sx={{
              display: { xs: "block", md: "flex" },
              flexDirection: "row",
              alignItems: "start",
              width: "100%",
              justifyContent: "space-between",
            }}
          >
            <Box
              sx={{
                width: { xs: "100%", md: "49%" },
                mt: 1,
              }}
            >
              {hotelListBox()}
            </Box>
            {selectedHotel && (
              <Box
                sx={{
                  width: { xs: "100%", md: "49%" },
                  mt: 1,
                }}
              >
                {hotelDetailsListBox()}
              </Box>
            )}
          </Box>
        </Box>
      ) : (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 2,
            mt: 2,
            height: "80vh",
            p: { xs: 0, md: 2 },
          }}
        >
          <Loader />
        </Box>
      )}
    </>
  );
};

export default HotelManagement;
