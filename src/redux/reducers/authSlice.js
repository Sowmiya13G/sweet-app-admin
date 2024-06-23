import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    deviceID: 0,
    locationMatch: false,
    isuperAdmin: false,
    hotelID: null,
    hotelData: null,
  },
  reducers: {
    updateDeviceID: (state, action) => {
      state.deviceID = action.payload;
    },
    updateLocationMatch: (state, action) => {
      state.locationMatch = action.payload;
    },
    updateSuperAdmin: (state, action) => {
      state.isuperAdmin = action.payload;
    },
    updateHotelID: (state, action) => {
      state.hotelID = action.payload;
    },
    updateHotelData: (state, action) => {
      state.hotelData = action.payload;
    },
  },
});

export const {
  updateDeviceID,
  updateHotelID,
  updateLocationMatch,
  updateSuperAdmin,
  updateHotelData,
} = authSlice.actions;
export default authSlice.reducer;
