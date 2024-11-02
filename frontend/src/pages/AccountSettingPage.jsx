// src/pages/AccountSettingPage.jsx
import React, { useState, useEffect } from "react";
import { Form, Input, Button, message, Row, Col } from "antd";
import axios from "axios";
import Header from "../Header"; // 引入 Header 组件
import "./AccountSettingPage.css"; // 引入样式

const AccountSettingPage = () => {
  const [form] = Form.useForm();

  useEffect(() => {
    // 假设加载用户数据的函数
    const fetchUserData = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/user"); // 替换为实际的 API URL
        form.setFieldsValue(response.data);
      } catch (error) {
        message.error("Failed to load user data.");
      }
    };

    fetchUserData();
  }, [form]);

  const onFinish = async (values) => {
    try {
      await axios.put("http://localhost:8000/api/user", values); // 替换为实际的 API URL
      message.success("Settings updated successfully!");
    } catch (error) {
      message.error("Failed to update settings.");
    }
  };

  return (
    <div>
      <Header /> {/* 顶部导航栏 */}
      <div className="account-settings-container">
        <h2>Account Settings</h2>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          className="account-settings-form"
        >
          <Row gutter={24}>
            <Col xs={24} md={12}>
              <Form.Item
                label="First Name"
                name="firstName"
                rules={[{ required: true, message: "Please enter your first name." }]}
              >
                <Input placeholder="First Name" />
              </Form.Item>

              <Form.Item
                label="Last Name"
                name="lastName"
                rules={[{ required: true, message: "Please enter your last name." }]}
              >
                <Input placeholder="Last Name" />
              </Form.Item>

              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: "Please enter your email." },
                  { type: "email", message: "Please enter a valid email." },
                ]}
              >
                <Input placeholder="Email" />
              </Form.Item>

              <Form.Item
                label="Phone"
                name="phone"
                rules={[{ required: true, message: "Please enter your phone number." }]}
              >
                <Input placeholder="Phone" />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                label="Street Address"
                name={["address", "street"]}
                rules={[{ required: true, message: "Please enter your street address." }]}
              >
                <Input placeholder="Street Address" />
              </Form.Item>

              <Form.Item
                label="City"
                name={["address", "city"]}
                rules={[{ required: true, message: "Please enter your city." }]}
              >
                <Input placeholder="City" />
              </Form.Item>

              <Form.Item
                label="State"
                name={["address", "state"]}
                rules={[{ required: true, message: "Please enter your state." }]}
              >
                <Input placeholder="State" />
              </Form.Item>

              <Form.Item
                label="Zip Code"
                name={["address", "zipCode"]}
                rules={[{ required: true, message: "Please enter your zip code." }]}
              >
                <Input placeholder="Zip Code" />
              </Form.Item>

              <Form.Item
                label="Country"
                name={["address", "country"]}
                rules={[{ required: true, message: "Please enter your country." }]}
              >
                <Input placeholder="Country" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
              Save Changes
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default AccountSettingPage;
