import { createSlice } from "@reduxjs/toolkit";

const initialAuthState = {
  isLoggedIn: false,
  name: "",
};

const authSlice = createSlice({
  name: "auth",
  initialState: initialAuthState,
  reducers: {
    login(state, action) {
      state.isLoggedIn = true;
      state.name = action.payload.name
    },
    logout(state) {},
  },
});
export const authActions = authSlice.actions;
export default authSlice.reducer;
