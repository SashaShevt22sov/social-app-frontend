import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";

import api from "../interceptor/api";

import type {
  CreateServerRequest,
  CreateServerResponse,
  ServerList,
} from "./../types/server";

interface ServerState {
  servers: ServerList[];
  error: Record<string, string> | null;
  loading: boolean;
}

const initialState: ServerState = {
  servers: [],
  loading: false,
  error: null,
};

export const createServer = createAsyncThunk<
  CreateServerResponse,
  CreateServerRequest,
  { rejectValue: Record<string, string> }
>("server/createServer", async (data, { rejectWithValue }) => {
  try {
    const response = await api.post<CreateServerResponse>(
      "/server/create",
      data
    );

    return response.data;
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || "Ошибка создания сервера"
    );
  }
});

export const serverSlice = createSlice({
  name: "server",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createServer.pending, (state) => {
        state.error = null;
        state.loading = true;
      })

      .addCase(createServer.fulfilled, (state, action) => {
        state.error = null;
        state.loading = false;
        state.servers.push({
          id: action.payload.id,
          serverName: action.payload.serverName,
        });
      })
      .addCase(createServer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? { general: "Ошибка создания сервера" };
      });
  },
});
export default serverSlice.reducer;
