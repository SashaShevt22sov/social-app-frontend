import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import type { PendingUser } from "../types/friends";
import type { NotificationResponseDto } from "../types/notification";
import type { FriendsList } from "../types/friends";

export const notificationApi = createApi({
  reducerPath: "notificationApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8080/api",
    credentials: "include",
  }),
  tagTypes: ["Notifications", "FriendsList", "PendingFriends"],
  endpoints: (builder) => ({
    /* Получения все не прочитанных уведомлений */
    getNotification: builder.query<NotificationResponseDto[], void>({
      query: () => "/notification/get-allNotification",
      providesTags: ["Notifications"],
    }),
    /* Удаление всех уведомлений */
    deleteAllNotification: builder.mutation<void, void>({
      query: () => ({
        url: "/notification/delete-all",
        method: "DELETE",
      }),
      invalidatesTags: ["Notifications", "PendingFriends"],
    }),
    /* Удаление точного уведомления */
    deleteNotification: builder.mutation<void, number>({
      query: (notificationId) => ({
        url: `/notification/${notificationId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Notifications", "PendingFriends"],
    }),
    /* Заявка в друзья принять  */
    acceptFriend: builder.mutation<void, number>({
      query: (notificationId) => ({
        url: `/notification/${notificationId}/accept`,
        method: "POST",
      }),
      invalidatesTags: ["Notifications", "FriendsList", "PendingFriends"],
    }),
    /* Заявка в друзья отклонить  */
    rejectFriend: builder.mutation<void, number>({
      query: (notificationId) => ({
        url: `/notification/${notificationId}/reject`,
        method: "POST",
      }),
      invalidatesTags: ["Notifications", "PendingFriends"],
    }),
    /* Список отправленных заявок  */
    getFriendsPending: builder.query<PendingUser[], void>({
      query: () => "/friends/get-pending-friends",
      providesTags: ["PendingFriends"],
    }),
    /* Отмена отправленной зяявки */
    cancelPendingFriends: builder.mutation<void, number>({
      query: (userId) => ({
        url: `/friends/cancel-pending/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["PendingFriends"],
    }),
    /*Получить список друзей */
    getFriends: builder.query<FriendsList[], void>({
      query: () => "/friends/getAllListFriends",
      providesTags: ["FriendsList"],
    }),
  }),
});

export const {
  useGetNotificationQuery,
  useAcceptFriendMutation,
  useRejectFriendMutation,
  useGetFriendsQuery,
  useCancelPendingFriendsMutation,
  useGetFriendsPendingQuery,
  useDeleteNotificationMutation,
  useDeleteAllNotificationMutation,
} = notificationApi;
