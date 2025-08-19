"use client";

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";

const Base_url = import.meta.env.VITE_BASE_URL;

export const quizApi = createApi({
  reducerPath: "quizApi",
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
  tagTypes: ["Quiz"],
  endpoints: (builder) => ({
    // Fetch quizzes
    getQuizzes: builder.query({
      query: () => "quiz", // Adjust path if needed
      providesTags: ["Quiz"],
    }),

    // Create a quiz
    createQuiz: builder.mutation({
      query: (data) => ({
        url: "quiz", // Adjust ID if dynamic
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Quiz"],
    }),
    getQuizById: builder.query({
      query: (id) => `quiz/${id}`,
      providesTags: ["Quiz"],
    }),
    submitQuiz: builder.mutation({
      query: ({ quizId, ...data }) => ({
        url: `quiz/submit/${quizId}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Quiz"],
    }),
    answerSubmit: builder.mutation({
      query: ({ questionId, selectedAnswerId, quizId }) => ({
        url: `quiz/${quizId}/answer`,
        method: "POST",
        body: {
          selectedAnswerId,
          questionId,
        },
      }),
    }),
  }),
});

// ✅ Export hooks for use in components
export const {
  useGetQuizzesQuery,
  useCreateQuizMutation,
  useGetQuizByIdQuery,
  useSubmitQuizMutation,
  useAnswerSubmitMutation,
} = quizApi;
