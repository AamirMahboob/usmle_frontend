// // import React, { useEffect, useState } from "react";
// // import { useParams, useNavigate } from "react-router-dom";
// // import {
// //   useGetQuizByIdQuery,
// //   useSubmitQuizMutation,
// //   useAnswerSubmitMutation,
// // } from "../store/quizSlice";
// // import toast from "react-hot-toast";
// // import { Card, Radio, Button, Space, Typography, Spin, Form } from "antd";

// // const { Title, Text } = Typography;

// // export default function TakeQuiz() {
// //   const { quizId } = useParams();
// //   const navigate = useNavigate();
// //   const { data, isLoading, error } = useGetQuizByIdQuery(quizId);
// //   console.log(data,"quizzidd")
// //   const [questionId, setQuestionId] = useState(null);
// //   const [selectedAnswer, setSelectedAnswer] = useState(null);
// //   const [singleResult, setSingleResult] = useState(null);

// //   const [answerSubmit, { isLoading: isAnswerSubmitting }] =
// //     useAnswerSubmitMutation();

// //   const [submitQuiz, { isLoading: isSubmitting }] = useSubmitQuizMutation();

// //   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
// //   const [submissionResult, setSubmissionResult] = useState(null);
// //   const [form] = Form.useForm();

// //   useEffect(() => {
// //     if (data?.success) {
// //       console.log("Quiz loaded:", data.quiz);
// //     }
// //   }, [data]);

// //   if (isLoading)
// //     return <Spin size="large" style={{ display: "block", margin: "auto" }} />;
// //   if (error || !data?.success) return <div>Failed to load quiz.</div>;

// //   // ✅ Quiz data
// //   const quizMeta = data.quiz;
// //   const quiz = quizMeta?.questions || [];
// //   const currentQuestion = quiz[currentQuestionIndex];
// //   const currentId = currentQuestion?._id;

// //   console.log(data.quiz)

// //   // ✅ Validate only current question
// //   const handleNext = async () => {
// //     try {
// //       setSingleResult(null);
// //       await form.validateFields([currentId]); // validate only current
// //       setCurrentQuestionIndex((prev) => prev + 1);
// //     } catch {
// //       toast.warning("Please select an answer.");
// //     }
// //   };

// //   const handleBack = () => {
// //     setSingleResult(null);
// //     if (currentQuestionIndex > 0) {
// //       setCurrentQuestionIndex((prev) => prev - 1);
// //     } else {
// //       navigate("/dashboard/create-quiz");
// //     }
// //   };

// //   const submitSingleResult = async (questionId, selectedAnswer, quizId) => {
// //     try {
// //       const payload = {
// //         questionId,
// //         selectedAnswerId: selectedAnswer,
// //         quizId,
// //       };

// //       const response = await answerSubmit(payload).unwrap();
// //       console.log("Single Result:", response);

// //       if (response?.success) {
// //         setSingleResult(response);
// //       } else {
// //         toast.error("Something went wrong while submitting.");
// //       }
// //     } catch (error) {
// //       console.error("Submit single result failed:", error);
// //       toast.error("Failed to submit answer. Please try again.");
// //     }
// //   };

// //   const handleSubmit = async () => {
// //     setSingleResult(null);
// //     try {
// //       await form.validateFields();
// //       const values = form.getFieldsValue();

// //       const answers = Object.entries(values).map(
// //         ([questionId, selectedAnswer]) => ({
// //           questionId,
// //           selectedAnswer,
// //         })
// //       );

// //       const payload = { quizId, answers };
// //       const response = await submitQuiz(payload).unwrap();
// //       console.log("Submission Result:", response);

// //       if (response?.success) {
// //         setSubmissionResult(response);
// //         toast.success("Quiz submitted successfully!");
// //       } else {
// //         toast.error("Something went wrong during submission.");
// //       }
// //     } catch {
// //       toast.warning("Please answer all questions before submitting.");
// //     }
// //   };

