// src/store/index.js
import { createStore } from 'redux';

const initialState = {
  isAuthenticated: true,
};

function reducer(state = initialState, action) {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, isAuthenticated: true };
    case 'LOGOUT':
      return { ...state, isAuthenticated: false };
    default:
      return state;
  }
}

const store = createStore(reducer);

export default store;
