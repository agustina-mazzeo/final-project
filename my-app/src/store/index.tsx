import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./auth";
import accSlice from "./accounts";
const store = configureStore({
  reducer: { auth: authSlice, myAccounts:accSlice },
});
export type RootState = ReturnType<typeof store.getState>
export default store;