// //   if (submissionResult) {
// //     return (
// //       <Card style={{ maxWidth: 700, margin: "80px auto" }} bordered={false}>
// //         <Title level={3}>✅ Thank you for submitting the quiz!</Title>
// //         <Text>Your responses have been recorded.</Text>
// //         <br />
// //         <br />
// //         <Text strong>Score:</Text> {submissionResult.score} /{" "}
// //         {submissionResult.total}
// //         <br />
// //         <Text strong>Correct Answers:</Text>{" "}
// //         {submissionResult.result?.filter((q) => q.isCorrect).length}
// //         <br />
// //         <Text strong>Total Questions:</Text> {submissionResult.total}
// //         <br />
// //         <br />
// //         {submissionResult.result?.map((res, index) => (
// //           <Card
// //             key={res.question._id}
// //             type="inner"
// //             title={`Q${index + 1}: ${res.question?.question || "No text"}`}
// //             style={{
// //               marginBottom: "1rem",
// //               borderColor: res.isCorrect ? "#52c41a" : "#ff4d4f",
// //             }}
// //           >
// //             {/* Show all options */}
// //             {res.question?.answers?.map((ans) => {
// //               const isSelected =
// //                 ans._id === res.selectedAnswerId ||
// //                 ans.text === res.selectedAnswer;

// //               return (
// //                 <Card
// //                   key={ans._id}
// //                   type="inner"
// //                   style={{
// //                     marginBottom: "0.5rem",
// //                     borderColor: ans.isCorrect ? "#52c41a" : "#ff4d4f",
// //                     backgroundColor: isSelected ? "#fffbe6" : "inherit",
// //                   }}
// //                 >
// //                   <Text
// //                     type={
// //                       ans.isCorrect
// //                         ? "success"
// //                         : isSelected
// //                           ? "danger"
// //                           : undefined
// //                     }
// //                   >
// //                     {ans.text}
// //                   </Text>

// //                   {/* Correct marker */}
// //                   {ans.isCorrect && (
// //                     <p>
// //                       <Text type="success">✅ Correct Answer</Text>
// //                     </p>
// //                   )}

// //                   {/* User's chosen marker */}
// //                   {isSelected && (
// //                     <p>
// //                       <Text strong type="warning">
// //                         👉 Your Choice
// //                       </Text>
// //                     </p>
// //                   )}
// //                 </Card>
// //               );
// //             })}

// //             {/* Reason */}
// //             {res.question?.correctReasonDetails && (
// //               <p style={{ marginTop: "0.5rem" }}>
// //                 <Text strong>Reason:</Text> {res.question.correctReasonDetails}
// //               </p>
// //             )}
// //           </Card>
// //         ))}
// //         <div style={{ textAlign: "center", marginTop: 24 }}>
// //           <Button
// //             type="default"
// //             onClick={() => navigate("/dashboard/create-quiz")}
// //           >
// //             🔙 Back to Quiz List
// //           </Button>
// //         </div>
// //       </Card>
// //     );
// //   }

// //   // ✅ Quiz Taking UI

// //   console.log(quiz,"quizquesr")

// //   return (
// //     <>
// //       <Card
// //         title="Quiz"
// //         bordered={false}
// //         style={{ maxWidth: 700, margin: "0 auto" }}
// //       >
// //         <Text strong>Duration:</Text> {quizMeta.durationMinutes} minutes
// //         <br />
// //         <Text strong>
// //           Question {currentQuestionIndex + 1} of {quiz.length}
// //         </Text>
// //         <Form form={form} layout="vertical">
// //           {quiz.map((q, index) => (
// //             <Form.Item
// //               key={q._id}
// //               name={q._id}
// //               label={
// //                 <Title level={4}>{`Q${index + 1}: ${q.questionText}`}</Title>
// //               }
// //               rules={[{ required: true, message: "Please select an answer." }]}
// //               style={{
// //                 display: index === currentQuestionIndex ? "block" : "none",
// //               }}
// //             >
// //               <Radio.Group>
// //                 <Space direction="vertical">
// //                   {q.answers?.map((answer) => (
// //                     <Radio
// //                       key={answer._id}
// //                       value={answer.text}
// //                       onChange={() => {
// //                         setQuestionId(q._id);
// //                         setSelectedAnswer(answer._id);
// //                       }}
// //                     >
// //                       {answer.text}
// //                     </Radio>
// //                   ))}
// //                 </Space>
// //               </Radio.Group>
// //             </Form.Item>
// //           ))}

