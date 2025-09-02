// import React, { useState, useEffect } from "react";
// import {
//     Form,
//     Input,
//     Button,
//     Select,
//     Space,
//     Modal,
//     Checkbox,
//     Spin,
//     Upload,
//     Image,
//     Row,
//     Col,
// } from "antd";
// import {
//     QuestionCircleOutlined,
//     PlusOutlined,
//     DeleteOutlined,
//     EyeOutlined,
// } from "@ant-design/icons";
// import toast from "react-hot-toast";
// import { useGetSystemQuery } from "../store/systemSlice";
// import { useCreateQuestionMutation, useEditQuestionMutation } from "../store/questionSlice";
// import { useGetSubjectsQuery } from "../store/subjectSlice";

// // import { useGetSubjectsQuery } from "../../store/subjectSlice";
// // import { useGetSystemQuery } from "../../store/systemSlice";
// // import {
// //     useCreateQuestionMutation,
// //     useEditQuestionMutation,
// // } from "../../store/questionSlice";

// const CreateQuetions = ({ openModal, setOpenModal, currentQuestion }) => {
//     const [form] = Form.useForm();
//     const [correctAnswers, setCorrectAnswers] = useState([]);
//     const [questionType, setQuestionType] = useState("MCQ");
//     const [subjectId, setSubjectId] = useState(null);
//     const [systemId, setSystemId] = useState(null);
//     const [previewImage, setPreviewImage] = useState(null);
//     const [previewVisible, setPreviewVisible] = useState(false);
//     const [previewTitle, setPreviewTitle] = useState("");

//     // Queries
//     const { data: subjectRes, isLoading: isSubjectLoading } =
//         useGetSubjectsQuery();
//     const { data: systemRes, isLoading: isSystemLoading } = useGetSystemQuery();

//     const [addQuestionApi, { isLoading: isAddQuestionLoading }] =
//         useCreateQuestionMutation();
//     const [editQuestionApi, { isLoading: isEditQuestionLoading }] =
//         useEditQuestionMutation();

//     const [modifySubjectArray, setModifiedSubjectArray] = useState([]);
//     const [modifySystemArray, setModifiedSystemArray] = useState([]);

//     // Handle Subjects
//     useEffect(() => {
//         if (subjectRes?.success && Array.isArray(subjectRes.data)) {
//             setModifiedSubjectArray(
//                 subjectRes.data.map((item) => ({
//                     label: item.subject,
//                     value: item._id,
//                 }))
//             );
//         } else {
//             setModifiedSubjectArray([]);
//         }
//     }, [subjectRes]);

//     // Handle Systems
//     useEffect(() => {
//         if (systemRes?.success && Array.isArray(systemRes?.data)) {
//             setModifiedSystemArray(
//                 systemRes.data.map((item) => ({
//                     label: item.system_name,
//                     value: item._id,
//                 }))
//             );
//         } else {
//             setModifiedSystemArray([]);
//         }
//     }, [systemRes]);

//     // Load currentQuestion for edit
//     useEffect(() => {
//         if (currentQuestion) {
//             const {
//                 subject,
//                 system,
//                 question,
//                 questionType,
//                 answers,
//                 correctReasonDetails,
//                 questionImages,
//                 answerImages,
//                 correctReasonImage,
//             } = currentQuestion;

//             form.setFieldsValue({
//                 subject: subject?._id,
//                 system: system?._id,
//                 question,
//                 questionType,
//                 answers: answers.map((a) => a.text),
//                 correctReasonDetails,
//                 // For file lists in edit mode
//                 questionImages: questionImages?.map((img, index) => ({
//                     uid: `question-${index}`,
//                     name: `question-image-${index}.png`,
//                     status: "done",
//                     url: img,
//                 })),
//                 answerImages: answerImages?.map((img, index) => ({
//                     uid: `answer-${index}`,
//                     name: `answer-image-${index}.png`,
//                     status: "done",
//                     url: img,
//                 })),
//                 correctReasonImage: correctReasonImage
//                     ? [
//                         {
//                             uid: "correct-reason",
//                             name: "correct-reason-image.png",
//                             status: "done",
//                             url: correctReasonImage,
//                         },
//                     ]
//                     : [],
//             });

