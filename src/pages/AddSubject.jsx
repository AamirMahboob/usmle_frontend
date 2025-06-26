"use client";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Card, Popconfirm, Space, Spin, Table } from "antd";
import React, { useEffect, useState } from "react";
import AddSubjectModal from "../components/subject-comps/AddSubjectModal";
import {
  useGetSubjectsQuery,
  useDeleteSubjectMutation,
} from "../store/subjectSlice";
import toast from "react-hot-toast";

const AddSubject = () => {
  const { data = [], isLoading } = useGetSubjectsQuery();
  const [deleteSubject, { isLoading: isDeleteLoading }] =
    useDeleteSubjectMutation();
  const [openModal, setOpenModal] = useState(false);
  const [currentSubject, setCurrentSubject] = useState();
  const [modifySubjectArray, setModifiedSubjectArray] = useState([]);

  useEffect(() => {
    if (data && data?.success === true && Array.isArray(data?.data)) {
      const updatedArray = data?.data?.map((item) => ({
        ...item,
        key: item._id || "",
      }));

      setModifiedSubjectArray(updatedArray);
    } else {
      setModifiedSubjectArray([]);
    }
  }, [data?.data]);

  const handleDeleteSubject = async (_id) => {
    try {
      const res = await deleteSubject(_id).unwrap(); // unwrap extracts actual response or throws error
      if (res?.success === true) {
        toast.success("Subject deleted successfully");
      }
      if (res?.success === false) {
        toast.error(res?.data?.message || "Subject deleted successfully");
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
      render: (_, record) => `${record.subject}`,
      sorter: (a, b) => a.subject.localeCompare(b.subject),
    },
    {
      title: "Created Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (_, record) =>
        `${record.createdAt ? new Date(record.createdAt) : ""}`,
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
              setOpenModal(true), setCurrentSubject(record);
            }}
            className="edit-btn !bg-yellow-500"
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure to delete this subject?"
            onConfirm={() => handleDeleteSubject(record._id)}
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
        title="Subjects"
        variant="outlined"
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setOpenModal(true), setCurrentSubject(null);
            }}
          >
            Add Subject
          </Button>
        }
      >
        <Spin size="large" spinning={isLoading || isDeleteLoading}>
          <Table
            columns={columns}
            dataSource={modifySubjectArray}
            rowKey="key"
            pagination={{ pageSize: 5 }}
            className="user-table"
            showSorterTooltip={false}
          />
        </Spin>
      </Card>

      {openModal && (
        <AddSubjectModal
          openModal={openModal}
          setOpenModal={setOpenModal}
          currentSubject={currentSubject}
        />
      )}
    </div>
  );
};

export default AddSubject;
