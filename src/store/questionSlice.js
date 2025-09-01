"use client";

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";

const Base_url = import.meta.env.VITE_BASE_URL;

export const questionApi = createApi({
  reducerPath: "questionApi",
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
  tagTypes: ["Question"],
  endpoints: (builder) => ({
    getQuestions: builder.query({
      query: () => "questions",
      providesTags: ["Question"],
    }),
    createQuestion: builder.mutation({
      query: (data) => ({
        url: "questions",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Question"],
    }),
    editQuestion: builder.mutation({
      query: ({ formData, id }) => ({
        url: `questions/${id}`,
        method: "PUT",
        body: formData,
      }),

      invalidatesTags: ["Question"],
    }),
    deleteQuestion: builder.mutation({
      query: (_id) => ({
        url: `questions/${_id}`,
        method: "DELETE",
      }),

      invalidatesTags: ["Question"],
    }),
    // You can add more endpoints here
  }),
});

export const {
  useGetQuestionsQuery,
  useDeleteQuestionMutation,
  useCreateQuestionMutation,
  useEditQuestionMutation,
} = questionApi;
