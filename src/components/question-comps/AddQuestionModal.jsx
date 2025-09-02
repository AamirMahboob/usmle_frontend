/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Select,
  Modal,
  Checkbox,
  Spin,
  Upload,
  Row,
  Col,
  Image,
} from "antd";
import {
  QuestionCircleOutlined,
  PlusOutlined,
  DeleteOutlined,
  LoadingOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import toast from "react-hot-toast";

// Replace these with your actual API hooks
import { useGetSubjectsQuery } from "../../store/subjectSlice";
import { useGetSystemBySubjectIdMutation } from "../../store/systemSlice";
import { useGetSubsystemBySystemIdMutation } from "../../store/subSystemSlice";
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
  const [subsystemId, setSubsystemId] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewTitle, setPreviewTitle] = useState("");
  const [existingQuestionImages, setExistingQuestionImages] = useState([]);
  const [existingAnswerImages, setExistingAnswerImages] = useState([]);
  const [keepCorrectReasonImage, setKeepCorrectReasonImage] = useState(true);
  const [answerImages, setAnswerImages] = useState([]);
  const imageUrl = "https://usmle-backend.vercel.app";

  // API hooks
  const { data: subjectRes, isLoading: isSubjectLoading } =
    useGetSubjectsQuery();
  const [getSystemBySubjectIdApi, { isLoading: isSystemLoading }] =
    useGetSystemBySubjectIdMutation();
  const [getSubsystemBySystemIdApi, { isLoading: isSubsystemLoading }] =
    useGetSubsystemBySystemIdMutation();
  const [addQuestionApi, { isLoading: isAddQuestionLoading }] =
    useCreateQuestionMutation();
  const [editQuestionApi, { isLoading: isEditQuestionLoading }] =
    useEditQuestionMutation();

  const [modifySubjectArray, setModifiedSubjectArray] = useState([]);
  const [modifySystemArray, setModifiedSystemArray] = useState([]);
  const [modifySubsystemArray, setModifiedSubsystemArray] = useState([]);

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

  // Load currentQuestion for edit
  useEffect(() => {
    if (currentQuestion) {
      const {
        questionId,
        subject,
        system,
        subSystem,
        question,
        questionType,
        answers,
        correctReasonDetails,
        questionImages,
        correctReasonImage,
      } = currentQuestion;

      // Set form values
      form.setFieldsValue({
        questionId,
        subject: subject?._id,
        system: system?._id,
        subsystem: subSystem?._id,
        question,
        questionType,
        answers: answers.map((a) => a.text),
        correctReasonDetails,
      });

      // Set existing images
      setExistingQuestionImages(questionImages || []);

      // Extract answer images from answers
      const ansImages = answers.map((a) => a.image).filter((img) => img);
      setExistingAnswerImages(ansImages);

      // Initialize answerImages state for UI
      const initialAnswerImages = answers.map((ans, index) => ({
        uid: `answer-${index}`,
        name: `answer-image-${index}.png`,
        status: "done",
        url: ans.image ? `${imageUrl}${ans.image}` : null,
      }));
      setAnswerImages(initialAnswerImages);

      // Set correct reason image handling
      setKeepCorrectReasonImage(!!correctReasonImage);

      setSubjectId(subject?._id);
      setSystemId(system?._id);
      setSubsystemId(subSystem?._id);
      setQuestionType(questionType);
      setCorrectAnswers(
        answers.reduce((acc, ans, idx) => {
          if (ans.isCorrect) acc.push(idx);
          return acc;
        }, [])
      );

      // Load systems when editing
      if (subject?._id) {
        fetchSystems(subject._id);
      }

      // Load subsystems when editing
      if (system?._id) {
        fetchSubsystems(system._id);
      }
    } else {
      // Reset everything for new question
      form.resetFields();
      setQuestionType("MCQ");
      setCorrectAnswers([]);
      setSubjectId(null);
      setSystemId(null);
      setSubsystemId(null);
      setExistingQuestionImages([]);
      setExistingAnswerImages([]);
      setAnswerImages([]);
      setKeepCorrectReasonImage(true);
      setModifiedSystemArray([]);
      setModifiedSubsystemArray([]);
    }
  }, [currentQuestion, form]);

  const fetchSystems = async (subId) => {
    try {
      setModifiedSystemArray([]);
      const response = await getSystemBySubjectIdApi(subId).unwrap();

      if (response.success) {
        setModifiedSystemArray(
          response.data.systems.map((sys) => ({
            label: sys.system_name,
            value: sys._id,
          }))
        );
      } else {
        setModifiedSystemArray([]);
      }
    } catch {
      setModifiedSystemArray([]);
    }
  };

  const fetchSubsystems = async (sysId) => {
    try {
      setModifiedSubsystemArray([]);
      const response = await getSubsystemBySystemIdApi(sysId).unwrap();

      if (response.success) {
        setModifiedSubsystemArray(
          response.data.map((subsys) => ({
            label: subsys.name,
            value: subsys._id,
          }))
        );
      } else {
        setModifiedSubsystemArray([]);
      }
    } catch {
      setModifiedSubsystemArray([]);
    }
  };

  const createQuestion = async (payload) => {
    try {
      const response = await addQuestionApi(payload).unwrap();
      if (response.success) {
        setOpenModal(false);
        form.resetFields();
        setCorrectAnswers([]);
        setQuestionType("MCQ");
        setModifiedSystemArray([]);
        setModifiedSubsystemArray([]);
        toast.success("Question Added Successfully");
      } else {
        toast.error(response?.message || "Failed to add question");
      }
    } catch (error) {
      if (error.data?.success === false) {
        toast.error(error.data.message || "Something went wrong");
      } else {
        toast.error(error.message || "Something went wrong");
      }
    }
  };

  const editQuestion = async (payload) => {
    try {
      const response = await editQuestionApi(payload).unwrap();
      if (response.success) {
        setOpenModal(false);
        toast.success("Question Updated Successfully");
      } else {
        toast.error(response?.message || "Failed to update question");
      }
    } catch (error) {
      if (error.data?.success === false) {
        toast.error(error.data.message || "Something went wrong");
      } else {
        toast.error(error.message || "Something went wrong");
      }
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

    const formData = new FormData();
    formData.append("questionId", values.questionId);
    formData.append("subject", subjectId);
    formData.append("system", systemId);
    formData.append("subsystem", subsystemId || null);
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

    // Add information about existing images
    formData.append(
      "existingQuestionImages",
      JSON.stringify(existingQuestionImages)
    );
    formData.append(
      "existingAnswerImages",
      JSON.stringify(existingAnswerImages)
    );
    formData.append(
      "keepCorrectReasonImage",
      keepCorrectReasonImage.toString()
    );

    // File uploads
    ["questionImages", "answerImages", "correctReasonImage"].forEach((key) => {
      if (values[key]) {
        values[key].forEach((file) => {
          if (file.originFileObj) {
            formData.append(key, file.originFileObj);
          }
        });
      }
    });

    if (currentQuestion?._id) {
      formData.append("_id", currentQuestion._id);
      editQuestion({ formData, id: currentQuestion._id });
    } else {
      createQuestion(formData);
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
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewVisible(true);
    setPreviewTitle(
      file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
    );
  };

  const handleCancel = () => setPreviewVisible(false);

  const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  // Function to handle image removal
  const handleRemoveImage = (type, index, imageUrl) => {
    if (type === "question") {
      const newImages = [...existingQuestionImages];
      newImages.splice(index, 1);
      setExistingQuestionImages(newImages);
    } else if (type === "answer") {
      const newImages = [...existingAnswerImages];
      newImages.splice(index, 1);
      setExistingAnswerImages(newImages);

      // Also update the answerImages state for UI
      const newAnswerImages = [...answerImages];
      newAnswerImages[index] = {
        ...newAnswerImages[index],
        url: null,
      };
      setAnswerImages(newAnswerImages);
    } else if (type === "correctReason") {
      setKeepCorrectReasonImage(false);
    }
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  // Custom upload component that shows existing images and allows removal
  const renderUploadWithExisting = (type, existingImages, multiple = true) => {
    return (
      <div>
        {/* Show existing images with remove option */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "8px",
            marginBottom: "16px",
          }}
        >
          {existingImages.map((image, index) => (
            <div
              key={index}
              style={{ position: "relative", width: "100px", height: "100px" }}
            >
              <Image
                src={`${imageUrl}${image}`}
                alt={`Existing ${type} ${index + 1}`}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                preview={{
                  mask: <EyeOutlined />,
                }}
              />
              <Button
                type="primary"
                danger
                size="small"
                icon={<DeleteOutlined />}
                style={{ position: "absolute", top: 0, right: 0 }}
                onClick={() => handleRemoveImage(type, index, image)}
              />
            </div>
          ))}
        </div>

        {/* Upload component for new images */}
        <Form.Item
          name={
            type === "question"
              ? "questionImages"
              : type === "answer"
              ? "answerImages"
              : "correctReasonImage"
          }
          valuePropName="fileList"
          getValueFromEvent={(e) => {
            if (Array.isArray(e)) {
              return e;
            }
            return e && e.fileList;
          }}
          noStyle
        >
          <Upload
            listType="picture-card"
            beforeUpload={() => false}
            multiple={multiple}
            onPreview={handlePreview}
          >
            {uploadButton}
          </Upload>
        </Form.Item>
      </div>
    );
  };

  return (
    <Modal
      open={openModal}
      maskClosable={false}
      onCancel={() => {
        setOpenModal(false);
        setModifiedSystemArray([]);
        setModifiedSubsystemArray([]);
      }}
      footer={null}
      width={2000}
      
      title={
        <span className="flex items-center gap-2">
          <QuestionCircleOutlined />
          {currentQuestion ? "Update Question" : "Add Question"}
        </span>
      }
    >
      <Spin spinning={isSubjectLoading}>
        <Form
          form={form}
          onFinish={onFinish}
          layout="vertical"
          initialValues={{ questionType: "MCQ", answers: [""] }}
        >
          {/* Question ID */}
          <Form.Item
            name="questionId"
            label="Question ID"
            rules={[{ required: true, message: "Please enter a question ID" }]}
          >
            <Input
              placeholder="Enter question ID"
              disabled={!!currentQuestion?._id}
            />
          </Form.Item>

          {/* Subject */}
          <Form.Item
            name="subject"
            label="Subject"
            rules={[{ required: true, message: "Please select a subject" }]}
          >
            <Select
              placeholder="Select Subject"
              options={modifySubjectArray}
              disabled={!!currentQuestion?._id}
              onChange={(val) => {
                setSubjectId(val);
                setSystemId(null);
                setSubsystemId(null);
                form.setFieldsValue({ system: null, subsystem: null });
                setModifiedSystemArray([]);
                setModifiedSubsystemArray([]);
                fetchSystems(val);
              }}
            />
          </Form.Item>

          {/* System */}
          <Form.Item
            name="system"
            label="System"
            rules={[{ required: true, message: "Please select a system" }]}
          >
            <Select
              placeholder={
                isSystemLoading ? "Loading systems..." : "Select System"
              }
              disabled={!!currentQuestion?._id}
              options={modifySystemArray}
              onChange={(val) => {
                setSystemId(val);
                setSubsystemId(null);
                form.setFieldsValue({ subsystem: null });
                setModifiedSubsystemArray([]);
                fetchSubsystems(val);
              }}
              notFoundContent={
                isSystemLoading ? (
                  <div className="text-center p-2">
                    <LoadingOutlined /> Loading systems...
                  </div>
                ) : subjectId ? (
                  "No systems found"
                ) : (
                  "Please select a subject first"
                )
              }
              loading={isSystemLoading}
            />
          </Form.Item>

          {/* Subsystem */}
          <Form.Item name="subsystem" label="Sub System">
            <Select
              placeholder={
                isSubsystemLoading
                  ? "Loading subsystems..."
                  : "Select Sub System"
              }
              disabled={!!currentQuestion?._id}
              options={modifySubsystemArray}
              onChange={(val) => setSubsystemId(val)}
              notFoundContent={
                isSubsystemLoading ? (
                  <div className="text-center p-2">
                    <LoadingOutlined /> Loading subsystems...
                  </div>
                ) : systemId ? (
                  "No subsystems found"
                ) : (
                  "Please select a system first"
                )
              }
              loading={isSubsystemLoading}
            />
          </Form.Item>

          {/* Question Type */}
          <Form.Item
            name="questionType"
            label="Question Type"
            rules={[
              { required: true, message: "Please select a question type" },
            ]}
          >
            <Select
              value={questionType}
              onChange={(val) => setQuestionType(val)}
              disabled={!!currentQuestion?._id}
            >
              <Select.Option value="MCQ">MCQ</Select.Option>
              {/* <Select.Option value="trueFalse">True/False</Select.Option>
              <Select.Option value="shortAnswer">Short Answer</Select.Option> */}
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
                            { required: true, message: "Answer is required" },
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
            <Input.TextArea placeholder="Enter explanation" rows={3} />
          </Form.Item>

          {/* Question Images */}
          <Form.Item label="Question Images">
            {renderUploadWithExisting("question", existingQuestionImages, true)}
          </Form.Item>

          {/* Answer Images */}
          {/* <Form.Item label="Answer Images">
            {renderUploadWithExisting("answer", existingAnswerImages, true)}
          </Form.Item> */}

          {/* Correct Reason Image */}
          <Form.Item label="Correct Reason Image">
            {keepCorrectReasonImage && currentQuestion?.correctReasonImage ? (
              <div
                style={{
                  position: "relative",
                  width: "100px",
                  height: "100px",
                  marginBottom: "16px",
                }}
              >
                <Image
                  src={`${imageUrl}${currentQuestion.correctReasonImage}`}
                  alt="Correct reason"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  preview={{
                    mask: <EyeOutlined />,
                  }}
                />
                <Button
                  type="primary"
                  danger
                  size="small"
                  icon={<DeleteOutlined />}
                  style={{ position: "absolute", top: 0, right: 0 }}
                  onClick={() => setKeepCorrectReasonImage(false)}
                />
              </div>
            ) : null}
            <Form.Item
              name="correctReasonImage"
              valuePropName="fileList"
              getValueFromEvent={(e) => {
                if (Array.isArray(e)) {
                  return e;
                }
                return e && e.fileList;
              }}
              noStyle
            >
              <Upload
                listType="picture-card"
                beforeUpload={() => false}
                multiple={false}
                onPreview={handlePreview}
              >
                {uploadButton}
              </Upload>
            </Form.Item>
          </Form.Item>

          {/* Preview Modal */}
          <Modal
            open={previewVisible}
            title={previewTitle}
            footer={null}
            onCancel={handleCancel}
          >
            <img alt="Preview" style={{ width: "100%" }} src={previewImage} />
          </Modal>

          {/* Actions */}
          <Form.Item>
            <div className="flex justify-end gap-2">
              <Button
                onClick={() => {
                  setOpenModal(false);
                  setModifiedSystemArray([]);
                  setModifiedSubsystemArray([]);
                }}
              >
                Cancel
              </Button>
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