//             setSubjectId(subject?._id);
//             setSystemId(system?._id);
//             setQuestionType(questionType);
//             setCorrectAnswers(
//                 answers.reduce((acc, ans, idx) => {
//                     if (ans.isCorrect) acc.push(idx);
//                     return acc;
//                 }, [])
//             );
//         } else {
//             // Reset for new
//             form.resetFields();
//             setQuestionType("MCQ");
//             setCorrectAnswers([]);
//         }
//     }, [currentQuestion, form]);

//     const createQuestion = async (payload) => {
//         try {
//             const response = await addQuestionApi(payload);
//             if (response.data.success) {
//                 setOpenModal(false);
//                 form.resetFields();
//                 setCorrectAnswers([]);
//                 setQuestionType("MCQ");
//                 toast.success("Question Added Successfully");
//             } else {
//                 toast.error(response?.data?.message || "Failed to add question");
//             }
//         } catch (error) {
//             toast.error("Something went wrong");
//         }
//     };

//     const editQuestion = async (payload) => {
//         try {
//             const response = await editQuestionApi(payload);
//             if (response.data.success) {
//                 setOpenModal(false);
//                 toast.success("Question Updated Successfully");
//             } else {
//                 toast.error(response?.data?.message || "Failed to update question");
//             }
//         } catch (error) {
//             toast.error("Something went wrong");
//         }
//     };

//     const onFinish = (values) => {
//         if (
//             (questionType === "MCQ" || questionType === "trueFalse") &&
//             correctAnswers.length === 0
//         ) {
//             toast.error("Please select at least one correct answer.");
//             return;
//         }

//         const formData = new FormData();
//         formData.append("subject", subjectId);
//         formData.append("system", systemId);
//         formData.append("question", values.question);
//         formData.append("questionType", questionType);
//         formData.append(
//             "answers",
//             JSON.stringify(
//                 (values.answers || []).map((text, index) => ({
//                     text,
//                     isCorrect: correctAnswers.includes(index),
//                 }))
//             )
//         );
//         formData.append("correctReasonDetails", values.correctReasonDetails);

//         // Handle file uploads - only new files
//         if (values.questionImages) {
//             values.questionImages.forEach((file) => {
//                 if (file.originFileObj) {
//                     formData.append("questionImages", file.originFileObj);
//                 }
//             });
//         }

//         if (values.answerImages) {
//             values.answerImages.forEach((file) => {
//                 if (file.originFileObj) {
//                     formData.append("answerImages", file.originFileObj);
//                 }
//             });
//         }

//         if (values.correctReasonImage && values.correctReasonImage.length > 0) {
//             values.correctReasonImage.forEach((file) => {
//                 if (file.originFileObj) {
//                     formData.append("correctReasonImage", file.originFileObj);
//                 }
//             });
//         }

//         if (currentQuestion?._id) {
//             // For edit, include the ID and existing image URLs
//             formData.append("_id", currentQuestion._id);

//             if (currentQuestion.questionImages) {
//                 formData.append(
//                     "existingQuestionImages",
//                     JSON.stringify(currentQuestion.questionImages)
//                 );
//             }

//             if (currentQuestion.answerImages) {
//                 formData.append(
//                     "existingAnswerImages",
//                     JSON.stringify(currentQuestion.answerImages)
//                 );
//             }

//             if (currentQuestion.correctReasonImage) {
//                 formData.append(
//                     "existingCorrectReasonImage",
//                     currentQuestion.correctReasonImage
//                 );
//             }

//             editQuestion(formData);
//         } else {
//             createQuestion(formData);
//         }
//     };

