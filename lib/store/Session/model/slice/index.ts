import {InternalHandlersProfileResponse} from "@/api/client/api";
import {PayloadAction, createSlice} from "@reduxjs/toolkit";

import {SessionSchema} from "../types";

const initialState: SessionSchema = {
  session: undefined,
  isAuthenticated: false,
};

export const sessionSlice = createSlice({
  name: "session",
  initialState,
  reducers: {
    setSession: (state, action: PayloadAction<InternalHandlersProfileResponse>) => {
      state.session = action.payload;
      state.isAuthenticated = typeof action.payload.user_id !== "undefined";
    },
    clearSession: (state) => {
      state.session = undefined;
      state.isAuthenticated = false;
    },
  },
});

export const {setSession, clearSession} = sessionSlice.actions;
export const sessionReducer = sessionSlice.reducer;