// //           <Space>
// //             <Button onClick={handleBack}>
// //               {currentQuestionIndex === 0 ? "Back to Quiz List" : "Back"}
// //             </Button>

// //             {currentQuestionIndex < quiz.length - 1 ? (
// //               <Button type="primary" onClick={handleNext}>
// //                 Next
// //               </Button>
// //             ) : (
// //               <Button
// //                 type="primary"
// //                 loading={isSubmitting}
// //                 onClick={handleSubmit}
// //               >
// //                 Finish Quiz
// //               </Button>
// //             )}
// //             <Button
// //               type="primary"
// //               loading={isAnswerSubmitting}
// //               onClick={() =>
// //                 submitSingleResult(questionId, selectedAnswer, quizId)
// //               }
// //             >
// //               Submit Answer{" "}
// //             </Button>
// //           </Space>
// //         </Form>
// //       </Card>
// //       {singleResult && (
// //         <Card style={{ maxWidth: 700, margin: "80px auto" }} bordered={false}>
// //           <Title level={3}>
// //             {singleResult.result === "Correct" ? "✅ Correct" : "❌ Incorrect"}
// //           </Title>
// //           <Text strong>Reason:</Text> {singleResult.correctReasonDetails}
// //           <br />
// //           <br />
// //           {singleResult.question?.answers?.map((res) => (
// //             <Card
// //               key={res._id}
// //               type="inner"
// //               style={{
// //                 marginBottom: "1rem",
// //                 borderColor: res.isCorrect ? "#52c41a" : "#ff4d4f",
// //               }}
// //               title={res.text}
// //             >
// //               <p>
// //                 <Text type={res.isCorrect ? "success" : "danger"}>
// //                   {res.isCorrect ? "✅ Correct Answer" : "❌ Incorrect Answer"}
// //                 </Text>
// //               </p>
// //               {res._id === singleResult.correctAnswerId && (
// //                 <p>
// //                   <Text strong>✅ This is the correct option</Text>
// //                 </p>
// //               )}
// //             </Card>
// //           ))}
// //         </Card>
// //       )}
// //     </>
// //   );
// // }

// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import {
//   useGetQuizByIdQuery,
//   useSubmitQuizMutation,
//   useAnswerSubmitMutation,
// } from "../store/quizSlice";
// import toast from "react-hot-toast";
// import {
//   Card,
//   Radio,
//   Button,
//   Space,
//   Typography,
//   Spin,
//   Form,
//   Image,
//   Row,
//   Col,
//   Divider,
// } from "antd";

// const { Title, Text } = Typography;

// export default function TakeQuiz() {
//   const { quizId } = useParams();
//   const navigate = useNavigate();
//   const { data, isLoading, error } = useGetQuizByIdQuery(quizId);
//   const [questionId, setQuestionId] = useState(null);
//   const [selectedAnswer, setSelectedAnswer] = useState(null);
//   const [singleResult, setSingleResult] = useState(null);
//   const [answerSubmit, { isLoading: isAnswerSubmitting }] =
//     useAnswerSubmitMutation();
//   const [submitQuiz, { isLoading: isSubmitting }] = useSubmitQuizMutation();
//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//   const [submissionResult, setSubmissionResult] = useState(null);
//   const [form] = Form.useForm();

//   useEffect(() => {
//     if (data?.success) {
//       console.log("Quiz loaded:", data.quiz);
//     }
//   }, [data]);

//   if (isLoading)
//     return <Spin size="large" style={{ display: "block", margin: "auto" }} />;
//   if (error || !data?.success) return <div>Failed to load quiz.</div>;

//   // Quiz data
//   const quizMeta = data.quiz;
//   const quiz = quizMeta?.questions || [];
//   const currentQuestion = quiz[currentQuestionIndex];
//   const currentId = currentQuestion?._id;

//   // Validate only current question
//   const handleNext = async () => {
//     try {
//       setSingleResult(null);
//       await form.validateFields([currentId]);
//       setCurrentQuestionIndex((prev) => prev + 1);
//     } catch {
//       toast.warning("Please select an answer.");
//     }
//   };

//   const handleBack = () => {
//     setSingleResult(null);
//     if (currentQuestionIndex > 0) {
//       setCurrentQuestionIndex((prev) => prev - 1);
//     } else {
//       navigate("/dashboard/create-quiz");
//     }
//   };

