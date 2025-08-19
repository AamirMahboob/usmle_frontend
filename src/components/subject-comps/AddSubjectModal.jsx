import { UserOutlined } from "@ant-design/icons";
import { Button, Form, Input } from "antd";
import Modal from "antd/es/modal/Modal";
import React, { useEffect } from "react";
import {
  useAddSubjectMutation,
  useEditSubjectMutation,
} from "../../store/subjectSlice";
import toast from "react-hot-toast";

const AddSubjectModal = ({ openModal, setOpenModal, currentSubject }) => {
  const [form] = Form.useForm();
  const [addSubjectApi, { error: addSubjectError, isLoading }] =
    useAddSubjectMutation();
  const [editSubjectApi, { isLoading: isEditLoading }] =
    useEditSubjectMutation();

  const addSubjectFunction = async (values) => {
    try {
      let subjectFormData = {
        subject: values.subject,
      };

      const response = await addSubjectApi(subjectFormData);

      if (response?.data?.success === true) {
        setOpenModal(false);
        toast.success("Subject Added Successfully");
      }
      if (response.data.success === false) {
        toast.error(response?.data?.message || "Subject Added Successfully");
      }
    } catch (error) {
      toast.error("some thing went wrong");
    }
  };
  const editSubjectFunction = async (values) => {
    try {
      let subjectFormData = {
        _id: currentSubject._id,
        subject: values.subject,
      };

      const response = await editSubjectApi(subjectFormData);

      if (response.data.success === true) {
        setOpenModal(false);
        toast.success("Subject Edited Successfully");
      }
      if (response.data.success === false) {
        toast.error(response?.data?.message || "Subject Edited Successfully");
      }
    } catch (error) {
      toast.error("some thing went wrong");
    }
  };

  const onFinish = (values) => {
    if (currentSubject?.key) {
      editSubjectFunction(values);
    } else {
      addSubjectFunction(values);
    }
  };

  useEffect(() => {
    if (currentSubject?.key) {
      form.setFieldsValue({
        subject: currentSubject.subject || "",
      });
    }
  }, [currentSubject?.key]);

  return (
    <Modal open={openModal} onCancel={() => setOpenModal(false)} footer={null}>
      <Form form={form} name="userForm" onFinish={onFinish} layout="vertical">
        <Form.Item
          name="subject"
          label="Subject"
          rules={[{ required: true, message: "Please Add Subject" }]}
          className="form-item"
        >
          <Input prefix={<UserOutlined />} placeholder="Add Subject" />
        </Form.Item>
        <Form.Item>
          <div className="form-actions flex gap-1">
            <Button onClick={() => setOpenModal(false)}>Cancel</Button>
            <Button
              className=""
              type="primary"
              htmlType="submit"
              loading={isLoading || isEditLoading}
            >
              {currentSubject?.key ? "Update" : "Create"}
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddSubjectModal;
