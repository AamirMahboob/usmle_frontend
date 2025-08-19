import React from "react";
import { useParams } from "react-router-dom";

export default function SingleQuizPage() {
  const { quizId } = useParams(); // 👈 extract quizId from URL

  return (
    <div>
      <h2>Single Quiz Page</h2>
      <p>Quiz ID: {quizId}</p>
    </div>
  );
}