//   const submitSingleResult = async (questionId, selectedAnswer, quizId) => {
//     try {
//       const payload = {
//         questionId,
//         selectedAnswerId: selectedAnswer,
//         quizId,
//       };

//       const response = await answerSubmit(payload).unwrap();
//       console.log("Single Result:", response);

//       if (response?.success) {
//         setSingleResult(response);
//       } else {
//         toast.error("Something went wrong while submitting.");
//       }
//     } catch (error) {
//       console.error("Submit single result failed:", error);
//       toast.error("Failed to submit answer. Please try again.");
//     }
//   };

//   const handleSubmit = async () => {
//     setSingleResult(null);
//     try {
//       await form.validateFields();
//       const values = form.getFieldsValue();

//       const answers = Object.entries(values).map(
//         ([questionId, selectedAnswer]) => ({
//           questionId,
//           selectedAnswer,
//         })
//       );

//       const payload = { quizId, answers };
//       const response = await submitQuiz(payload).unwrap();
//       console.log("Submission Result:", response);

//       if (response?.success) {
//         setSubmissionResult(response);
//         toast.success("Quiz submitted successfully!");
//       } else {
//         toast.error("Something went wrong during submission.");
//       }
//     } catch {
//       toast.warning("Please answer all questions before submitting.");
//     }
//   };

//   if (submissionResult) {
//     return (
//       <Card style={{ maxWidth: 800, margin: "80px auto" }} bordered={false}>
//         <Title level={3}>✅ Thank you for submitting the quiz!</Title>
//         <Text>Your responses have been recorded.</Text>
//         <br />
//         <br />
//         <Text strong>Score:</Text> {submissionResult.score} /{" "}
//         {submissionResult.total}
//         <br />
//         <Text strong>Correct Answers:</Text>{" "}
//         {submissionResult.result?.filter((q) => q.isCorrect).length}
//         <br />
//         <Text strong>Total Questions:</Text> {submissionResult.total}
//         <br />
//         <br />
//         {submissionResult.result?.map((res, index) => (
//           <Card
//             key={res.question._id}
//             type="inner"
//             title={`Q${index + 1}: ${res.question?.question || "No text"}`}
//             style={{
//               marginBottom: "1rem",
//               borderColor: res.isCorrect ? "#52c41a" : "#ff4d4f",
//             }}
//           >
//             {/* Display question images if available */}
//             {res.question?.questionImages &&
//               res.question.questionImages.length > 0 && (
//                 <div style={{ marginBottom: 16 }}>
//                   <Image.PreviewGroup>
//                     {res.question.questionImages.map((img, idx) => (
//                       <Image
//                         key={idx}
//                         width={200}
//                         src={`${img.url}`}
//                         alt={`Question image ${idx + 1}`}
//                         style={{
//                           marginRight: 8,
//                           marginBottom: 8,
//                           borderRadius: 4,
//                         }}
//                       />
//                     ))}
//                   </Image.PreviewGroup>
//                 </div>
//               )}

//             {/* Show all options */}
//             {res.question?.answers?.map((ans) => {
//               const isSelected =
//                 ans._id === res.selectedAnswerId ||
//                 ans.text === res.selectedAnswer;

//               return (
//                 <Card
//                   key={ans._id}
//                   type="inner"
//                   style={{
//                     marginBottom: "0.5rem",
//                     borderColor: ans.isCorrect ? "#52c41a" : "#ff4d4f",
//                     backgroundColor: isSelected ? "#fffbe6" : "inherit",
//                   }}
//                 >
//                   <Row gutter={[16, 8]} align="middle">
//                     <Col span={ans.image ? 16 : 24}>
//                       <Text
//                         type={
//                           ans.isCorrect
//                             ? "success"
//                             : isSelected
//                             ? "danger"
//                             : undefined
//                         }
//                       >
//                         {ans.text}
//                       </Text>
//                     </Col>
//                     {ans.image && (
//                       <Col span={8}>
//                         <Image
//                           width={80}
//                           src={`http://localhost:5000${ans.image}`}
//                           alt="Answer image"
//                           style={{ borderRadius: 4 }}
//                         />
//                       </Col>
//                     )}
//                   </Row>

