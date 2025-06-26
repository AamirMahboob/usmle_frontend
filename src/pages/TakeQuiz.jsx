import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetQuizByIdQuery, useSubmitQuizMutation } from "../store/quizSlice";
import toast from "react-hot-toast";
import { Card, Radio, Button, Space, Typography, Spin, Form } from "antd";

const { Title, Text } = Typography;

export default function TakeQuiz() {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, error } = useGetQuizByIdQuery(quizId);
  const [submitQuiz, { isLoading: isSubmitting }] = useSubmitQuizMutation();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [submissionResult, setSubmissionResult] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    if (data?.success) {
      console.log("Quiz loaded:", data);
    }
  }, [data]);

  if (isLoading)
    return <Spin size="large" style={{ display: "block", margin: "auto" }} />;
  if (error || !data || !data.success) return <div>Failed to load quiz.</div>;

  const quiz = data.questions || [];
  const currentQuestion = quiz[currentQuestionIndex];
  const currentId = currentQuestion._id;

  const handleNext = async () => {
    try {
      await form.validateFields([currentId]);
      setCurrentQuestionIndex((prev) => prev + 1);
    } catch {
      toast.warning("Please select an answer.");
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    } else {
      navigate("/dashboard/create-quiz");
    }
  };

  const handleSubmit = async () => {
    try {
      await form.validateFields();
      const values = form.getFieldsValue();
      const answers = Object.entries(values).map(
        ([questionId, selectedAnswer]) => ({
          questionId,
          selectedAnswer,
        })
      );

      const payload = { quizId, answers };
      const response = await submitQuiz(payload).unwrap();

      if (response?.success) {
        setSubmissionResult(response);
        toast.success("Quiz submitted successfully!");
      } else {
        toast.error("Something went wrong during submission.");
      }
    } catch {
      toast.warning("Please answer all questions before submitting.");
    }
  };

  if (submissionResult) {
    return (
      <Card style={{ maxWidth: 700, margin: "80px auto" }} bordered={false}>
        <Title level={3}>✅ Thank you for submitting the quiz!</Title>
        <Text>Your responses have been recorded.</Text>
        <br />
        <br />
        <Text strong>Score:</Text> {submissionResult.score} /{" "}
        {submissionResult.total}
        <br />
        <Text strong>Correct Answers:</Text>{" "}
        {submissionResult.result.filter((q) => q.isCorrect).length}
        <br />
        <Text strong>Total Questions:</Text> {submissionResult.total}
        <br />
        <br />
        {submissionResult.result.map((res, index) => (
          <Card
            key={res.question._id}
            type="inner"
            title={`Q${index + 1}: ${res.question.question}`}
            style={{
              marginBottom: "1rem",
              borderColor: res.isCorrect ? "#52c41a" : "#ff4d4f",
            }}
          >
            <p>
              <Text strong>Your Answer:</Text>{" "}
              {res.selectedAnswer || "Not Answered"}
            </p>
            <p>
              <Text type={res.isCorrect ? "success" : "danger"}>
                {res.isCorrect ? "✅ Correct" : "❌ Incorrect"}
              </Text>
            </p>
          </Card>
        ))}
        <div style={{ textAlign: "center", marginTop: 24 }}>
          <Button
            type="default"
            onClick={() => navigate("/dashboard/create-quiz")}
          >
            🔙 Back to Quiz List
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card
      title={`Quiz - ${data?.subjects?.[0]?.subject || "Untitled"}`}
      bordered={false}
      style={{ maxWidth: 700, margin: "0 auto" }}
    >
      <Text strong>Duration:</Text> {data.durationMinutes} minutes
      <br />
      <Text strong>
        Question {currentQuestionIndex + 1} of {quiz.length}
      </Text>
      <Form form={form} layout="vertical">
        <Form.Item
          name={currentId}
          label={<Title level={4}>{currentQuestion.question}</Title>}
          rules={[{ required: true, message: "Please select an answer." }]}
        >
          <Radio.Group>
            <Space direction="vertical">
              {currentQuestion.answers.map((answer) => (
                <Radio key={answer._id} value={answer.text}>
                  {answer.text}
                </Radio>
              ))}
            </Space>
          </Radio.Group>
        </Form.Item>

        <Space>
          <Button onClick={handleBack}>
            {currentQuestionIndex === 0 ? "Back to Quiz List" : "Back"}
          </Button>

          {currentQuestionIndex < quiz.length - 1 ? (
            <Button type="primary" onClick={handleNext}>
              Next
            </Button>
          ) : (
            <Button
              type="primary"
              loading={isSubmitting}
              onClick={handleSubmit}
            >
              Submit Quiz
            </Button>
          )}
        </Space>
      </Form>
    </Card>
  );
}
