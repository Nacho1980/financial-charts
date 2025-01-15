import { configureStore } from "@reduxjs/toolkit";
import companiesReducer from "../reducers/companiesSlice";

const store = configureStore({
  reducer: {
    companies: companiesReducer,
  },
});

// Infer RootState and AppDispatch types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
