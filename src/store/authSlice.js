import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const Base_url = import.meta.env.VITE_BASE_URL;

console.log(Base_url, "Base_Url");

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${Base_url}`,
    prepareHeaders: (headers) => {
      headers.set("Content-Type", "application/json");

      return headers;
    },
  }),
  endpoints(builder) {
    return {
      login: builder.mutation({
        query: (userData) => ({
          url: `auth/login`,
          method: "POST",

          body: { email: userData.email, password: userData.password },
        }),
      }),
    };
  },
});

export const { useLoginMutation } = authApi;
