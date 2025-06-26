import { configureStore } from "@reduxjs/toolkit";
import { userApi } from "./userApiSlice";
import { authApi } from "./authSlice"; // Assuming this is RTK Query slice, not normal slice
import { subjectApi } from "./subjectSlice";
import { questionApi } from "./questionSlice";
import { quizApi } from "./quizSlice";

export const store = configureStore({
  reducer: {
    [userApi.reducerPath]: userApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [subjectApi.reducerPath]: subjectApi.reducer,
    [questionApi.reducerPath]: questionApi.reducer,
    [quizApi.reducerPath]: quizApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(userApi.middleware)
      .concat(authApi.middleware)
      .concat(questionApi.middleware)
      .concat(subjectApi.middleware)
      .concat(quizApi.middleware),
});