//     const handleCheckboxChange = (checked, index) => {
//         if (checked) {
//             setCorrectAnswers([...correctAnswers, index]);
//         } else {
//             setCorrectAnswers(correctAnswers.filter((i) => i !== index));
//         }
//     };

//     const handlePreview = async (file) => {
//         if (!file.url && !file.preview) {
//             file.preview = URL.createObjectURL(file.originFileObj);
//         }

//         setPreviewImage(file.url || file.preview);
//         setPreviewVisible(true);
//         setPreviewTitle(
//             file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
//         );
//     };

//     // Custom upload button
//     const uploadButton = (
//         <div>
//             <PlusOutlined />
//             <div style={{ marginTop: 8 }}>Upload</div>
//         </div>
//     );

//     return (
//         // <Modal
//         //     open={openModal}
//         //     maskClosable={false}
//         //     onCancel={() => setOpenModal(false)}
//         //     footer={null}
//         //     width={800}
//         //     style={
//         //         {
//         //             height: "800px",
//         //             overflowY: "scroll"
//         //         }
//         //     }
//         //     height={600}
//         //     title={
//         //         <span className="flex items-center gap-2">
//         //             <QuestionCircleOutlined />
//         //             {currentQuestion ? "Update Question" : "Add Question"}
//         //         </span>
//         //     }
//         // >
//         //     <Spin spinning={isSubjectLoading || isSystemLoading}>
//                 <Form
//                     form={form}
//                     onFinish={onFinish}
//                     layout="vertical"
//                     initialValues={{ questionType: "MCQ", answers: [""] }}
//                 >
//                     {/* Subject */}
//                     <Form.Item
//                         name="subject"
//                         label="Subject"
//                         rules={[{ required: true, message: "Please select a subject" }]}
//                     >
//                         <Select
//                             placeholder="Select Subject"
//                             options={modifySubjectArray}
//                             onChange={(val) => setSubjectId(val)}
//                         />
//                     </Form.Item>

//                     {/* System */}
//                     <Form.Item
//                         name="system"
//                         label="System"
//                         rules={[{ required: true, message: "Please select a system" }]}
//                     >
//                         <Select
//                             placeholder="Select System"
//                             options={modifySystemArray}
//                             onChange={(val) => setSystemId(val)}
//                         />
//                     </Form.Item>

//                     {/* Question Type */}
//                     <Form.Item
//                         name="questionType"
//                         label="Question Type"
//                         rules={[
//                             { required: true, message: "Please select a question type" },
//                         ]}
//                     >
//                         <Select
//                             value={questionType}
//                             onChange={(val) => setQuestionType(val)}
//                             disabled={!!currentQuestion?._id}
//                         >
//                             <Select.Option value="MCQ">
//                                 MCQ (Single/Multiple Correct)
//                             </Select.Option>
//                             <Select.Option value="trueFalse">True/False</Select.Option>
//                             <Select.Option value="shortAnswer">Short Answer</Select.Option>
//                         </Select>
//                     </Form.Item>

//                     {/* Question */}
//                     <Form.Item
//                         name="question"
//                         label="Question"
//                         rules={[{ required: true, message: "Question is required" }]}
//                     >
//                         <Input.TextArea placeholder="Enter your question" rows={3} />
//                     </Form.Item>