//                   {/* Correct marker */}
//                   {ans.isCorrect && (
//                     <p>
//                       <Text type="success">✅ Correct Answer</Text>
//                     </p>
//                   )}

//                   {/* User's chosen marker */}
//                   {isSelected && !ans.isCorrect && (
//                     <p>
//                       <Text strong type="warning">
//                         👉 Your Choice
//                       </Text>
//                     </p>
//                   )}
//                 </Card>
//               );
//             })}

//             {/* Reason and reason image */}
//             {res.question?.correctReasonDetails && (
//               <div style={{ marginTop: "0.5rem" }}>
//                 <Text strong>Reason:</Text> {res.question.correctReasonDetails}
//               </div>
//             )}

//             {res.question?.correctReasonImage && (
//               <div style={{ marginTop: "0.5rem" }}>
//                 <Image
//                   width={200}
//                   src={`http://localhost:5000${res.question.correctReasonImage}`}
//                   alt="Correct reason image"
//                   style={{ borderRadius: 4 }}
//                 />
//               </div>
//             )}
//           </Card>
//         ))}
//         <div style={{ textAlign: "center", marginTop: 24 }}>
//           <Button
//             type="default"
//             onClick={() => navigate("/dashboard/create-quiz")}
//           >
//             🔙 Back to Quiz List
//           </Button>
//         </div>
//       </Card>
//     );
//   }

//   return (
//     <>
//       <Card
//         title={`Quiz: ${quizMeta.title || "Untitled Quiz"}`}
//         bordered={false}
//         style={{ maxWidth: 800, margin: "0 auto" }}
//         extra={
//           <Text strong>
//             Question {currentQuestionIndex + 1} of {quiz.length}
//           </Text>
//         }
//       >
//         <Text strong>Duration:</Text> {quizMeta.durationMinutes} minutes
//         <br />
//         <Form form={form} layout="vertical">
//           {quiz.map((q, index) => (
//             <Form.Item
//               key={q._id}
//               name={q._id}
//               label={
//                 <div>
//                   <Title level={4}>{`Q${index + 1}: ${q.question}`}</Title>
//                   <Text strong>Question Id:</Text> {q.questionId}
//                   {/* Display question images if available */}
//                   {q.questionImages && q.questionImages.length > 0 && (
//                     <div style={{ marginBottom: 16 }}>
//                       <Image.PreviewGroup>
//                         {q.questionImages.map((img, idx) => (
//                           <Image
//                             key={idx}
//                             width={200}
//                             src={`http://localhost:5000${img}`}
//                             alt={`Question image ${idx + 1}`}
//                             style={{
//                               marginRight: 8,
//                               marginBottom: 8,
//                               borderRadius: 4,
//                             }}
//                           />
//                         ))}
//                       </Image.PreviewGroup>
//                     </div>
//                   )}
//                 </div>
//               }
//               rules={[{ required: true, message: "Please select an answer." }]}
//               style={{
//                 display: index === currentQuestionIndex ? "block" : "none",
//               }}
//             >
//               <Radio.Group>
//                 <Space direction="vertical" style={{ width: "100%" }}>
//                   {q.answers?.map((answer) => (
//                     <Radio
//                       key={answer._id}
//                       value={answer._id}
//                       onChange={() => {
//                         console.log(answer._id, ":answer._id", q._id, ":q._id");
//                         setQuestionId(q._id);
//                         setSelectedAnswer(answer._id);
//                       }}
//                     >
//                       <Row gutter={16} align="middle">
//                         <Col>{answer.text}</Col>
//                         {answer.image && (
//                           <Col>
//                             <Image
//                               width={100}
//                               src={`http://localhost:5000${answer.image}`}
//                               alt="Answer image"
//                               style={{ borderRadius: 4 }}
//                             />
//                           </Col>
//                         )}
//                       </Row>
//                     </Radio>
//                   ))}
//                 </Space>
//               </Radio.Group>
//             </Form.Item>
//           ))}

//           <Divider />

//           <Space>
//             <Button onClick={handleBack}>
//               {currentQuestionIndex === 0 ? "Back to Quiz List" : "Back"}
//             </Button>

