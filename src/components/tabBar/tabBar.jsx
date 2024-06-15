import React from "react";
import { Box, Paper, Typography } from "@mui/material";

const TabBar = ({ tabs, selectedTab, setSelectedTab, fontSize }) => {
  const tabContainer = {
    display: "flex",
    width: "100%",
    backgroundColor: "#c0c0c0c0",
    padding: 1,
    gap: 2,
    borderRadius: 2,
    minHeight: 50,
  };

  const tabStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "50%",
    borderRadius: 2,
    cursor: "pointer",
    transition:
      "transform 0.3s ease, background-color 0.3s ease, color 0.3s ease",
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
            backgroundColor: selectedTab === item.tbName ? "#3c3c4e" : "#fff",
            color: selectedTab === item.tbName ? "#fff" : "#3c3c4e",
            overflow: "hidden",
            textOverflow: "ellipsis",
            px: 1,
          }}
          onClick={() => handleTabSelect(item.tbName)}
        >
          <Typography
            sx={{
              fontWeight: 600,
              fontSize,
              textOverflow: "ellipsis",
              overflow: "hidden",
            }}
          >
            {item.tbName}
          </Typography>
        </Paper>
      ))}
    </Box>
  );
};

export default TabBar;
