import { createBrowserRouter, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import DashboardLayout from "../layouts/DashboardLayout";
import User from "../pages/User";
import AddQuestion from "../pages/AddQuestion";
import AddSubject from "../pages/AddSubject";
import CreateQuiz from "../pages/CreateQuiz";
import TakeQuiz from "../pages/TakeQuiz";
import AddSystem from "../pages/AddSystem";
import AdvanceQuiz from "../pages/AdvanceQuiz";
import SingleQuizPage from "../pages/SingleQuizPage";

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
        path: "add-system",
        element: <AddSystem />,
      },

      {
        path: "quiz/:quizId", // ✅ now correct
        element: <TakeQuiz />,
      },
      {
        path: "advance-quiz",
        element: <AdvanceQuiz />,
      },
      // {
      //   path: "single-quiz/:quizId",
      //   element: <SingleQuizPage />,
      // },
    ],
  },
]);