//                     {/* Answers - Dynamic List */}
//                     <Form.Item label="Answers">
//                         <Form.List name="answers">
//                             {(fields, { add, remove }) => (
//                                 <>
//                                     {fields.map(({ key, name, ...restField }, index) => (
//                                         <Row
//                                             key={key}
//                                             gutter={8}
//                                             align="middle"
//                                             style={{ marginBottom: 8 }}
//                                         >
//                                             <Col flex="auto">
//                                                 <Form.Item
//                                                     {...restField}
//                                                     name={name}
//                                                     rules={[
//                                                         {
//                                                             required: true,
//                                                             message: "Answer text is required",
//                                                         },
//                                                     ]}
//                                                     style={{ marginBottom: 0 }}
//                                                 >
//                                                     <Input placeholder={`Option ${index + 1}`} />
//                                                 </Form.Item>
//                                             </Col>
//                                             <Col>
//                                                 <Checkbox
//                                                     checked={correctAnswers.includes(index)}
//                                                     onChange={(e) =>
//                                                         handleCheckboxChange(e.target.checked, index)
//                                                     }
//                                                 >
//                                                     Correct
//                                                 </Checkbox>
//                                             </Col>
//                                             <Col>
//                                                 {fields.length > 1 && (
//                                                     <Button
//                                                         type="text"
//                                                         danger
//                                                         icon={<DeleteOutlined />}
//                                                         onClick={() => remove(name)}
//                                                     />
//                                                 )}
//                                             </Col>
//                                         </Row>
//                                     ))}
//                                     <Form.Item>
//                                         <Button
//                                             type="dashed"
//                                             onClick={() => add()}
//                                             block
//                                             icon={<PlusOutlined />}
//                                         >
//                                             Add Answer
//                                         </Button>
//                                     </Form.Item>
//                                 </>
//                             )}
//                         </Form.List>
//                     </Form.Item>

//                     {/* Correct Reason */}
//                     <Form.Item
//                         name="correctReasonDetails"
//                         label="Correct Reason Details"
//                         rules={[
//                             {
//                                 required: true,
//                                 message: "Please provide the reason for the correct answer",
//                             },
//                         ]}
//                     >
//                         <Input.TextArea
//                             placeholder="Enter explanation for the correct answer"
//                             rows={3}
//                         />
//                     </Form.Item>

//                     {/* Question Images */}
//                     <Form.Item
//                         name="questionImages"
//                         label="Question Images"
//                         valuePropName="fileList"
//                         getValueFromEvent={(e) => {
//                             if (Array.isArray(e)) {
//                                 return e;
//                             }
//                             return e && e.fileList;
//                         }}
//                     >
//                         <Upload
//                             listType="picture-card"
//                             beforeUpload={() => false}
//                             multiple
//                             onPreview={handlePreview}
//                         >
//                             {uploadButton}
//                         </Upload>
//                     </Form.Item>

//                     {/* Answer Images */}
//                     <Form.Item
//                         name="answerImages"
//                         label="Answer Images"
//                         valuePropName="fileList"
//                         getValueFromEvent={(e) => {
//                             if (Array.isArray(e)) {
//                                 return e;
//                             }
//                             return e && e.fileList;
//                         }}
//                     >
//                         <Upload
//                             listType="picture-card"
//                             beforeUpload={() => false}
//                             multiple
//                             onPreview={handlePreview}
//                         >
//                             {uploadButton}
//                         </Upload>
//                     </Form.Item>

//                     {/* Correct Reason Image */}
//                     <Form.Item
//                         name="correctReasonImage"
//                         label="Correct Reason Image"
//                         valuePropName="fileList"
//                         getValueFromEvent={(e) => {
//                             if (Array.isArray(e)) {
//                                 return e;
//                             }
//                             return e && e.fileList;
//                         }}
//                     >
//                         <Upload
//                             listType="picture-card"
//                             beforeUpload={() => false}
//                             onPreview={handlePreview}
//                         >
//                             {uploadButton}
//                         </Upload>
//                     </Form.Item>

//                     {/* Image Preview Modal */}
//                     <Modal
//                         open={previewVisible}
//                         title={previewTitle}
//                         footer={null}
//                         onCancel={() => setPreviewVisible(false)}
//                     >
//                         <img alt="preview" style={{ width: "100%" }} src={previewImage} />
//                     </Modal>

