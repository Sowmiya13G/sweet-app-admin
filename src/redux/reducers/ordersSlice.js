import { createSlice } from "@reduxjs/toolkit";

const orderSlice = createSlice({
  name: "order",
  initialState: {
    order: [],
    orderLength: 0,
  },
  reducers: {
    updateOrder: (state, action) => {
      state.order.push({ ...action.payload });
    },
    updateOrderLength: (state, action) => {
      state.orderLength = action.payload;
    },
  },
});

export const { updateOrder, updateOrderLength } = orderSlice.actions;
export default orderSlice.reducer;
