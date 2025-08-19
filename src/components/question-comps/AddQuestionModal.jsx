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
import { useGetSystemQuery } from "../../store/systemSlice";
import {
  useCreateQuestionMutation,
  useEditQuestionMutation,
} from "../../store/questionSlice";

const AddQuestionModal = ({ openModal, setOpenModal, currentQuestion }) => {
  const [form] = Form.useForm();
  const [correctAnswers, setCorrectAnswers] = useState([]);
  const [questionType, setQuestionType] = useState("MCQ");
  const [subjectId, setSubjectId] = useState(null);
  const [systemId, setSystemId] = useState(null);

  // Queries
  const { data: subjectRes, isLoading: isSubjectLoading } =
    useGetSubjectsQuery();
  const { data: systemRes, isLoading: isSystemLoading } = useGetSystemQuery();

  const [addQuestionApi, { isLoading: isAddQuestionLoading }] =
    useCreateQuestionMutation();
  const [editQuestionApi, { isLoading: isEditQuestionLoading }] =
    useEditQuestionMutation();

  const [modifySubjectArray, setModifiedSubjectArray] = useState([]);
  const [modifySystemArray, setModifiedSystemArray] = useState([]);

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
  console.log(systemRes, "systemRes");

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
      } = currentQuestion;
      form.setFieldsValue({
        subject: subject?._id,
        system: system?._id,
        question,
        questionType,
        answers: answers.map((a) => a.text),
        correctReasonDetails,
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
      // Reset for new
      form.resetFields();
      setQuestionType("MCQ");
      setCorrectAnswers([]);
    }
  }, [currentQuestion, form]);

  // Auto-adjust answer count
  useEffect(() => {
    const count = questionType === "MCQ" ? 4 : 2;
    const currentAnswers = form.getFieldValue("answers") || [];
    const padded = [...currentAnswers.slice(0, count)];
    while (padded.length < count) padded.push("");
    form.setFieldsValue({ answers: padded });
    if (!currentQuestion) setCorrectAnswers([]);
  }, [questionType]);

  const createQuestion = async (payload) => {
    console.log(payload, "payload");

    try {
      const response = await addQuestionApi(payload);
      if (response.data.success) {
        setOpenModal(false);
        form.resetFields();
        setCorrectAnswers([]);
        setQuestionType("MCQ");
        toast.success("Question Added Successfully");
      } else {
        toast.error(response?.data?.message || "Failed to add question");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const editQuestion = async (payload) => {
    try {
      const response = await editQuestionApi(payload);
      if (response.data.success) {
        setOpenModal(false);
        toast.success("Question Updated Successfully");
      } else {
        toast.error(response?.data?.message || "Failed to update question");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const onFinish = (values) => {
    if (
      (questionType === "MCQ" || questionType === "trueFalse") &&
      correctAnswers.length === 0
    ) {
      toast.error("Please select at least one correct answer.");
      return;
    }

    const payload = {
      subject: subjectId,
      system: systemId,
      question: values.question,
      questionType,
      answers: (values.answers || []).map((text, index) => ({
        text,
        isCorrect: correctAnswers.includes(index),
      })),
      correctReasonDetails: values.correctReasonDetails, // ✅ FIXED
    };

    if (currentQuestion?._id) {
      editQuestion({ ...payload, _id: currentQuestion._id });
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

  console.log(modifySystemArray, "modifiedsystemarray");

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
      <Spin spinning={isSubjectLoading || isSystemLoading}>
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
              onChange={(val) => setSubjectId(val)}
            />
          </Form.Item>

          {/* System */}
          <Form.Item name="system" label="System" rules={[{ required: true }]}>
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
            rules={[{ required: true }]}
          >
            <Select
              value={questionType}
              onChange={(val) => setQuestionType(val)}
              disabled={!!currentQuestion?._id}
            >
              <Select.Option value="MCQ">
                MCQ (Single/Multiple Correct)
              </Select.Option>
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

          {/* Actions */}
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
