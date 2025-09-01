/* eslint-disable no-unused-vars */
"use client";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Card, Popconfirm, Space, Spin, Table } from "antd";
import React, { useEffect, useState } from "react";
import AddSubSystemModal from "../components/createsystem-comps/AddSubSystemModal";
import toast from "react-hot-toast";
import {
  useDeleteSubSystemMutation,
  useGetSubSystemQuery,
} from "../store/subSystemSlice";

const AddSubSystem = () => {
  const { data, isLoading: subSystemLoading } = useGetSubSystemQuery();
  const [subSystemData, setSubSystemData] = useState([]);
  const [deleteSubSystem, { isLoading: isDeleteLoading }] =
    useDeleteSubSystemMutation();

  const [openModal, setOpenModal] = useState(false);
  const [currentSubSystem, setCurrentSubSystem] = useState(null);

  useEffect(() => {
    if (data?.success && Array.isArray(data?.data)) {
      setSubSystemData(data.data);
    } else {
      setSubSystemData([]);
    }
  }, [data]);

  const handleDeleteSubSystem = async (_id) => {
    try {
      await deleteSubSystem(_id).unwrap();
      setSubSystemData((prev) => prev.filter((sys) => sys._id !== _id));
      toast.success("SubSystem deleted successfully");
    } catch (err) {
      toast.error("Failed to delete SubSystem");
    }
  };

  console.log(subSystemData, "subSystemData");

  const columns = [
    {
      title: "Subject",

      key: "subject",
      render: (_, record) => record.subject?.subject || "N/A",
      sorter: (a, b) =>
        a.subject?.subject?.localeCompare(b.subject?.subject || "") || 0,
    },
    {
      title: "System",

      key: "system",
      render: (_, record) => record.system?.system_name || "N/A",
      sorter: (a, b) =>
        a.system?.system_name?.localeCompare(b.system?.system_name || "") || 0,
    },
    {
      title: "Sub System Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Created Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => new Date(date).toLocaleDateString(),
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
              setOpenModal(true);
              setCurrentSubSystem(record);
            }}
            className="edit-btn !bg-yellow-500"
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure to delete this SubSystem?"
            onConfirm={() => handleDeleteSubSystem(record._id)}
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
        title="Sub Systems"
        variant="outlined"
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setOpenModal(true);
              setCurrentSubSystem(null);
            }}
          >
            Add Sub System
          </Button>
        }
      >
        <Spin size="large" spinning={subSystemLoading || isDeleteLoading}>
          <Table
            columns={columns}
            dataSource={subSystemData}
            rowKey="_id"
            pagination={{ pageSize: 5 }}
            className="user-table"
            showSorterTooltip={false}
          />
        </Spin>
      </Card>

      {openModal && (
        <AddSubSystemModal
          openModal={openModal}
          setOpenModal={setOpenModal}
          currentSubSystem={currentSubSystem}
          setSubSystemData={setSubSystemData}
          subSystemData={subSystemData}
        />
      )}
    </div>
  );
};

export default AddSubSystem;
