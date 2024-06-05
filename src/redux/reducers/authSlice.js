import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    deviceID: 0,
    locationMatch: false,
  },
  reducers: {
    updateDeviceID: (state, action) => {
      state.deviceID = action.payload;
    },
    updateLocationMatch: (state, action) => {
      state.locationMatch = action.payload;
    },
  },
});

export const { updateDeviceID, updateLocationMatch } = authSlice.actions;
export default authSlice.reducer;
