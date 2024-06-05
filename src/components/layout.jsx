// src/components/Layout.js
import React from 'react';
import { Box, CssBaseline, Toolbar } from '@mui/material';
import Sidebar from './sideBar';

const Layout = ({ children }) => {
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 3, }}>
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
};

export default Layout;
