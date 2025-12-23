import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import serverReducer from "./serverSlice";
import friendsReducer from "./friendsSlice";

import { notificationApi } from "./notificationApi";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    server: serverReducer,
    friends: friendsReducer,

    [notificationApi.reducerPath]: notificationApi.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(notificationApi.middleware),
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
