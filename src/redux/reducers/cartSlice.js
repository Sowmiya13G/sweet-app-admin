import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cart: [],
  },
  reducers: {
    addCartItem: (state, action) => {
      const { item, quantity } = action.payload;
      const existingItemIndex = state.cart.findIndex(
        (cartItem) => cartItem?.dishName === item?.dishName
      );

      if (existingItemIndex !== -1) {
        state.cart[existingItemIndex].quantity += quantity;
      } else {
        state.cart.push({ ...item, quantity });
      }
    },

    removeCartItem: (state, action) => {
      const { item, quantity } = action.payload;
      const existingItemIndex = state.cart.findIndex(
        (cartItem) => cartItem?.dishName === item?.dishName
      );

      if (existingItemIndex !== -1) {
        if (state.cart[existingItemIndex].quantity === 1) {
          state.cart.splice(existingItemIndex, 1);
        } else {
          state.cart[existingItemIndex].quantity -= quantity;
        }
      }
    },
    deleteCartItem: (state, action) => {
      const item = action.payload;
      console.log(item);
      const filterCart = state.cart.filter((x) => x.dishName !== item.dishName);
      state.cart = filterCart;
    },
    clearCart: (state) => {
      state.cart = [];
    },
  },
});

export const { addCartItem, removeCartItem, clearCart, deleteCartItem } =
  cartSlice.actions;
export default cartSlice.reducer;
