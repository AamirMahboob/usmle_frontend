"use client";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Card, Popconfirm, Space, Spin, Table } from "antd";
import React, { useEffect, useState } from "react";
import AddQuestionModal from "../components/question-comps/AddQuestionModal";
import {
    useGetQuestionsQuery,
    useDeleteQuestionMutation,
} from "../store/questionSlice";
import toast from "react-hot-toast";

const AddQuestion = () => {
    const { data = [], isError, error, isLoading } = useGetQuestionsQuery();
    const [deleteQuestion, { isLoading: isDeleteLoading }] =
        useDeleteQuestionMutation();
    const [openModal, setOpenModal] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState();
    const [modifyQuestionArray, setModifiedQuestionArray] = useState([]);

    useEffect(() => {
        console.log(data, ":ques");
        if (data && data?.success === true && Array.isArray(data?.data)) {
            const updatedArray = data?.data?.map((item) => ({
                ...item,
                key: item._id || "",
            }));
            setModifiedQuestionArray(updatedArray);
        } else {
            setModifiedQuestionArray([]);
        }
    }, [data?.data]);

    const handleDeleteQuestion = async (_id) => {
        console.log(_id);
        try {
            const res = await deleteQuestion(_id).unwrap(); // unwrap extracts actual response or throws error
            if (res?.success === true) {
                toast.success("Question deleted successfully");
            }
            if (res?.success === false) {
                toast.error(res?.data?.message || "Question deleted successfully");
            }
        } catch (err) {
            console.error("Delete failed:", err);
            toast.error(err?.data?.message || "Failed to delete user");
        }
    };

    const columns = [
        {
            title: "Subject",
            dataIndex: "subject",
            key: "subject",
            render: (_, record) => `${record.subject?.subject}`,
            sorter: (a, b) => a.subject?.subject.localeCompare(b.subject?.subject),
        },
        {
            title: "Question",
            width: 400,
            dataIndex: "question",
            key: "question",
            render: (_, record) => `${record.question}`,
            sorter: (a, b) => a.question.localeCompare(b.question),
        },
        {
            title: "Question Type",
            dataIndex: "questionType",
            key: "questionType",
            render: (_, record) => `${record.questionType}`,
        },
        {
            title: "Action",
            key: "action",
            render: (_, record) => (
                <Space size="middle">
                    <Button
                        type="primary"
                        icon={<EditOutlined />}
                        onClick={() => {
                            setOpenModal(true), setCurrentQuestion(record);
                        }}
                        className="edit-btn !bg-yellow-500"
                    >
                        Edit
                    </Button>
                    <Popconfirm
                        title="Are you sure to delete this question?"
                        onConfirm={() => handleDeleteQuestion(record._id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button danger icon={<DeleteOutlined />}>
                            Delete
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <Card
                title="Questions"
                variant="outlined"
                extra={
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => {
                            setOpenModal(true), setCurrentQuestion(null);
                        }}
                    >
                        Create Question
                    </Button>
                }
            >
                <Spin size="large" spinning={isLoading || isDeleteLoading}>
                    <Table
                        columns={columns}
                        dataSource={modifyQuestionArray}
                        rowKey="key"
                        pagination={{ pageSize: 5 }}
                        className="user-table"
                        showSorterTooltip={false}
                    />
                </Spin>
            </Card>

            {openModal && (
                <AddQuestionModal
                    openModal={openModal}
                    setOpenModal={setOpenModal}
                    currentQuestion={currentQuestion}
                />
            )}
        </div>
    );
};

export default AddQuestion;