//             {currentQuestionIndex < quiz.length - 1 ? (
//               <Button type="primary" onClick={handleNext}>
//                 Next
//               </Button>
//             ) : (
//               <Button
//                 type="primary"
//                 loading={isSubmitting}
//                 onClick={handleSubmit}
//               >
//                 Finish Quiz
//               </Button>
//             )}
//             <Button
//               type="default"
//               loading={isAnswerSubmitting}
//               onClick={() => {
//                 if (questionId && selectedAnswer) {
//                   submitSingleResult(questionId, selectedAnswer, quizId);
//                 } else {
//                   toast.error("Please select an answer.");
//                 }
//               }}
//             >
//               Submit Answer
//             </Button>
//           </Space>
//         </Form>
//       </Card>

//       {singleResult && (
//         <Card style={{ maxWidth: 800, margin: "20px auto" }} bordered={false}>
//           <Title level={3}>
//             {singleResult.result === "Correct" ? "✅ Correct" : "❌ Incorrect"}
//           </Title>

//           {singleResult.correctReasonDetails && (
//             <>
//               <Text strong>Reason:</Text> {singleResult.correctReasonDetails}
//               <br />
//             </>
//           )}

//           {singleResult.correctReasonImage && (
//             <div style={{ marginTop: 16, marginBottom: 16 }}>
//               <Image
//                 width={200}
//                 src={`http://localhost:5000${singleResult.correctReasonImage}`}
//                 alt="Correct reason image"
//                 style={{ borderRadius: 4 }}
//               />
//             </div>
//           )}

//           <br />

//           {singleResult.question?.answers?.map((res) => (
//             <Card
//               key={res._id}
//               type="inner"
//               style={{
//                 marginBottom: "1rem",
//                 borderColor: res.isCorrect ? "#52c41a" : "#ff4d4f",
//               }}
//               title={
//                 <Row gutter={16} align="middle">
//                   <Col>{res.text}</Col>
//                   {res.image && (
//                     <Col>
//                       <Image
//                         width={80}
//                         src={`${res.image.url}`}
//                         alt="Answer image"
//                         style={{ borderRadius: 4 }}
//                       />
//                     </Col>
//                   )}
//                 </Row>
//               }
//             >
//               <p>
//                 {res.isCorrect}
//                 <Text type={res.isCorrect ? "success" : "danger"}>
//                   {res.isCorrect ? "✅ Correct Answer" : "❌ Incorrect Answer"}
//                 </Text>
//               </p>
//               {res._id === singleResult.correctAnswerId && (
//                 <p>
//                   <Text strong>✅ This is the correct option</Text>
//                 </p>
//               )}
//             </Card>
//           ))}
//         </Card>
//       )}
//     </>
//   );
// }

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  useGetQuizByIdQuery,
  useSubmitQuizMutation,
  useAnswerSubmitMutation,
} from "../store/quizSlice";
import toast from "react-hot-toast";
import {
  Card,
  Radio,
  Button,
  Space,
  Typography,
  Spin,
  Form,
  Image,
  Row,
  Col,
  Divider,
} from "antd";

const { Title, Text } = Typography;

