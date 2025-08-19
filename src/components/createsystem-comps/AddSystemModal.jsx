import { Form, Input, Select, Modal, Button } from "antd";
import React, { useEffect } from "react";
import toast from "react-hot-toast";
import { useGetSubjectsQuery } from "../../store/subjectSlice";
import { useAddSystemMutation, useDeleteSystemMutation, useEditSystemMutation } from "../../store/systemSlice";

const AddSystemModal = ({
    openModal,
    setOpenModal,
    currentSystem,
    setSystems,
}) => {
    const [form] = Form.useForm();
    const { data } = useGetSubjectsQuery();
    const [addSystem, { isLoading: isAddLoading }] = useAddSystemMutation();
    const [updateSystem, { isLoading: isUpdateLoading }] = useEditSystemMutation();
    const [deletSystem] = useDeleteSystemMutation()


    // Pre-fill form on edit
    useEffect(() => {
        if (currentSystem) {
            form.setFieldsValue({
                subject: currentSystem?.subject?._id,
                system_name: currentSystem?.system_name,
                system_description: currentSystem?.system_description,
            });
        } else {
            form.resetFields();
        }
    }, [currentSystem, form]);

    // 🔹 Create handler
    const handleCreate = async (values) => {
        try {
            const response = await addSystem(values);
            if (response?.data?.success) {
                toast.success("System created successfully");
                setOpenModal(false);

                if (setSystems) {
                    setSystems((prev) => [...prev, response.data.data]);
                }
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
            const response = await updateSystem({ id: currentSystem._id, ...values });
            if (response?.data?.success) {
                toast.success("System updated successfully");
                setOpenModal(false);

                if (setSystems) {
                    setSystems((prev) =>
                        prev.map((sys) =>
                            sys._id === currentSystem._id ? { ...sys, ...values } : sys
                        )
                    );
                }
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
        if (currentSystem) {
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
            title={currentSystem ? "Edit System" : "Add New System"}
        >
            <Form form={form} onFinish={handleSubmit} layout="vertical">
                <Form.Item
                    name="subject"
                    label="Subject"
                    rules={[{ required: true, message: "Please select a subject" }]}
                >
                    <Select placeholder="Select subject">
                        {data?.data?.map((subject) => (
                            <Select.Option key={subject._id} value={subject._id}>
                                {subject.subject}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item
                    name="system_name"
                    label="System Name"
                    rules={[{ required: true, message: "Please enter system name" }]}
                >
                    <Input placeholder="Enter system name" />
                </Form.Item>

                <Form.Item
                    name="system_description"
                    label="Description"
                    rules={[{ required: true, message: "Please enter description" }]}
                >
                    <Input.TextArea placeholder="Enter system description" rows={4} />
                </Form.Item>

                <Form.Item>
                    <div className="flex justify-end gap-2">
                        <Button onClick={() => setOpenModal(false)}>Cancel</Button>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={isAddLoading || isUpdateLoading}
                        >
                            {currentSystem ? "Update" : "Create"}
                        </Button>
                    </div>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default AddSystemModal;
