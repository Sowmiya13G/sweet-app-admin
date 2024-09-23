import React, { useEffect, useState } from "react";

// MUI components
import { Box } from "@mui/material";
import { TextInput } from "../../components/input";
import ButtonComponent from "../../components/button";
import { ENDPOINTS } from "../../apiServices/endPoints";
import apiClient from "../../apiServices/apiClient";

const Banner = () => {
  // Local states
  const [bannerData, setBannerData] = useState({
    image: null,
    redirect: "",
  });
  const [bannerList, setBannerList] = useState([]);
  // Use effects (if needed)
  useEffect(() => {}, []);

  // Component styles
  const scrollHorbarStyles = {
    overflowY: "auto",
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

  // Function to handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBannerData((prev) => ({ ...prev, [name]: value }));
  };

  // Function to handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBannerData((prev) => ({ ...prev, image: file }));
    }
  };

  const handleAdd = () => {
    if (bannerData.redirect && bannerData.image) {
      const newBanner = {
        redirect: bannerData.redirect,
        image: URL.createObjectURL(bannerData.image),
      };
      setBannerList((prev) => [...prev, newBanner]);
      setBannerData({
        image: null,
        redirect: "",
      });
    } else {
      console.error("Please fill in all required fields.");
    }
  };
  // Function to handle form submission
  const handleSubmit = async () => {
    try {
      const payload = {
        image: bannerList.map((item) => ({
          url: item.image,
          redirection: item.redirect,
        })),
      };
      console.log(payload);
      const response = await apiClient.post(ENDPOINTS.carousel, payload);
      console.log(response);

      setBannerList([]);
    } catch (error) {
      console.error("Error adding carousel item:", error);
    }
  };

  // Render upload view
  const uploadView = () => {
    return (
      <Box
        sx={{
          width: { xs: "100%", md: "35%" },
          height: { xs: 450, md: 550 },
          mr: 1,
          p: 2,
          backgroundColor: "#fff",
          borderRadius: 2,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <TextInput
          label="Banner Redirection"
          name="redirect"
          value={bannerData.redirect}
          onChange={handleInputChange}
          err={bannerData.redirect ? "" : "Redirection is required"}
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          style={{ marginBottom: "16px" }}
        />
        <ButtonComponent onClick={handleAdd}>Add</ButtonComponent>
        <ButtonComponent onClick={handleSubmit}>Submit</ButtonComponent>
      </Box>
    );
  };

  // Render carousel view
  const carouselView = () => {
    return (
      <Box
        sx={{
          width: { xs: "100%", md: "65%" },
          height: 550,
          backgroundColor: "#ffffff",
          ...scrollHorbarStyles,
          borderRadius: 2,
        }}
      >
        {/* Carousel content goes here */}
      </Box>
    );
  };

  return (
    <Box
      sx={{
        display: { xs: "block", md: "block" },
        width: "100%",
        m: 2,
      }}
    >
      <Box
        sx={{
          display: { xs: "block", md: "flex" },
          width: "100%",
        }}
      >
        {uploadView()}
        {carouselView()}
      </Box>
    </Box>
  );
};

export default Banner;
