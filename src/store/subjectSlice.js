"use client";

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";

const Base_url = import.meta.env.VITE_BASE_URL;

export const subjectApi = createApi({
  reducerPath: "subjectApi",
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
  tagTypes: ["Subject"],
  endpoints: (builder) => ({
    getSubjects: builder.query({
      query: () => "subjects",
      providesTags: ["Subject"],
    }),
    addSubject: builder.mutation({
      query: (data) => ({
        url: "subjects",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Subject"],
    }),
    editSubject: builder.mutation({
      query: (subjectData) => ({
        url: `subjects/${subjectData?._id}`,
        method: "PUT",
        body: subjectData,
      }),

      invalidatesTags: ["Subject"],
    }),
    deleteSubject: builder.mutation({
      query: (_id) => ({
        url: `subjects/${_id}`,
        method: "DELETE",
      }),

      invalidatesTags: ["Subject"],
    }),
    addSubjectBySubject: builder.mutation({
      query: (data) => ({
        url: "questions/by-subjects",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Subject"],
    }),
    // You can add more endpoints here
  }),
});

export const {
  useAddSubjectMutation,
  useGetSubjectsQuery,
  useEditSubjectMutation,

  useDeleteSubjectMutation,
  useAddSubjectBySubjectMutation,
  // export other hooks as needed
} = subjectApi;
