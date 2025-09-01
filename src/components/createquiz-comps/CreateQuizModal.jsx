import toast from 'react-hot-toast';
import { useCreateQuizMutation } from '../../store/quizSlice';
import { useAddSubjectBySubjectMutation, useGetSubjectsQuery } from '../../store/subjectSlice';
import { Modal, Form, InputNumber, Button, Select, message, Divider, Typography } from 'antd';
import React, { useEffect, useState } from 'react';

const { Option } = Select;
const { Title } = Typography;

const CreateQuizModal = ({ openModal, setModalOpen }) => {
    const [form] = Form.useForm();
    const { data = [], isLoading } = useGetSubjectsQuery();
    const [addSubjectBySubject, { isLoading: subjectLoading }] = useAddSubjectBySubjectMutation();
    const [createQuiz, { isLoading: quizLoading }] = useCreateQuizMutation();

    const [modifySubjectArray, setModifiedSubjectArray] = useState([]);
    const [modifyQuestionArray, setModifiedQuestionArray] = useState([]);
    const [selectedSubjects, setSelectedSubjects] = useState([]);

    useEffect(() => {
        if (data?.success && Array.isArray(data?.data)) {
            const updatedArray = data.data.map((item) => ({
                ...item,
                key: item._id || "",
            }));
            setModifiedSubjectArray(updatedArray);
        } else {
            setModifiedSubjectArray([]);
        }
    }, [data]);

    const handleSubmit = async () => {
        if (selectedSubjects.length === 0) {
            message.warning("Please select at least one subject.");
            return;
        }

        try {
            const payload = { subjectIds: selectedSubjects };
            const response = await addSubjectBySubject(payload).unwrap();

            if (response?.success) {
                toast.success("Questions loaded!");
                setModifiedQuestionArray(response?.data || []);
                form.setFieldsValue({ questions: [] }); // Reset previous question selections
            } else {
                toast.error("No questions loaded");
                setModifiedQuestionArray([]);
            }
        } catch (error) {
            console.error("API Error:", error);
            message.error("Failed to fetch questions.");
        }
    };

    const handleFinish = async (values) => {
        console.log("Final Form Submit:", values);

        try {
            const response = await createQuiz(values).unwrap(); // ✅ unwrap actual API response


            if (response?.success) {
                toast.success("Quiz created!");
                setModalOpen(false); // ✅ now this will run
            }
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong while creating the quiz.");
        }
    };


    return (
        <Modal
            title={<Title level={4}>Create New Quiz</Title>}
            open={openModal}
            footer={null}
            onCancel={() => setModalOpen(false)}
            width={600}

        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleFinish}
                initialValues={{
                    durationMinutes: 15,
                    questionsPerSubject: 1,
                    numberOfQuestions: 1,
                }}
            >
                {/* Subject Selection */}
                <Form.Item
                    label="* Subjects"
                    name="subjectIds"
                    rules={[{ required: true, message: 'Please select at least one subject' }]}
                >
                    <Select
                        mode="multiple"
                        placeholder="Select subjects"
                        loading={isLoading}
                        onChange={(value) => {
                            setSelectedSubjects(value);
                            setModifiedQuestionArray([]); // Clear previous questions
                            form.setFieldsValue({ questions: [] });
                        }}
                        value={selectedSubjects}
                    >
                        {modifySubjectArray.map((subject) => (
                            <Option key={subject._id} value={subject._id}>
                                {subject.subject}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>

                <Button
                    type="dashed"
                    onClick={handleSubmit}
                    block
                    style={{ marginBottom: 20 }}
                    loading={subjectLoading}
                >
                    Submit & Load Questions
                </Button>

                <Divider />

                {/* Question Selection */}
                <Form.Item
                    label="* Questions"
                    name="questions"
                    rules={[{ required: true, message: 'Please select at least one question' }]}
                >
                    <Select
                        mode="multiple"
                        placeholder="Select questions"
                        notFoundContent="No questions loaded"
                    >
                        {modifyQuestionArray.map((question) => (
                            <Option key={question._id} value={question._id}>
                                {question.question}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>

                {/* Remaining Fields */}
                <Form.Item
                    label="* Questions Per Subject"
                    name="questionsPerSubject"
                    rules={[{ required: true, message: 'Please enter questions per subject' }]}
                >
                    <InputNumber min={1} style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item
                    label="* Total Number of Questions"
                    name="numberOfQuestions"
                    rules={[{ required: true, message: 'Please enter total number of questions' }]}
                >
                    <InputNumber min={1} style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item label="Duration (in minutes)" name="durationMinutes">
                    <InputNumber min={1} style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" block
                        loading={quizLoading}

                    >
                        Create Quiz
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default CreateQuizModal;
