
import React, { useEffect, useState } from "react";
import {
    Table,
    Button,
    Space,
    Modal,
    Form,
    Input,
    Select,
    message,
    Popconfirm,
    Spin,
    Card,
} from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import "./userManagement.css"; // Create this CSS file for custom styles
import {
    useDeleteUserMutation,
    useGetUsersQuery,
} from "../../store/userApiSlice";

import AddUserModal from "./addUserModal";
import toast from "react-hot-toast";

// User Management Component
const UserManagementContent = () => {
    const { data = [], isError, error, isLoading } = useGetUsersQuery();
    const [deleteUser, { isLoading: isDeleteLoading }] = useDeleteUserMutation();
    const [modifiedUserArray, setModifieduserArray] = useState([]);

    useEffect(() => {
        if (data && data?.success === true && Array.isArray(data?.data)) {
            const updatedArray = data?.data?.map((item) => ({
                ...item,
                key: item._id || "",
            }));

            setModifieduserArray(updatedArray);
        } else {
            setModifieduserArray([]);
        }
    }, [data?.data]);

    const [openModal, setOpenModal] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [form] = Form.useForm();

    // Modal handlers

    const handleCancel = () => {
        setOpenModal(false);
    };

    // CRUD Operations
    const handleAddUser = (values) => {
        const newUser = {
            ...values,
            key: Date.now().toString(),
        };
        setUsers([...users, newUser]);
        message.success("User added successfully");
        handleCancel();
    };

    const handleEditUser = (values) => {
        setUsers(
            users.map((user) =>
                user.key === currentUser.key ? { ...user, ...values } : user
            )
        );
        message.success("User updated successfully");
        handleCancel();
    };

    const handleDeleteUser = async (_id) => {
        try {
            const res = await deleteUser(_id).unwrap(); // unwrap extracts actual response or throws error
            console.log(res, "User deleted");
            toast.success("User deleted successfully");
        } catch (err) {
            console.error("Delete failed:", err);
            toast.error(err?.data?.message || "Failed to delete user");
        }
    };

    const onFinish = (values) => {
        currentUser ? handleEditUser(values) : handleAddUser(values);
    };

    // Table Columns
    const columns = [
        {
            title: "First Name",
            dataIndex: "first_name",
            render: (_, record) => `${record.first_name}`,
            sorter: (a, b) => a.first_name.localeCompare(b.first_name),
        },
        {
            title: "Last Name",
            dataIndex: "last_name",
            render: (_, record) => `${record.last_name} ${record.last_name}`,
            sorter: (a, b) => a.last_name.localeCompare(b.last_name),
        },
        {
            title: "Email",
            dataIndex: "email",
            sorter: (a, b) => a.email.localeCompare(b.email),
        },
        {
            title: "Role",
            dataIndex: "role",
            render: (role) => (
                <span className={`role-tag ${role}`}>
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                </span>
            ),
            //   filters: [
            //     { text: "Admin", value: "admin" },
            //     { text: "Editor", value: "editor" },
            //     { text: "Viewer", value: "viewer" },
            //   ],
            //   onFilter: (value, record) => record.role === value,
        },
        {
            title: "Contact",
            dataIndex: "contact_no",
            render: (_, record) => `${record.contact_no}`,
            sorter: (a, b) => a.contact_no.localeCompare(b.contact_no),
        },
        {
            title: "Address",
            dataIndex: "address",
            render: (_, record) => `${record.address}`,
            sorter: (a, b) => a.address.localeCompare(b.address),
        },
        {
            title: "Actions",
            key: "actions",
            render: (_, record) => (
                <Space size="middle">
                    <Button
                        type="primary"
                        icon={<EditOutlined />}
                        onClick={() => {
                            setOpenModal(true), setCurrentUser(record);
                        }}
                        className="edit-btn !bg-yellow-500"
                    >
                        Edit
                    </Button>
                    <Popconfirm
                        title="Are you sure to delete this user?"
                        onConfirm={() => handleDeleteUser(record._id)}
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
        // <div className="user-management-container">
        <div>
            <Card
                title="User Management"
                variant="outlined"
                extra={
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => {
                            setOpenModal(true), setCurrentUser(null);
                        }}
                        className="add-user-btn"
                    >
                        Add User
                    </Button>
                }
            >
                <Spin spinning={isLoading || isDeleteLoading} tip="loading data">
                    <Table
                        columns={columns}
                        dataSource={modifiedUserArray}
                        rowKey="key"
                        pagination={{ pageSize: 5 }}
                        className="user-table"
                        showSorterTooltip={false}
                    />
                </Spin>
            </Card>

            {openModal && (
                <AddUserModal
                    openModal={openModal}
                    setOpenModal={setOpenModal}
                    currentUser={currentUser}
                />
            )}
        </div>
    );
};

export default UserManagementContent;
