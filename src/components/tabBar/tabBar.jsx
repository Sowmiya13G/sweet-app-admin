import React from "react";
import { Box, Paper, Typography } from "@mui/material";

const TabBar = ({ tabs, selectedTab, setSelectedTab }) => {
  const tabContainer = {
    display: "flex",
    width: "100%",
    backgroundColor: "#ffffff",
    padding: 1,
    gap: 2,
    borderRadius: 2,
    height: 60,
  };

  const tabStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "50%",
    borderRadius: 3,
    cursor: "pointer",
    transition: "transform 0.3s ease, background-color 0.3s ease, color 0.3s ease",
  };

  const handleTabSelect = (id) => {
    setSelectedTab(id);
  };

  return (
    <Box sx={tabContainer}>
      {tabs.map((item) => (
        <Paper
          key={item.id}
          sx={{
            ...tabStyle,
            backgroundColor: selectedTab === item.id ? "#3c3c4e" : "#c0c0c0c0",
            color: selectedTab === item.id ? "#fff" : "#3c3c4e",
          }}
          onClick={() => handleTabSelect(item.id)}
        >
          <Typography sx={{ fontWeight: 600 }}>{item.tbName}</Typography>
        </Paper>
      ))}
    </Box>
  );
};

export default TabBar;
