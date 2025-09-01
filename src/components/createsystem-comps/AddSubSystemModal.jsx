import { Form, Input, Select, Modal, Button } from "antd";
import React, { useEffect } from "react";
import toast from "react-hot-toast";
import { useGetSystemQuery } from "../../store/systemSlice";
import {
  useAddSubSystemMutation,
  //   useDeleteSystemMutation,
  useEditSubSystemMutation,
} from "../../store/subSystemSlice";

const AddSubSystemModal = ({ openModal, setOpenModal, currentSubSystem }) => {
  const [form] = Form.useForm();
  const { data } = useGetSystemQuery();
  const [addSubSystem, { isLoading: isAddLoading }] = useAddSubSystemMutation();
  const [updateSubSystem, { isLoading: isUpdateLoading }] =
    useEditSubSystemMutation();

  console.log(currentSubSystem, "data/////////////////");

  useEffect(() => {
    if (currentSubSystem) {
      form.setFieldsValue({
        system: currentSubSystem?.system?._id,
        name: currentSubSystem?.name,
        description: currentSubSystem?.description,
      });
    } else {
      form.resetFields();
    }
  }, [currentSubSystem, form]);

  // 🔹 Create handler
  const handleCreate = async (values) => {
    try {
      const response = await addSubSystem(values);
      if (response?.data?.success) {
        toast.success("Sub System created successfully");
        setOpenModal(false);
      } else {
        toast.error("Creation failed");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  // 🔹 Update handler
  const handleUpdate = async (values) => {
    try {
      const response = await updateSubSystem({
        id: currentSubSystem._id,
        name: values.name,
        description: values.description,
        systemId: values.system,
      });
      if (response?.data?.success) {
        toast.success("System updated successfully");
        setOpenModal(false);
      } else {
        toast.error("Update failed");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  // 🔹 Main submit decides Add or Update
  const handleSubmit = (values) => {
    if (currentSubSystem) {
      handleUpdate(values);
    } else {
      handleCreate(values);
    }
  };

  return (
    <Modal
      open={openModal}
      onCancel={() => setOpenModal(false)}
      footer={null}
      title={currentSubSystem ? "Edit Sub System" : "Add New Sub System"}
    >
      <Form form={form} onFinish={handleSubmit} layout="vertical">
        <Form.Item
          name="system"
          label="System"
          rules={[{ required: true, message: "Please select a system" }]}
        >
          <Select placeholder="Select system">
            {data?.data?.map((system) => (
              <Select.Option key={system._id} value={system._id}>
                {system.system_name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="name"
          label="Sub System Name"
          rules={[{ required: true, message: "Please enter sub system name" }]}
        >
          <Input placeholder="Enter system name" />
        </Form.Item>

        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true, message: "Please enter description" }]}
        >
          <Input.TextArea placeholder="Enter sub system description" rows={4} />
        </Form.Item>

        <Form.Item>
          <div className="flex justify-end gap-2">
            <Button onClick={() => setOpenModal(false)}>Cancel</Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={isAddLoading || isUpdateLoading}
            >
              {currentSubSystem ? "Update" : "Create"}
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddSubSystemModal;
