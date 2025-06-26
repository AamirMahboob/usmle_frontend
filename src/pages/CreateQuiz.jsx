/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
"use client";
import { PlusOutlined } from "@ant-design/icons";
import { Button, Card, Spin, Table } from "antd";
import React, { useEffect, useState } from "react";
import { useGetQuizzesQuery } from "../store/quizSlice";

import CreateQuizModal from "../components/createquiz-comps/CreateQuizModal";
import { useNavigate } from "react-router-dom";

const CreateQuiz = () => {
  const navigation = useNavigate();
  const [openModal, setModalOpen] = useState(false);

  const { data = [], isLoading } = useGetQuizzesQuery();

  const [modifyQuizArray, setModifiedQuizArray] = useState([]);
  console.log(data, "data");

  useEffect(() => {
    if (data && data?.success === true && Array.isArray(data?.data)) {
      const updatedArray = data?.data?.map((item) => ({
        ...item,
        key: item._id || "",
      }));
      setModifiedQuizArray(updatedArray);
    } else {
      setModifiedQuizArray([]);
    }
  }, [data?.data]);

  const columns = [
    {
      title: "Quiz Name",
      dataIndex: "name",
      key: "name",
      render: (_, record, i) => <p>{i + 1}</p>,
    },
    {
      title: "Duration",
      dataIndex: "durationMinutes",
      key: "durationMinutes",
      render: (_, record, i) => <p>{record.durationMinutes + "mins"}</p>,
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (_, record, i) => (
        <p>{record.createdAt && new Date(record.createdAt).toDateString()}</p>
      ),
    },
    {
      title: "Total Questions",
      dataIndex: "totalQuestions",
      key: "totalQuestions",
      render: (_, record, i) => <p>{record.numberOfQuestions}</p>,
    },
    {
      title: "Redirect",
      key: "action",
      render: (_, record) => (
        <Button
          type="link"
          onClick={() => navigation(`/dashboard/quiz/${record._id}`)}
        >
          Go to Quiz
        </Button>
      ),
    },
  ];

  //   const data = [
  //     {
  //       id: "1",
  //       name: "JavaScript Basics",
  //       duration: "30 min",
  //       createdAt: "2025-06-15",
  //       totalQuestions: 10,
  //     },
  //     {
  //       id: "2",
  //       name: "React Advanced",
  //       duration: "45 min",
  //       createdAt: "2025-06-16",
  //       totalQuestions: 15,
  //     },
  //     {
  //       id: "3",
  //       name: "Node.js Fundamentals",
  //       duration: "40 min",
  //       createdAt: "2025-06-17",
  //       totalQuestions: 12,
  //     },
  //   ];

  return (
    <div>
      <Card
        title="Create Quiz"
        variant="outlined"
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setModalOpen(true);
              // setCurrentSubject(null);
            }}
          >
            Create Quiz
          </Button>
        }
      >
        <Spin size="large" spinning={false}>
          <Table columns={columns} dataSource={modifyQuizArray} rowKey="id" />
        </Spin>
      </Card>
      {openModal && (
        <CreateQuizModal openModal={openModal} setModalOpen={setModalOpen} />
      )}
    </div>
  );
};

export default CreateQuiz;
