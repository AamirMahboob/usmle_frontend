import { QuestionCircleOutlined } from "@ant-design/icons";
import {
  Form,
  Input,
  Button,
  Select,
  Space,
  Modal,
  Checkbox,
  Spin,
} from "antd";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useGetSubjectsQuery } from "../../store/subjectSlice";
import {
  useCreateQuestionMutation,
  useEditQuestionMutation,
} from "../../store/questionSlice";

const AddQuestionModal = ({ openModal, setOpenModal, currentQuestion }) => {
  const [form] = Form.useForm();
  const [correctAnswers, setCorrectAnswers] = useState([]);
  const [questionType, setQuestionType] = useState("MCQ");
  const [subjectId, setSubjectId] = useState(null);
  const { data = [], isError, error, isLoading } = useGetSubjectsQuery();
  const [addQuestionApi, { isLoading: isAddQuestionLoading }] =
    useCreateQuestionMutation();
  const [editQuestionApi, { isLoading: isEditQuestionLoading }] =
    useEditQuestionMutation();

  const [modifySubjectArray, setModifiedSubjectArray] = useState([]);

  const createQuestion = async (values) => {
    try {
      const response = await addQuestionApi(values);
      if (response.data.success === true) {
        setOpenModal(false);
        form.resetFields();
        setCorrectAnswers([]);
        setQuestionType("MCQs");

        toast.success("Question Added Successfully");
      }
      if (response.data.success === false) {
        toast.error(response?.data?.message || "Question Added Successfully");
      }
    } catch (error) {
      toast.error("some thing went wrong");
    }
  };

  const editQuestion = async (values) => {
    try {
      const response = await editQuestionApi(values);
      if (response.data.success === true) {
        setOpenModal(false);
        toast.success("Question Updated Successfully");
      }
      if (response.data.success === false) {
        toast.error(response?.data?.message || "Question Updated Successfully");
      }
    } catch (error) {
      toast.error("some thing went wrong");
    }
  };

  useEffect(() => {
    if (data && data?.success === true && Array.isArray(data?.data)) {
      const updatedArray = data?.data?.map((item) => ({
        label: item.subject,
        value: item.subject,
        _id: item._id || "",
      }));

      setModifiedSubjectArray(updatedArray);
    } else {
      setModifiedSubjectArray([]);
    }
  }, [data?.data]);

  // Load currentQuestion for edit
  useEffect(() => {
    if (currentQuestion) {
      const { subject, question, questionType, answers } = currentQuestion;
      form.setFieldsValue({
        subject: subject.subject,
        question,
        questionType,
        answers: answers.map((a) => a.text),
      });
      setSubjectId(subject._id);
      setQuestionType(questionType);
      setCorrectAnswers(
        answers.reduce((acc, ans, idx) => {
          if (ans.isCorrect) acc.push(idx);
          return acc;
        }, [])
      );
    } else {
      // Reset for new question
      form.resetFields();
      setQuestionType("MCQ");
      setCorrectAnswers([]);
    }
  }, [currentQuestion, form]);

  // Handle answer fields count based on type
  useEffect(() => {
    const count = questionType === "MCQ" ? 4 : 2;
    const currentAnswers = form.getFieldValue("answers") || [];
    const padded = [...currentAnswers.slice(0, count)];
    while (padded.length < count) padded.push("");
    form.setFieldsValue({ answers: padded });
    if (!currentQuestion) {
      setCorrectAnswers([]);
    }
  }, [questionType]);

  const onFinish = async (values) => {
    if (
      (questionType === "MCQ" || questionType === "trueFalse") &&
      correctAnswers.length === 0
    ) {
      toast.error("Please select at least one correct answer.");
      return;
    }

    const payload = {
      subject: subjectId,
      question: values.question,
      questionType,
      answers: (values.answers || []).map((text, index) => ({
        text,
        isCorrect: correctAnswers.includes(index),
      })),
    };

    console.log("Submitting Payload:", payload);
    if (currentQuestion?._id) {
      editQuestion({ ...payload, _id: currentQuestion?._id });
    } else {
      createQuestion(payload);
    }
  };

  const handleCheckboxChange = (checked, index) => {
    if (checked) {
      setCorrectAnswers([...correctAnswers, index]);
    } else {
      setCorrectAnswers(correctAnswers.filter((i) => i !== index));
    }
  };

  return (
    <Modal
      open={openModal}
      maskClosable={false}
      onCancel={() => setOpenModal(false)}
      footer={null}
      width={800}
      title={
        <span className="flex items-center gap-2">
          <QuestionCircleOutlined />
          {currentQuestion ? "Update Question" : "Add Question"}
        </span>
      }
    >
      <Spin spinning={isLoading}>
        <Form
          form={form}
          onFinish={onFinish}
          layout="vertical"
          initialValues={{ questionType: "MCQ" }}
        >
          {/* Subject */}
          <Form.Item
            name="subject"
            label="Subject"
            rules={[{ required: true }]}
          >
            <Select
              placeholder="Select Subject"
              options={modifySubjectArray}
              onChange={(val) => {
                const selectedSubject = modifySubjectArray.find(
                  (item) => item.value === val
                );
                setSubjectId(selectedSubject?._id);
              }}
            />
          </Form.Item>

          {/* Question Type */}
          <Form.Item
            name="questionType"
            label="Question Type"
            rules={[{ required: true }]}
          >
            <Select
              value={questionType}
              onChange={(val) => setQuestionType(val)}
              disabled={currentQuestion?._id ? true : false}
            >
              <Select.Option value="MCQ">
                MCQ (Single/Multiple Correct)
              </Select.Option>
              {/* <Select.Option value="TrueFalse">True / False</Select.Option>
              <Select.Option value="ShortAnswer">Short Answer</Select.Option> */}
            </Select>
          </Form.Item>

          {/* Question Text */}
          <Form.Item
            name="question"
            label="Question"
            rules={[{ required: true, message: "Question is required" }]}
          >
            <Input.TextArea placeholder="Enter your question" rows={3} />
          </Form.Item>

          {/* Answers */}
          {(questionType === "MCQ" ||
            questionType === "TrueFalse" ||
            questionType === "ShortAnswer") && (
            <Form.List name="answers">
              {(fields) => (
                <Space direction="vertical" style={{ width: "100%" }}>
                  {fields.map(({ key, name, ...restField }, index) => (
                    <Space key={key} style={{ display: "flex", width: "100%" }}>
                      <Form.Item
                        {...restField}
                        name={name}
                        style={{ flex: 1 }}
                        rules={[{ required: true, message: "Enter answer" }]}
                      >
                        <Input placeholder={`Option ${index + 1}`} />
                      </Form.Item>
                      <Checkbox
                        className="self-center"
                        checked={correctAnswers.includes(index)}
                        onChange={(e) =>
                          handleCheckboxChange(e.target.checked, index)
                        }
                      >
                        Correct
                      </Checkbox>
                    </Space>
                  ))}
                </Space>
              )}
            </Form.List>
          )}

          {/* Submit & Cancel Buttons */}
          <Form.Item>
            <div className="flex justify-end gap-2">
              <Button onClick={() => setOpenModal(false)}>Cancel</Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={isAddQuestionLoading || isEditQuestionLoading}
              >
                {currentQuestion ? "Update" : "Create"}
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Spin>
    </Modal>
  );
};

export default AddQuestionModal;
