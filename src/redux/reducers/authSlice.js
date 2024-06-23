import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    deviceID: 0,
    locationMatch: false,
    isuperAdmin: false,
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
  },
});

export const { updateDeviceID, updateLocationMatch, updateSuperAdmin } =
  authSlice.actions;
export default authSlice.reducer;
