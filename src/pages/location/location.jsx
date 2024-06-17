import { Box, Grid, Typography, TextField, IconButton } from "@mui/material";
import { collection, onSnapshot } from "firebase/firestore";
import L from "leaflet"; // Import Leaflet library
import "leaflet/dist/leaflet.css"; // Ensure Leaflet's CSS is imported for proper styling
import React, { useEffect, useState } from "react";
import { Circle, MapContainer, Marker, TileLayer } from "react-leaflet";
import locationIcon from "../../assets/images/location.png";
import { db } from "../../firebaseConfig";
import EditIcon from "@mui/icons-material/Edit";

const LocationPage = () => {
  const [currentPosition, setCurrentPosition] = useState(null);
  const [positions, setPositions] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [address, setAddress] = useState({
    shopName: "",
    phoneNumber: "",
    address: "",
    city: "",
    state: "",
    country: "",
  });

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
    const fetchOrderData = () => {
      try {
        const locationCollection = collection(db, "locations");
        const unsubscribe = onSnapshot(locationCollection, (orderSnapshot) => {
          const locations = orderSnapshot.docs.map((doc) => ({
            ...doc.data(), // Include document data
          }));
          console.log(locations[0].coordinates);
          setPositions(locations[0].coordinates);
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
      } catch (error) {
        console.error("Error fetching order data: ", error);
      }
    };

    fetchOrderData();
  }, []);

  // Define custom icon
  const customIcon = L.icon({
    iconUrl: locationIcon,
    iconSize: [22, 32], // size of the icon
    iconAnchor: [16, 32], // point of the icon which will correspond to marker's location
    popupAnchor: [0, -32], // point from which the popup should open relative to the iconAnchor
  });
  const boxStyle = {
    cursor: "pointer",
    transition: "background-color 0.2s ease-in-out, color 0.2s ease-in-out",
    width: "100%",
    backgroundColor: "#00000001",
    padding: "15px",
    borderRadius: "10px",
    minHeight: 300,
  };

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

  // Handle map click to set selected location
  const handleMapClick = (e) => {
    setSelectedLocation([e.latlng.lat, e.latlng.lng]);
  };

  // Function to toggle edit mode
  const toggleEditMode = () => {
    setEditMode(!editMode);
  };

  // Function to handle changes in the form fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddress({ ...address, [name]: value });
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        p: { xs: 0, md: 2 },
        background: "#eee",
        borderRadius: 2,
        p: 2,
        mt: 3,
        mx: 1,
        height: 600,
      }}
    >
      <Typography
        gutterBottom
        sx={{ color: "#000", fontSize: 20, mt: 1, fontWeight: 600 }}
      >
        Location Page
      </Typography>
      <Grid container spacing={3} sx={{ cursor: "pointer" }}>
        <Grid item xs={12} sm={6}>
          <Box
            sx={{
              border: "2px solid #ccc",
              padding: "10px",
              borderRadius: 2,
              position: "relative",
            }}
          >
            <Typography variant="h6" gutterBottom>
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
                <Typography>Shop Name: {address.shopName}</Typography>
                <Typography>Phone Number: {address.phoneNumber}</Typography>
                <Typography>Address: {address.address}</Typography>
                <Typography>City: {address.city}</Typography>
                <Typography>State: {address.state}</Typography>
                <Typography>Country: {address.country}</Typography>
              </>
            ) : (
              <>
                <TextField
                  label="Shop Name"
                  name="shopName"
                  value={address.shopName}
                  onChange={handleChange}
                  fullWidth
                  sx={{ mb: 1 }}
                />
                <TextField
                  label="Phone Number"
                  name="phoneNumber"
                  value={address.phoneNumber}
                  onChange={handleChange}
                  fullWidth
                  sx={{ mb: 1 }}
                />
                <TextField
                  label="Address"
                  name="address"
                  value={address.address}
                  onChange={handleChange}
                  fullWidth
                  sx={{ mb: 1 }}
                />
                <TextField
                  label="City"
                  name="city"
                  value={address.city}
                  onChange={handleChange}
                  fullWidth
                  sx={{ mb: 1 }}
                />
                <TextField
                  label="State"
                  name="state"
                  value={address.state}
                  onChange={handleChange}
                  fullWidth
                  sx={{ mb: 1 }}
                />
                <TextField
                  label="Country"
                  name="country"
                  value={address.country}
                  onChange={handleChange}
                  fullWidth
                  sx={{ mb: 1 }}
                />
              </>
            )}
          </Box>
        </Grid>
      </Grid>
      <Typography
        gutterBottom
        sx={{ color: "#000", fontSize: 20, mt: 1, fontWeight: 600 }}
      >
        Location Page
      </Typography>
      <Grid container spacing={3} sx={boxStyle}>
        <Grid item xs={12} sm={6}>
          <Box
            sx={{
              border: "2px solid #ccc",
              padding: "10px",
              borderRadius: 2,
            }}
          >
            <Typography variant="h6" gutterBottom>
              Location Details
            </Typography>
            <Typography>Address: 123 Main St, City, Country</Typography>
            <Typography>Phone: +123 456 7890</Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Box
            sx={{
              border: "2px solid #ccc",
              padding: "10px",
              height: 500,
              borderRadius: 2,
              width: 650,
            }}
          >
            <Typography variant="h6" gutterBottom>
              Map
            </Typography>
            {positions.length && (
              <MapContainer
                center={positions}
                zoom={14}
                style={{ height: "85%", width: "100%" }}
                scrollWheelZoom={true}
                onClick={handleMapClick} // Handle click events on the map
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {selectedLocation && (
                  <Circle
                    center={selectedLocation}
                    radius={50}
                    pathOptions={{ color: "green", fillColor: "green" }}
                  />
                )}
                <Marker position={positions} icon={customIcon} />
              </MapContainer>
            )}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default LocationPage;
