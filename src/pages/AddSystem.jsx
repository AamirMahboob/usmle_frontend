"use client";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Card, Popconfirm, Space, Spin, Table } from "antd";
import React, { useEffect, useState } from "react";
import AddSystemModal from "../components/createsystem-comps/AddSystemModal";
import toast from "react-hot-toast";
import { useGetSubjectsQuery } from "../store/subjectSlice";
import { useDeleteSystemMutation, useGetSystemQuery } from "../store/systemSlice";

const AddSystem = () => {
    // Dummy data simulation
    const { data, isLoading: systemLoading } = useGetSystemQuery();
    const [systemData, setSystemData] = useState([])

    const [deletSystem] = useDeleteSystemMutation()
    useEffect(() => {
        if (data && data?.success === true && Array.isArray(data?.data)) {
            console.log(data.data, "data.dataa")
            setSystemData(data?.data);
        } else {
            setSystemData([])
        }
    }, [data?.data])



    const dummySystems = [
        {
            _id: "1",
            subject: { _id: "math", subject: "Mathematics" },
            system_name: "Algebra",
            system_description: "Linear equations and polynomials",
            createdAt: "2023-01-15T08:30:00Z"
        },
        {
            _id: "2",
            subject: { _id: "sci", subject: "Science" },
            system_name: "Physics",
            system_description: "Mechanics and thermodynamics",
            createdAt: "2023-02-20T10:15:00Z"
        }
    ];

    // Simulated API states
    const [isLoading, setIsLoading] = useState(false);
    const [isDeleteLoading, setIsDeleteLoading] = useState(false);
    const [systems, setSystems] = useState([]);

    const [openModal, setOpenModal] = useState(false);
    const [currentSystem, setCurrentSystem] = useState(null);

    // Simulate data fetching
    useEffect(() => {
        setIsLoading(true);
        setTimeout(() => {
            setSystems(dummySystems.map(item => ({ ...item, key: item._id })));
            setIsLoading(false);
        }, 800);
    }, []);

    const handleDeleteSystem = async (_id) => {
        setIsDeleteLoading(true);
        try {
            // Simulate API call
             await deletSystem(_id).unwrap();
            setSystems(prev => prev.filter(sys => sys._id !== _id));
            toast.success("System deleted successfully");
        } catch (err) {
            toast.error("Failed to delete system");
        } finally {
            setIsDeleteLoading(false);
        }
    };

    const columns = [
        {
            title: "Subject",
            dataIndex: "subject",
            key: "subject",
            render: (subject) => subject?.subject || "N/A",
            sorter: (a, b) => a.subject.subject.localeCompare(b.subject.subject),
        },
        {
            title: "System Name",
            dataIndex: "system_name",
            key: "system_name",
            sorter: (a, b) => a.system_name.localeCompare(b.system_name),
        },
        {
            title: "Description",
            dataIndex: "system_description",
            key: "system_description",
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
                            setCurrentSystem(record);
                        }}
                        className="edit-btn !bg-yellow-500"
                    >
                        Edit
                    </Button>
                    <Popconfirm
                        title="Are you sure to delete this system?"
                        onConfirm={() => handleDeleteSystem(record._id)}
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
                title="Systems"
                variant="outlined"
                extra={
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => {
                            setOpenModal(true);
                            setCurrentSystem(null);
                        }}
                    >
                        Add System
                    </Button>
                }
            >
                <Spin size="large" spinning={isLoading || isDeleteLoading}>
                    <Table
                        columns={columns}
                        dataSource={systemData}
                        rowKey="key"
                        pagination={{ pageSize: 5 }}
                        className="user-table"
                        showSorterTooltip={false}
                    />
                </Spin>
            </Card>

            {openModal && (
                <AddSystemModal
                    openModal={openModal}
                    setOpenModal={setOpenModal}
                    currentSystem={currentSystem}
                    setSystems={setSystems}
                    systems={systems}
                />
            )}


        </div>
    );
};

export default AddSystem;