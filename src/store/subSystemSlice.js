"use client";

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";

const Base_url = import.meta.env.VITE_BASE_URL;

export const subSystemApi = createApi({
  reducerPath: "subSystemApi",
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
  tagTypes: ["subSystem"],
  endpoints: (builder) => ({
    addSubSystem: builder.mutation({
      query: (data) => ({
        url: "subSystem",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["subSystem"],
    }),
    getSubSystem: builder.query({
      query: () => ({
        url: "subSystem",
        method: "GET",
      }),
      providesTags: ["subSystem"],
    }),
    editSubSystem: builder.mutation({
      query: (subSystemData) => ({
        url: `subSystem/${subSystemData?.id}`,
        method: "PUT",
        body: subSystemData,
      }),

      invalidatesTags: ["subSystem"],
    }),

    deleteSubSystem: builder.mutation({
      query: (subSystemId) => ({
        url: `subSystem/${subSystemId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["subSystem"],
    }),
    getSubsystemBySystemId: builder.mutation({
      query: (systemId) => ({
        url: `subSystem/by-system/${systemId}`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useAddSubSystemMutation,
  useGetSubSystemQuery,
  useEditSubSystemMutation,
  useDeleteSubSystemMutation,
  useGetSubsystemBySystemIdMutation,
} = subSystemApi;
