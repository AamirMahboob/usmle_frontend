"use client";

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";

const Base_url = import.meta.env.VITE_BASE_URL;

console.log(Base_url, "Base_Url");

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${Base_url}`,
    prepareHeaders: (headers) => {
      const token = Cookies.get("usmle_token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["User"],
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: () => "users",
      providesTags: ["User"],
    }),
    addUser: builder.mutation({
      query: (user) => ({
        url: "auth/register",
        method: "POST",
        body: user,
      }),
      invalidatesTags: ["User"],
    }),
    editUser: builder.mutation({
      query: (userData) => ({
        url: `/users/${userData?._id}`,
        method: "PUT",
        body: userData,
      }),

      invalidatesTags: ["User"],
    }),
    deleteUser: builder.mutation({
      query: (_id) => ({
        url: `users/${_id}`,
        method: "DELETE",
      }),

      invalidatesTags: ["User"],
    }),
    // You can add more endpoints here
  }),
});

export const {
  useAddUserMutation,
  useGetUsersQuery,
  useEditUserMutation,
  useDeleteUserMutation,
  // export other hooks as needed
} = userApi;
