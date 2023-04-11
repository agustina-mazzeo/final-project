import { createSlice } from "@reduxjs/toolkit";
import { Account } from "../utils/types";

const initialAccounts: Account[] = [];

const accountsSlice = createSlice({
  name: "accounts",
  initialState: initialAccounts,
  reducers: {
    addAccounts(state, action) {
      return action.payload.accounts
    },
    removeAccounts(state) {
      return initialAccounts
    },
  },
});
export const accountsActions = accountsSlice.actions;
export default accountsSlice.reducer;
