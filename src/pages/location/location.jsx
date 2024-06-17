import React, { useEffect, useState } from "react";
import { Box, Typography, Grid } from "@mui/material";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import L from "leaflet"; // Import Leaflet library
import "leaflet/dist/leaflet.css"; // Ensure Leaflet's CSS is imported for proper styling
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import locationIcon from "../../assets/images/location.png";

const LocationPage = () => {
  const [currentPosition, setCurrentPosition] = useState(null);
  const [positions, setPositions] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);

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

  // Handle map click to set selected location
  const handleMapClick = (e) => {
    setSelectedLocation([e.latlng.lat, e.latlng.lng]);
  };

  return (
    <Box sx={{ padding: "20px" }}>
      <Typography variant="h4" gutterBottom>
        Location Page
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <Box sx={{ border: "1px solid #ccc", padding: "10px" }}>
            <Typography variant="h6" gutterBottom>
              Location Details
            </Typography>
            <Typography>Address: 123 Main St, City, Country</Typography>
            <Typography>Phone: +123 456 7890</Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Box sx={{ border: "1px solid #ccc", padding: "10px" }}>
            <Typography variant="h6" gutterBottom>
              Map
            </Typography>
            {positions.length && (
              <MapContainer
                center={positions}
                zoom={14}
                style={{ height: "300px", width: "100%" }}
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
