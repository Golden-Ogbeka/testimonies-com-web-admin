import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AdminProfile, AdminToken } from "../../types/auth";
import {
  removeSessionDetails,
  removeTokenDetails,
  storeSessionDetails,
  storeTokenDetails,
} from "../../functions/userSession";

interface AdminState {
  profile: AdminProfile | null;
  token: AdminToken | null;
}

const initialState: AdminState = {
  profile: null,
  token: null,
};

export const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    updateAdmin(state, action: PayloadAction<{ profile: AdminProfile }>) {
      state.profile = action.payload.profile;
      storeSessionDetails(action.payload.profile);
    },
    updateToken(state, action: PayloadAction<{ token: AdminToken }>) {
      state.token = action.payload.token;
      storeTokenDetails(action.payload.token);
    },
    signOut(state) {
      state.profile = null;
      state.token = null;
      removeSessionDetails();
      removeTokenDetails();
    },
  },
});

export const { updateAdmin, updateToken, signOut } = adminSlice.actions;