export default function TakeQuiz() {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, error } = useGetQuizByIdQuery(quizId);
  const [questionId, setQuestionId] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [singleResult, setSingleResult] = useState(null);
  const [answerSubmit, { isLoading: isAnswerSubmitting }] =
    useAnswerSubmitMutation();
  const [submitQuiz, { isLoading: isSubmitting }] = useSubmitQuizMutation();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [submissionResult, setSubmissionResult] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    if (data?.success) {
      console.log("Quiz loaded:", data.quiz);
    }
  }, [data]);

  if (isLoading)
    return <Spin size="large" style={{ display: "block", margin: "auto" }} />;
  if (error || !data?.success) return <div>Failed to load quiz.</div>;

  // Quiz data
  const quizMeta = data.quiz;
  const quiz = quizMeta?.questions || [];
  const currentQuestion = quiz[currentQuestionIndex];
  const currentId = currentQuestion?._id;

  // Validate only current question
  const handleNext = async () => {
    try {
      setSingleResult(null);
      await form.validateFields([currentId]);
      setCurrentQuestionIndex((prev) => prev + 1);
    } catch {
      toast.warning("Please select an answer.");
    }
  };

  const handleBack = () => {
    setSingleResult(null);
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    } else {
      navigate("/dashboard/create-quiz");
    }
  };

  const submitSingleResult = async (questionId, selectedAnswer, quizId) => {
    try {
      const payload = {
        questionId,
        selectedAnswerId: selectedAnswer,
        quizId,
      };

      const response = await answerSubmit(payload).unwrap();
      console.log("Single Result:", response);

      if (response?.success) {
        setSingleResult(response);
      } else {
        toast.error("Something went wrong while submitting.");
      }
    } catch (error) {
      console.error("Submit single result failed:", error);
      toast.error("Failed to submit answer. Please try again.");
    }
  };

  const handleSubmit = async () => {
    setSingleResult(null);
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
      console.log("Submission Result:", response);

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
      <Card style={{ maxWidth: 800, margin: "80px auto" }} bordered={false}>
        <Title level={3}>✅ Thank you for submitting the quiz!</Title>
        <Text>Your responses have been recorded.</Text>
        <br />
        <br />
        <Text strong>Score:</Text> {submissionResult.score} /{" "}
        {submissionResult.total}
        <br />
        <Text strong>Correct Answers:</Text>{" "}
        {submissionResult.result?.filter((q) => q.isCorrect).length}
        <br />
        <Text strong>Total Questions:</Text> {submissionResult.total}
        <br />
        <br />
        {submissionResult.result?.map((res, index) => (
          <Card
            key={res.question._id}
            type="inner"
            title={`Q${index + 1}: ${res.question?.question || "No text"}`}
            style={{
              marginBottom: "1rem",
              borderColor: res.isCorrect ? "#52c41a" : "#ff4d4f",
            }}
          >
            {/* Display question images */}
            {res.question?.questionImages &&
              res.question.questionImages.length > 0 && (
                <div style={{ marginBottom: 16 }}>
                  <Image.PreviewGroup>
                    {res.question.questionImages.map((img, idx) => (
                      <Image
                        key={idx}
                        width={200}
                        src={img.url}
                        alt={`Question image ${idx + 1}`}
                        style={{
                          marginRight: 8,
                          marginBottom: 8,
                          borderRadius: 4,
                        }}
                      />
                    ))}
                  </Image.PreviewGroup>
                </div>
              )}

            {/* Show all options */}
            {res.question?.answers?.map((ans) => {
              const isSelected =
                ans._id === res.selectedAnswerId ||
                ans.text === res.selectedAnswer;

              return (
                <Card
                  key={ans._id}
                  type="inner"
                  style={{
                    marginBottom: "0.5rem",
                    borderColor: ans.isCorrect ? "#52c41a" : "#ff4d4f",
                    backgroundColor: isSelected ? "#fffbe6" : "inherit",
                  }}
                >
                  <Row gutter={[16, 8]} align="middle">
                    <Col span={ans.image ? 16 : 24}>
                      <Text
                        type={
                          ans.isCorrect
                            ? "success"
                            : isSelected
                            ? "danger"
                            : undefined
                        }
                      >
                        {ans.text}
                      </Text>
                    </Col>
                  </Row>

                  {ans.isCorrect && (
                    <p>
                      <Text type="success">✅ Correct Answer</Text>
                    </p>
                  )}

                  {isSelected && !ans.isCorrect && (
                    <p>
                      <Text strong type="warning">
                        👉 Your Choice
                      </Text>
                    </p>
                  )}
                </Card>
              );
            })}

            {/* Reason and reason image */}
            {res.question?.correctReasonDetails && (
              <div style={{ marginTop: "0.5rem" }}>
                <Text strong>Reason:</Text> {res.question.correctReasonDetails}
              </div>
            )}

            {Array.isArray(res.question?.correctReasonImage) &&
              res.question.correctReasonImage.length > 0 && (
                <div style={{ marginTop: "0.5rem" }}>
                  {res.question.correctReasonImage.map((img, index) => (
                    <Image
                      key={index}
                      width={200}
                      src={img.url}
                      alt={`Correct reason image ${index + 1}`}
                      style={{ borderRadius: 4, marginBottom: "0.5rem" }}
                    />
                  ))}
                </div>
              )}
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
    <>
      <Card
        title={`Quiz: ${quizMeta.title || "Untitled Quiz"}`}
        bordered={false}
        style={{ maxWidth: 800, margin: "0 auto" }}
        extra={
          <Text strong>
            Question {currentQuestionIndex + 1} of {quiz.length}
          </Text>
        }
      >
        <Text strong>Duration:</Text> {quizMeta.durationMinutes} minutes
        <br />
        <Form form={form} layout="vertical">
          {quiz.map((q, index) => (
            <Form.Item
              key={q._id}
              name={q._id}
              label={
                <div>
                  <Title level={4}>{`Q${index + 1}: ${q.question}`}</Title>
                  <Text strong>Question Id:</Text> {q.questionId}
                  {/* Display question images */}
                  {q.questionImages && q.questionImages.length > 0 && (
                    <div style={{ marginBottom: 16 }}>
                      <Image.PreviewGroup>
                        {q.questionImages.map((img, idx) => (
                          <Image
                            key={idx}
                            width={200}
                            src={img.url}
                            alt={`Question image ${idx + 1}`}
                            style={{
                              marginRight: 8,
                              marginBottom: 8,
                              borderRadius: 4,
                            }}
                          />
                        ))}
                      </Image.PreviewGroup>
                    </div>
                  )}
                </div>
              }
              rules={[{ required: true, message: "Please select an answer." }]}
              style={{
                display: index === currentQuestionIndex ? "block" : "none",
              }}
            >
              <Radio.Group>
                <Space direction="vertical" style={{ width: "100%" }}>
                  {q.answers?.map((answer) => (
                    <Radio
                      key={answer._id}
                      value={answer._id}
                      onChange={() => {
                        setQuestionId(q._id);
                        setSelectedAnswer(answer._id);
                      }}
                    >
                      <Row gutter={16} align="middle">
                        <Col>{answer.text}</Col>
                        {answer.image?.url && (
                          <Col>
                            <Image
                              width={100}
                              src={answer.image.url}
                              alt="Answer image"
                              style={{ borderRadius: 4 }}
                            />
                          </Col>
                        )}
                      </Row>
                    </Radio>
                  ))}
                </Space>
              </Radio.Group>
            </Form.Item>
          ))}

          <Divider />

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
                Finish Quiz
              </Button>
            )}
            <Button
              type="default"
              loading={isAnswerSubmitting}
              onClick={() => {
                if (questionId && selectedAnswer) {
                  submitSingleResult(questionId, selectedAnswer, quizId);
                } else {
                  toast.error("Please select an answer.");
                }
              }}
            >
              Submit Answer
            </Button>
          </Space>
        </Form>
      </Card>

      {singleResult && (
        <Card style={{ maxWidth: 800, margin: "20px auto" }} bordered={false}>
          <Title level={3}>
            {singleResult.result === "Correct" ? "✅ Correct" : "❌ Incorrect"}
          </Title>

          {singleResult.correctReasonDetails && (
            <>
              <Text strong>Reason:</Text> {singleResult.correctReasonDetails}
              <br />
            </>
          )}

          {singleResult.correctReasonImage?.url && (
            <div style={{ marginTop: 16, marginBottom: 16 }}>
              <Image
                width={200}
                src={singleResult.correctReasonImage.url}
                alt="Correct reason image"
                style={{ borderRadius: 4 }}
              />
            </div>
          )}

          <br />

          {singleResult.question?.answers?.map((res) => (
            <Card
              key={res._id}
              type="inner"
              style={{
                marginBottom: "1rem",
                borderColor: res.isCorrect ? "#52c41a" : "#ff4d4f",
              }}
              title={
                <Row gutter={16} align="middle">
                  <Col>{res.text}</Col>
                  {res.image?.url && (
                    <Col>
                      <Image
                        width={80}
                        src={res.image.url}
                        alt="Answer image"
                        style={{ borderRadius: 4 }}
                      />
                    </Col>
                  )}
                </Row>
              }
            >
              <p>
                <Text type={res.isCorrect ? "success" : "danger"}>
                  {res.isCorrect ? "✅ Correct Answer" : "❌ Incorrect Answer"}
                </Text>
              </p>
              {res._id === singleResult.correctAnswerId && (
                <p>
                  <Text strong>✅ This is the correct option</Text>
                </p>
              )}
            </Card>
          ))}
        </Card>
      )}
    </>
  );
}
