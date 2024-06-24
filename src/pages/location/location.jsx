import "@geoapify/geocoder-autocomplete/styles/minimal.css";
import EditIcon from "@mui/icons-material/Edit";
import {
  Box,
  Button,
  Grid,
  IconButton,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { collection, doc, onSnapshot, updateDoc } from "firebase/firestore";
import L from "leaflet"; // Import Leaflet library
import "leaflet/dist/leaflet.css"; // Ensure Leaflet's CSS is imported for proper styling
import React, { useEffect, useState } from "react";
import {
  Circle,
  MapContainer,
  Marker,
  TileLayer,
  useMapEvents,
} from "react-leaflet";
import locationIcon from "../../assets/images/location.png";
import { db } from "../../firebaseConfig";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import { useSelector } from "react-redux";
const LocationPage = () => {
  const [positions, setPositions] = useState([]);
  const [currentPosition, setCurrentPosition] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [address, setAddress] = useState({
    shopName: "",
    phoneNumber: "",
    address: "",
    city: "",
    state: "",
    country: "",
  });

  const hotelData = useSelector((state) => state.auth.hotelData);
  const hotelUID = hotelData[0]?.uid;

  const apiKey = "37b4cf9407c146caa22bf64efcc6ed65";
  // Fetch user's current location coordinates
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCurrentPosition([latitude, longitude]);
      },
      (error) => {
        console.error("Error getting current location:", error);
      }
    );
  }, []); // Empty dependency array ensures this runs only once, on component mount

  useEffect(() => {

    setAddress(hotelData[0]);
    setPositions(hotelData[0]?.coordinates || [])
  }, [hotelData]);

  // Define custom icon
  const customIcon = L.icon({
    iconUrl: locationIcon,
    iconSize: [22, 32], // size of the icon
    iconAnchor: [16, 32], // point of the icon which will correspond to marker's location
    popupAnchor: [0, -32], // point from which the popup should open relative to the iconAnchor
  });

  // Handle map click to set selected location

  // Function to toggle edit mode
  const toggleEditMode = () => {
    setEditMode(!editMode);
  };

  // Function to handle changes in the form fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddress({ ...address, [name]: value });
  };

  // Function to handle form submission and update data in Firestore
  const handleSubmit = async () => {
    try {
      const locationDocRef = doc(db, "hotels", hotelUID); // Assuming 'id' is the document ID in Firestore
      await updateDoc(locationDocRef, {
        shopName: address.shopName,
        phoneNumber: address.phoneNumber,
        address: address.address,
        city: address.city,
        state: address.state,
        country: address.country,
      });
      setEditMode(false);
      console.log("Document updated successfully!");
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  // Function to handle map click event
  const handleClick = async (e) => {
    const { lat, lng } = e.latlng; // Extract latitude and longitude from Leaflet's latlng object

    try {
      const locationDocRef = doc(db, "hotels", hotelUID); // Assuming 'id' is the document ID in Firestore
      await updateDoc(locationDocRef, {
        coordinates: [lat, lng], // Update coordinates in Firestore document
      });
      console.log("Coordinates updated successfully!");
    } catch (error) {
      console.error("Error updating coordinates:", error);
    }
  };
  // Function to handle map click event
  const handleCurrentLocation = async (e) => {
    try {
      const locationDocRef = doc(db, "hotels", hotelUID); // Assuming 'id' is the document ID in Firestore
      await updateDoc(locationDocRef, {
        coordinates: currentPosition, // Update coordinates in Firestore document
      });
      console.log("Coordinates updated successfully!");
    } catch (error) {
      console.error("Error updating coordinates:", error);
    }
  };

  const ClickHandler = ({ onClick }) => {
    const map = useMapEvents({
      click(e) {
        onClick(e); // Passes the Leaflet MouseEvent to the onClick handler
      },
    });

    return null; // This component doesn't render anything visible on the map
  };
  console.log(address);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        p: { xs: 2, md: 2 },
        background: "#eee",
        borderRadius: 2,
        mt: 3,
        mx: 1,
        minHeight: 600,
      }}
    >
      <Typography
        gutterBottom
        sx={{ color: "#000", fontSize: 20, mt: 1, fontWeight: 600 }}
      >
        Location Page
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper
            elevation={6}
            sx={{
              border: "2px solid #ccc",
              padding: "10px",
              borderRadius: 2,
              backgroundColor: "#f5f5f5",
              position: "relative",
            }}
          >
            <Typography
              sx={{ fontWeight: 600, fontSize: { md: 24, xs: 14 }, mt: 3 }}
            >
              Location Details
              {!editMode && (
                <IconButton
                  sx={{ position: "absolute", top: 5, right: 5 }}
                  onClick={toggleEditMode}
                >
                  <EditIcon />
                </IconButton>
              )}
            </Typography>
            {!editMode ? (
              <>
                <Typography
                  sx={{ fontWeight: 600, fontSize: { md: 16, xs: 12 }, mt: 3 }}
                >
                  Shop Name: {address.shopName}
                </Typography>
                <Typography
                  sx={{ fontWeight: 600, fontSize: { md: 16, xs: 12 }, mt: 3 }}
                >
                  Phone Number: {address.phoneNumber}
                </Typography>
                <Typography
                  sx={{ fontWeight: 600, fontSize: { md: 16, xs: 12 }, mt: 3 }}
                >
                  Address: {address.address}
                </Typography>
                <Typography
                  sx={{ fontWeight: 600, fontSize: { md: 16, xs: 12 }, mt: 3 }}
                >
                  City: {address.city}
                </Typography>
                <Typography
                  sx={{ fontWeight: 600, fontSize: { md: 16, xs: 12 }, mt: 3 }}
                >
                  State: {address.state}
                </Typography>
                <Typography
                  sx={{ fontWeight: 600, fontSize: { md: 16, xs: 12 }, mt: 3 }}
                >
                  Country: {address.country}
                </Typography>
              </>
            ) : (
              <>
                <TextField
                  label="Shop Name"
                  name="shopName"
                  value={address.shopName}
                  onChange={handleChange}
                  fullWidth
                  sx={{ my: 2 }}
                  error={!address.shopName}
                />
                <TextField
                  label="Phone Number"
                  name="phoneNumber"
                  value={address.phoneNumber}
                  onChange={handleChange}
                  fullWidth
                  sx={{ my: 2 }}
                  error={!address.phoneNumber}
                />
                <TextField
                  label="Address"
                  name="address"
                  value={address.address}
                  onChange={(e) => {
                    handleChange(e);
                  }}
                  fullWidth
                  sx={{ my: 2 }}
                  error={!address.address}
                />
                <TextField
                  label="City"
                  name="city"
                  value={address.city}
                  onChange={handleChange}
                  fullWidth
                  sx={{ my: 2 }}
                  error={!address.city}
                />
                <TextField
                  label="State"
                  name="state"
                  value={address.state}
                  onChange={handleChange}
                  fullWidth
                  sx={{ my: 2 }}
                  error={!address.state}
                />
                <TextField
                  label="Country"
                  name="country"
                  value={address.country}
                  onChange={handleChange}
                  fullWidth
                  sx={{ my: 2 }}
                  error={!address.country}
                />
                <Button sx={{ color: "green" }} onClick={handleSubmit}>
                  Save Changes
                </Button>
              </>
            )}
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper
            elevation={6}
            sx={{
              border: "2px solid #ccc",
              padding: "10px",
              height: 500,
              borderRadius: 2,
              backgroundColor: "#f5f5f5",
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="h6" gutterBottom>
                Map
              </Typography>
              <Button
                sx={{ color: "red" }}
                onClick={() => handleCurrentLocation()}
              >
                {" "}
                <MyLocationIcon sx={{ mx: 1 }} /> {"current location"}
              </Button>
            </Box>
            {positions.length > 0 && (
              <MapContainer
                center={positions}
                zoom={14}
                style={{ height: "85%", width: "100%" }}
                scrollWheelZoom={true}
              >
                <TileLayer
                  url={`https://maps.geoapify.com/v1/tile/osm-bright/{z}/{x}/{y}.png?apiKey=${apiKey}`}
                />{" "}
                <ClickHandler onClick={handleClick} />
                <Marker position={positions} icon={customIcon} />
              </MapContainer>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default LocationPage;
