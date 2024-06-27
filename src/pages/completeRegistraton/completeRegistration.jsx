import { Box, Paper, Typography, TextField, Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { db, storage, auth } from "../../firebaseConfig";
import { collection, getDocs, doc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { signInWithEmailLink, updatePassword } from "firebase/auth";
import { toast } from "react-toastify";
import Loader from "../../components/loader/loader";

const CompleteRegistration = () => {
  const [cusLoader, setCusLoader] = useState(false);
  const [hotelName, setHotelName] = useState("");
  const [hotelDetails, setHotelDetails] = useState("");
  const [hotelImage, setHotelImage] = useState(null);
  const [password, setPassword] = useState("");
  const [hotels, setHotels] = useState([]);
  const [email, setEmail] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHotels = async () => {
      setCusLoader(true);
      const querySnapshot = await getDocs(collection(db, "hotels"));
      const hotelsList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setHotels(hotelsList);
      setCusLoader(false);
    };

    fetchHotels();
  }, []);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const emailID = queryParams.get("email");
    const hotelNameParam = queryParams.get("hotelName");

    if (emailID) {
      setEmail(emailID);
    }

    if (hotelNameParam) {
      setHotelName(hotelNameParam);
    }
  }, [location]);

  const handleCompleteRegistration = async () => {
    if (!hotelName || !hotelDetails || !hotelImage || !password) {
      toast.error("Please enter all fields");
      return;
    }

    if (!email) {
      toast.error("Invalid email or link");
      return;
    }

    setCusLoader(true);

    try {
      const emailLink = window.location.href;
      const userCredential = await signInWithEmailLink(auth, email, emailLink);

      if (userCredential.user.emailVerified) {
        await updatePassword(userCredential.user, password);
        const hotelId = userCredential.user.uid;

        const imageRef = ref(storage, `hotelImages/${hotelImage.name}`);
        await uploadBytes(imageRef, hotelImage);
        const imgSrc = await getDownloadURL(imageRef);

        await setDoc(doc(db, "hotels", hotelId), {
          name: hotelName,
          details: hotelDetails,
          imgSrc,
          emailId: email,
          uid: hotelId,
        });

        setHotelName("");
        setHotelDetails("");
        setHotelImage(null);
        setPassword("");
        toast.success("Hotel added successfully");
        navigate("/"); // Navigate to another page after successful registration
      } else {
        toast.error("Email not verified");
      }
    } catch (error) {
      console.log(error);
      toast.error(`Error adding hotel: ${error.message}`);
    } finally {
      setCusLoader(false);
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setHotelImage(e.target.files[0]);
    }
  };

  return (
    <>
      {!cusLoader ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            p: { xs: 0, md: 2 },
            m: "auto",
            // background: "#eee",
            width: { xs: "90%", md: 500 },
            height: "100vh",
            alignSelf: "center",
            borderRadius: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "start",
              width: "100%",
              justifyContent: "space-between",
            }}
          >
            <Box sx={{ width: { xs: "100%", md: "100%" }, my: 1 }}>
              <Paper
                elevation={6}
                sx={{ padding: 3, margin: "auto", width: "100%", mt: 2 }}
              >
                <Typography
                  gutterBottom
                  sx={{
                    color: "#000",
                    fontSize: 20,
                    mt: 1,
                    fontWeight: 600,
                    textAlign: "center",
                  }}
                >
                  Complete Hotel Registration
                </Typography>
                <TextField
                  label="Hotel Name"
                  value={hotelName}
                  onChange={(e) => setHotelName(e.target.value)}
                  fullWidth
                  disabled
                  margin="normal"
                />
                <TextField
                  label="Hotel Details"
                  value={hotelDetails}
                  onChange={(e) => setHotelDetails(e.target.value)}
                  fullWidth
                  margin="normal"
                  multiline
                  rows={4}
                />
                <Button variant="contained" component="label" sx={{ mt: 2 }}>
                  Upload Image
                  <input type="file" hidden onChange={handleImageChange} />
                </Button>

                {hotelImage && <Typography>{hotelImage.name}</Typography>}
                <TextField
                  label="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  fullWidth
                  disabled
                  margin="normal"
                />
                <TextField
                  label="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  fullWidth
                  margin="normal"
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleCompleteRegistration}
                  sx={{ mt: 2 }}
                >
                  Add Hotel
                </Button>
              </Paper>
            </Box>
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

export default CompleteRegistration;
