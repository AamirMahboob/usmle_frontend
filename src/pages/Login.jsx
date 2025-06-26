import React, { useState } from 'react';
import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';
import {
    Button,
    Checkbox,
    Form,
    Input,
    Typography,
    ConfigProvider,
    Card,
    Flex
} from "antd";
import { useNavigate } from "react-router-dom";

import Cookies from 'js-cookie';
import { toast } from 'react-hot-toast';
import { useLoginMutation } from '../store/authSlice';

const { Title } = Typography;

export default function LoginUI() {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const [loginApi, { isLoading }] = useLoginMutation();

    const onFinish = async (values) => {
        console.log(values, "val");
        try {
            const response = await loginApi(values).unwrap();
            console.log(response, "response");

            if (response?.success === true) {
                Cookies.set('usmle_token', response.token);
                Cookies.set('usmle_user_info', JSON.stringify({
                    first_name: response?.data?.first_name,
                    last_name: response?.data?.last_name,
                    email: response?.data?.email,
                    role: response?.data?.role
                }));
                toast.success("Login Successfully");
                console.log("redirecting to dashboard")
                navigate('/dashboard');
            }
        } catch (error) {
            console.error("Login error:", error);
            const errorMsg =
                error?.data?.message ||
                error?.message ||
                "Login failed. Please try again.";
            toast.error(errorMsg);
        }
    };

    return (
        <ConfigProvider
            theme={{
                components: {
                    Form: {
                        labelRequiredMarkMarginInlineStart: '4px',
                        labelColor: 'rgba(0, 0, 0, 0.88)',
                    },
                },
            }}
            form={{
                requiredMark: (label, { required }) => (
                    <>
                        {label}
                        {required && <span className="text-red-500"> *</span>}
                    </>
                ),
            }}
        >
            <div className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600">
                <Flex justify="center" align="center" className="min-h-screen">
                    <Card
                        className="w-full max-w-md"
                        variant="borderless"
                        styles={{ body: { padding: 40 } }}
                    >
                        <Title level={2} className="mb-8">Sign In</Title>

                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={onFinish}
                            initialValues={{ remember: false }}
                            requiredMark="optional"
                        >
                            <Form.Item
                                label="Enter your email"
                                name="email"
                                rules={[
                                    { required: true, message: 'Please input your email!' },
                                    { type: 'email', message: 'Please enter a valid email!' }
                                ]}
                            >
                                <Input size="large" placeholder="Enter your email" />
                            </Form.Item>

                            <Form.Item
                                label="Enter your password"
                                name="password"
                                rules={[{ required: true, message: 'Please input your password!' }]}
                            >
                                <Input.Password
                                    size="large"
                                    placeholder="Enter your password"
                                    iconRender={(visible) =>
                                        visible ? <EyeOutlined /> : <EyeInvisibleOutlined />
                                    }
                                />
                            </Form.Item>

                            <Form.Item className="text-right mb-4">
                                <Button type="link" className="p-0 font-bold">
                                    Forgot Password?
                                </Button>
                            </Form.Item>

                            <Form.Item name="remember" valuePropName="checked">
                                <Checkbox>Remember me</Checkbox>
                            </Form.Item>

                            <Form.Item>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    size="large"
                                    loading={isLoading}
                                    block
                                    className="bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600"
                                >
                                    Sign In
                                </Button>
                            </Form.Item>
                        </Form>
                    </Card>
                </Flex>
            </div>
        </ConfigProvider>
    );
}
