"use client";
import React, { useEffect } from "react";
import { Modal, Form, Input, Select, Button, Checkbox } from "antd";

import {
  UserOutlined,
  MailOutlined,
  LockOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import {
  useAddUserMutation,
  useEditUserMutation,
} from "../../store/userApiSlice";
import toast from "react-hot-toast";

const { Option } = Select;

const { TextArea } = Input;

const AddUserModal = ({ openModal, setOpenModal, currentUser }) => {
  const [addUserApi, { error: addUserError, isLoading }] = useAddUserMutation();
  const [editUserApi, { isLoading: isEditLoading }] = useEditUserMutation();
  const [form] = Form.useForm();

  useEffect(() => {
    if (currentUser?.key) {
      form.setFieldsValue({
        first_name: currentUser?.first_name || "",
        last_name: currentUser?.last_name || "",
        email: currentUser?.email || "",
        role: currentUser?.role || "",
        password: currentUser?.password,
        contact_no: currentUser?.contact_no || "",
        address: currentUser.address || "",
      });
    }
  }, [currentUser?.key]);

  const addUser = async (user) => {
    let userFormData = {
      first_name: user.first_name,
      last_name: user.last_name,
      address: user.address,
      email: user.email,
      contact_no: user.contact_no,
      password: user.password,
      role: user.role,
    };

    console.log(userFormData, "userFormData");

    try {
      const response = await addUserApi(userFormData);
      console.log(response, "response");
      setOpenModal(false);
      form.resetFields();
      toast.success("User Added Successfully");
    } catch (error) {
      toast.error("some thing went wrong");
    }
  };

  const editUser = async (values) => {
    try {
      let userFormData = {
        _id: currentUser._id,
        first_name: values.first_name,
        last_name: values.last_name,
        address: values.address,
        email: values.email,
        contact_no: values.contact_no,
        password: values.password,
        role: values.role,
      };

      const response = await editUserApi(userFormData);
      setOpenModal(false);
      toast.success("User Updated Successfully");
    } catch (error) {
      console.log(error, "edit User Error");
      toast.error("Some thing went Wrong");
    }
  };

  const onFinish = (values) => {
    if (currentUser?._id) {
      editUser(values);
    } else {
      addUser(values);
    }
  };

  return (
    <Modal
      title={currentUser?._id ? "Edit User" : "Add User"}
      open={openModal}
      onCancel={() => setOpenModal(false)}
      footer={null}
    >
      <Form form={form} name="userForm" onFinish={onFinish} layout="vertical">
        <div className="form-row">
          <Form.Item
            name="first_name"
            label="First Name"
            rules={[{ required: true, message: "Please input first name!" }]}
            className="form-item"
          >
            <Input prefix={<UserOutlined />} placeholder="First Name" />
          </Form.Item>
          <Form.Item
            name="last_name"
            label="Last Name"
            rules={[{ required: true, message: "Please input last name!" }]}
            className="form-item"
          >
            <Input placeholder="Last Name" />
          </Form.Item>
        </div>

        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: "Please input email!" },
            { type: "email", message: "Please enter valid email!" },
          ]}
        >
          <Input prefix={<MailOutlined />} placeholder="Email" />
        </Form.Item>

        <Form.Item
          name="role"
          label="Role"
          rules={[{ required: true, message: "Please select role!" }]}
        >
          <Select placeholder="Select role">
            <Option value="admin">Admin</Option>
            <Option value="editor">Editor</Option>
            <Option value="viewer">Viewer</Option>
          </Select>
        </Form.Item>

        {!currentUser?._id && (
          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: "Please input password!" }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Password" />
          </Form.Item>
        )}

        <Form.Item
          name="contact_no"
          label="Contact Number"
          rules={[
            { required: true, message: "Please input contact number!" },
            {
              pattern: /^(03\d{9}|923\d{9})$/,
              message:
                "Enter a valid Pakistani contact number (03XXXXXXXXX or 923XXXXXXXXX)",
            },
          ]}
        >
          <Input prefix={<PhoneOutlined />} placeholder="Contact Number" />
        </Form.Item>

        <Form.Item
          name="address"
          label="Address"
          rules={[{ required: true, message: "Please input address!" }]}
        >
          <TextArea
            rows={3}
            prefix={<EnvironmentOutlined />}
            placeholder="Address"
          />
        </Form.Item>

        <Form.Item>
          <div className="form-actions">
            <Button onClick={() => setOpenModal(false)}>Cancel</Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={isLoading || isEditLoading}
            >
              {currentUser?._id ? "Update" : "Create"}
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddUserModal;
