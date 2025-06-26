import { createBrowserRouter, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import DashboardLayout from "../layouts/DashboardLayout";
import User from "../pages/User";
import AddQuestion from "../pages/AddQuestion";
import AddSubject from "../pages/AddSubject";
import CreateQuiz from "../pages/CreateQuiz";
import TakeQuiz from "../pages/TakeQuiz";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/dashboard",
    element: <DashboardLayout />,
    children: [
      {
        index: true,
        element: <User />,
      },
      {
        path: "add-subject",
        element: <AddSubject />,
      },
      {
        path: "add-question",
        element: <AddQuestion />,
      },
      {
        path: "create-quiz",
        element: <CreateQuiz />,
      },

      {
        path: "quiz/:quizId", // ✅ now correct
        element: <TakeQuiz />,
      },
    ],
  },
]);
