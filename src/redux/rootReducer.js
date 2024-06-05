import { combineReducers } from '@reduxjs/toolkit';
import cartSlice from './reducers/cartSlice';
import orderSlice from "./reducers/ordersSlice"
import authSlice from './reducers/authSlice';
const rootReducer = combineReducers({
  auth:authSlice,
  cart: cartSlice,
  order:orderSlice

});

export default rootReducer;