//                     {/* Actions */}
//                     <Form.Item>
//                         <div className="flex justify-end gap-2">
//                             <Button onClick={() => setOpenModal(false)}>Cancel</Button>
//                             <Button
//                                 type="primary"
//                                 htmlType="submit"
//                                 loading={isAddQuestionLoading || isEditQuestionLoading}
//                             >
//                                 {currentQuestion ? "Update" : "Create"}
//                             </Button>
//                         </div>
//                     </Form.Item>
//                 </Form>
//             // </Spin>
//         // </Modal>
//     );
// };

// export default CreateQuetions;

import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Select,
  Checkbox,
  Spin,
  Upload,
  Modal,
  Row,
  Col,
} from "antd";
import {
  QuestionCircleOutlined,
  PlusOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import toast from "react-hot-toast";
import { useParams, useNavigate } from "react-router-dom";
import { useGetSystemQuery } from "../store/systemSlice";
import {
  useCreateQuestionMutation,
  useEditQuestionMutation,
  useGetQuestionsQuery,
} from "../store/questionSlice";
import { useGetSubjectsQuery } from "../store/subjectSlice";

const CreateQuestions = () => {
  const [form] = Form.useForm();
  const { id } = useParams(); // check if edit
  const navigate = useNavigate();

  const [correctAnswers, setCorrectAnswers] = useState([]);
  const [questionType, setQuestionType] = useState("MCQ");
  const [subjectId, setSubjectId] = useState(null);
  const [systemId, setSystemId] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewTitle, setPreviewTitle] = useState("");

  // Queries
  const { data: subjectRes, isLoading: isSubjectLoading } =
    useGetSubjectsQuery();
  const { data: systemRes, isLoading: isSystemLoading } = useGetSystemQuery();
  const { data: allQuestions } = useGetQuestionsQuery();

  const [addQuestionApi, { isLoading: isAddQuestionLoading }] =
    useCreateQuestionMutation();
  const [editQuestionApi, { isLoading: isEditQuestionLoading }] =
    useEditQuestionMutation();

  const [modifySubjectArray, setModifiedSubjectArray] = useState([]);
  const [modifySystemArray, setModifiedSystemArray] = useState([]);

  const currentQuestion = id
    ? allQuestions?.data?.find((q) => q._id === id)
    : null;

  // Handle Subjects
  useEffect(() => {
    if (subjectRes?.success && Array.isArray(subjectRes.data)) {
      setModifiedSubjectArray(
        subjectRes.data.map((item) => ({
          label: item.subject,
          value: item._id,
        }))
      );
    } else {
      setModifiedSubjectArray([]);
    }
  }, [subjectRes]);

  // Handle Systems
  useEffect(() => {
    if (systemRes?.success && Array.isArray(systemRes?.data)) {
      setModifiedSystemArray(
        systemRes.data.map((item) => ({
          label: item.system_name,
          value: item._id,
        }))
      );
    } else {
      setModifiedSystemArray([]);
    }
  }, [systemRes]);

  // Load currentQuestion for edit
  useEffect(() => {
    if (currentQuestion) {
      const {
        subject,
        system,
        question,
        questionType,
        answers,
        correctReasonDetails,
        questionImages,
        answerImages,
        correctReasonImage,
      } = currentQuestion;

      form.setFieldsValue({
        subject: subject?._id,
        system: system?._id,
        question,
        questionType,
        answers: answers.map((a) => a.text),
        correctReasonDetails,
        questionImages: questionImages?.map((img, index) => ({
          uid: `question-${index}`,
          name: `question-image-${index}.png`,
          status: "done",
          url: img,
        })),
        answerImages: answerImages?.map((img, index) => ({
          uid: `answer-${index}`,
          name: `answer-image-${index}.png`,
          status: "done",
          url: img,
        })),
        correctReasonImage: correctReasonImage
          ? [
              {
                uid: "correct-reason",
                name: "correct-reason-image.png",
                status: "done",
                url: correctReasonImage,
              },
            ]
          : [],
      });

      setSubjectId(subject?._id);
      setSystemId(system?._id);
      setQuestionType(questionType);
      setCorrectAnswers(
        answers.reduce((acc, ans, idx) => {
          if (ans.isCorrect) acc.push(idx);
          return acc;
        }, [])
      );
    } else {
      form.resetFields();
      setQuestionType("MCQ");
      setCorrectAnswers([]);
    }
  }, [currentQuestion, form]);

  const onFinish = async (values) => {
    if (
      (questionType === "MCQ" || questionType === "trueFalse") &&
      correctAnswers.length === 0
    ) {
      toast.error("Please select at least one correct answer.");
      return;
    }

    const formData = new FormData();
    formData.append("subject", subjectId);
    formData.append("system", systemId);
    formData.append("question", values.question);
    formData.append("questionType", questionType);
    formData.append(
      "answers",
      JSON.stringify(
        (values.answers || []).map((text, index) => ({
          text,
          isCorrect: correctAnswers.includes(index),
        }))
      )
    );
    formData.append("correctReasonDetails", values.correctReasonDetails);

    // Handle uploads
    if (values.questionImages) {
      values.questionImages.forEach((file) => {
        if (file.originFileObj) {
          formData.append("questionImages", file.originFileObj);
        }
      });
    }

    if (values.answerImages) {
      values.answerImages.forEach((file) => {
        if (file.originFileObj) {
          formData.append("answerImages", file.originFileObj);
        }
      });
    }

    if (values.correctReasonImage && values.correctReasonImage.length > 0) {
      values.correctReasonImage.forEach((file) => {
        if (file.originFileObj) {
          formData.append("correctReasonImage", file.originFileObj);
        }
      });
    }

    if (id) {
      formData.append("_id", id);

      if (currentQuestion?.questionImages) {
        formData.append(
          "existingQuestionImages",
          JSON.stringify(currentQuestion.questionImages)
        );
      }

      if (currentQuestion?.answerImages) {
        formData.append(
          "existingAnswerImages",
          JSON.stringify(currentQuestion.answerImages)
        );
      }

      if (currentQuestion?.correctReasonImage) {
        formData.append(
          "existingCorrectReasonImage",
          currentQuestion.correctReasonImage
        );
      }

      const res = await editQuestionApi(formData);
      if (res?.data?.success) {
        toast.success("Question Updated Successfully");
        navigate("/dashboard/questions");
      } else {
        toast.error(res?.data?.message || "Failed to update question");
      }
    } else {
      const res = await addQuestionApi(formData);
      if (res?.data?.success) {
        toast.success("Question Added Successfully");
        navigate("/dashboard/questions");
      } else {
        toast.error(res?.data?.message || "Failed to add question");
      }
    }
  };

  const handleCheckboxChange = (checked, index) => {
    if (checked) {
      setCorrectAnswers([...correctAnswers, index]);
    } else {
      setCorrectAnswers(correctAnswers.filter((i) => i !== index));
    }
  };

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = URL.createObjectURL(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewVisible(true);
    setPreviewTitle(
      file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
    );
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  return (
    <Spin
      spinning={
        isSubjectLoading ||
        isSystemLoading ||
        isAddQuestionLoading ||
        isEditQuestionLoading
      }
    >
      <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
        <QuestionCircleOutlined />
        {id ? "Update Question" : "Create Question"}
      </h2>
      <Form
        form={form}
        onFinish={onFinish}
        layout="vertical"
        initialValues={{ questionType: "MCQ", answers: [""] }}
      >
        {/* Subject */}
        <Form.Item
          name="subject"
          label="Subject"
          rules={[{ required: true, message: "Please select a subject" }]}
        >
          <Select
            placeholder="Select Subject"
            options={modifySubjectArray}
            onChange={(val) => setSubjectId(val)}
          />
        </Form.Item>

        {/* System */}
        <Form.Item
          name="system"
          label="System"
          rules={[{ required: true, message: "Please select a system" }]}
        >
          <Select
            placeholder="Select System"
            options={modifySystemArray}
            onChange={(val) => setSystemId(val)}
          />
        </Form.Item>

        {/* Question Type */}
        <Form.Item
          name="questionType"
          label="Question Type"
          rules={[{ required: true, message: "Please select a question type" }]}
        >
          <Select
            value={questionType}
            onChange={(val) => setQuestionType(val)}
            disabled={!!id}
          >
            <Select.Option value="MCQ">
              MCQ (Single/Multiple Correct)
            </Select.Option>
            <Select.Option value="trueFalse">True/False</Select.Option>
            <Select.Option value="shortAnswer">Short Answer</Select.Option>
          </Select>
        </Form.Item>

        {/* Question */}
        <Form.Item
          name="question"
          label="Question"
          rules={[{ required: true, message: "Question is required" }]}
        >
          <Input.TextArea placeholder="Enter your question" rows={3} />
        </Form.Item>

        {/* Answers */}
        <Form.Item label="Answers">
          <Form.List name="answers">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }, index) => (
                  <Row
                    key={key}
                    gutter={8}
                    align="middle"
                    style={{ marginBottom: 8 }}
                  >
                    <Col flex="auto">
                      <Form.Item
                        {...restField}
                        name={name}
                        rules={[
                          {
                            required: true,
                            message: "Answer text is required",
                          },
                        ]}
                        style={{ marginBottom: 0 }}
                      >
                        <Input placeholder={`Option ${index + 1}`} />
                      </Form.Item>
                    </Col>
                    <Col>
                      <Checkbox
                        checked={correctAnswers.includes(index)}
                        onChange={(e) =>
                          handleCheckboxChange(e.target.checked, index)
                        }
                      >
                        Correct
                      </Checkbox>
                    </Col>
                    <Col>
                      {fields.length > 1 && (
                        <Button
                          type="text"
                          danger
                          icon={<DeleteOutlined />}
                          onClick={() => remove(name)}
                        />
                      )}
                    </Col>
                  </Row>
                ))}
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                  >
                    Add Answer
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </Form.Item>

        {/* Correct Reason */}
        <Form.Item
          name="correctReasonDetails"
          label="Correct Reason Details"
          rules={[
            {
              required: true,
              message: "Please provide the reason for the correct answer",
            },
          ]}
        >
          <Input.TextArea
            placeholder="Enter explanation for the correct answer"
            rows={3}
          />
        </Form.Item>

        {/* Uploads */}
        <Form.Item
          name="questionImages"
          label="Question Images"
          valuePropName="fileList"
          getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
        >
          <Upload
            listType="picture-card"
            beforeUpload={() => false}
            multiple
            onPreview={handlePreview}
          >
            {uploadButton}
          </Upload>
        </Form.Item>

        <Form.Item
          name="answerImages"
          label="Answer Images"
          valuePropName="fileList"
          getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
        >
          <Upload
            listType="picture-card"
            beforeUpload={() => false}
            multiple
            onPreview={handlePreview}
          >
            {uploadButton}
          </Upload>
        </Form.Item>

        <Form.Item
          name="correctReasonImage"
          label="Correct Reason Image"
          valuePropName="fileList"
          getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
        >
          <Upload
            listType="picture-card"
            beforeUpload={() => false}
            onPreview={handlePreview}
          >
            {uploadButton}
          </Upload>
        </Form.Item>

        <Modal
          open={previewVisible}
          title={previewTitle}
          footer={null}
          onCancel={() => setPreviewVisible(false)}
        >
          <img alt="preview" style={{ width: "100%" }} src={previewImage} />
        </Modal>

        {/* Actions */}
        <Form.Item>
          <div className="flex justify-end gap-2">
            <Button onClick={() => navigate("/dashboard/questions")}>
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={isAddQuestionLoading || isEditQuestionLoading}
            >
              {id ? "Update" : "Create"}
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Spin>
  );
};

export default CreateQuestions;
