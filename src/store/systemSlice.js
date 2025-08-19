"use client";

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";

const Base_url = import.meta.env.VITE_BASE_URL;

export const systemApi = createApi({
  reducerPath: "systemApi",
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
  tagTypes: ["System"],
  endpoints: (builder) => ({
    addSystem: builder.mutation({
      query: (data) => ({
        url: "system",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["System"],
    }),
    getSystem: builder.query({
      query: () => ({
        url: "system",
        method: "GET",
      }),
    }),
    editSystem: builder.mutation({
      query: (systemData) => ({
        url: `system/${systemData?.id}`,
        method: "PUT",
        body: systemData,
      }),

      invalidatesTags: ["System"],
    }),

    deleteSystem: builder.mutation({
      query: (systemId) => ({
        url: `system/${systemId}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useAddSystemMutation,
  useGetSystemQuery,
  useEditSystemMutation,
  useDeleteSystemMutation,
} = systemApi;
