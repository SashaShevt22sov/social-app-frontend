import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";

import api from "../interceptor/api";

import type { sendRequsetFriend, sendResponseFriend } from "../types/friends";
import type { User } from "../types/types";

interface FriendState {
  error: Record<string, string> | null;
  loading: boolean;
  message: sendResponseFriend | null;
  success: string | null;
}

const initialState: FriendState = {
  error: null,
  loading: false,
  message: null,
  success: null,
};

export const sendFriendRequest = createAsyncThunk<
  sendResponseFriend,
  sendRequsetFriend,
  { rejectValue: Record<string, string> }
>("friends/send", async (username, { rejectWithValue }) => {
  try {
    const response = await api.post("/friends/send", username);
    return response.data.message;
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.errors || "Ошибка отправки в друзья"
    );
  }
});

const friendSlice = createSlice({
  name: "frineds",
  initialState,
  reducers: {
    clearSuccess: (state) => {
      state.success = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendFriendRequest.pending, (state) => {
        state.error = null;
        state.loading = true;
        state.success = null;
      })
      .addCase(sendFriendRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload;
        state.success = "Заявка в друзья отправленна";
      })
      .addCase(sendFriendRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? { general: "Неизвестная ошибка " };
      });
  },
});
export const { clearSuccess, clearError } = friendSlice.actions;
export default friendSlice.reducer;
