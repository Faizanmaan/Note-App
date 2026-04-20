import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/Auth";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../../context/SocketContext";
import { CiBellOn } from "react-icons/ci";
import {
  Button,
  Card,
  Typography,
  Breadcrumb,
  Form,
  Input,
  Select,
  Avatar,
  Popover,
  Badge,
  Popconfirm,
} from "antd";
import { QuestionCircleOutlined, LogoutOutlined } from "@ant-design/icons";
import axios from "axios";
import Header from "../../components/Header";

const { Title, Text } = Typography;

const Setting = () => {
  const { user, isAuth, handleLogout, dispatch } = useAuth();
  const navigate = useNavigate();
  const { socket } = useSocket() || {};
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const [notifications, setNotifications] = useState([]);
  const [unread, setUnread] = useState(0);

  // Initialize form with user data
  useEffect(() => {
    if (user && Object.keys(user).length > 0) {
      form.setFieldsValue(user);
    }
  }, [user, form]);

  const fetchNotifs = async () => {
    try {
      if (!isAuth) return;
      const res = await axios.get(
        `${window.api}/api/notifications/my-notifications`,
        { headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` } },
      );
      setNotifications(res.data.notifications);
      setUnread(res.data.notifications.filter((n) => !n.isRead).length);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (isAuth) fetchNotifs();
  }, [isAuth]);

  useEffect(() => {
    if (socket) {
      socket.on("new_notification", (notif) => {
        window.toastify("New notification!", "info");
        setNotifications((prev) => [notif, ...prev]);
        setUnread((prev) => prev + 1);
      });
    }
    return () => {
      if (socket) socket.off("new_notification");
    };
  }, [socket]);

  const markAsRead = async (id) => {
    try {
      await axios.patch(
        `${window.api}/api/notifications/read/${id}`,
        {},
        { headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` } },
      );
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n)),
      );
      setUnread((prev) => Math.max(0, prev - 1));
    } catch (err) {}
  };

  const handleUpdate = async (values) => {
    try {
      setLoading(true);
      const res = await axios.patch(
        `${window.api}/api/auth/update-user`,
        values,
        { headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` } },
      );

      if (!res.data.isError) {
        window.toastify("Profile updated successfully!", "success");
        dispatch({ type: "SET_PROFILE", payload: res.data.user });
      }
    } catch (err) {
      console.error(err);
      window.toastify("Failed to update profile", "error");
    } finally {
      setLoading(false);
    }
  };

  const popoverContent = (
    <div
      style={{ width: "300px", maxHeight: "400px", overflowY: "auto" }}
      className="p-2"
    >
      {notifications.length === 0 ? (
        <div className="text-center py-4 text-muted">No notifications</div>
      ) : (
        notifications.map((item) => (
          <div
            key={item._id}
            className={`cursor-pointer p-2 mb-2 rounded-3 d-flex align-items-start gap-3 transition-all ${
              !item.isRead
                ? "bg-primary bg-opacity-10"
                : "hover-bg-light border-bottom"
            }`}
            onClick={() => {
              if (!item.isRead) markAsRead(item._id);
            }}
            style={{ transition: "background 0.2s" }}
          >
            <Avatar
              style={{ backgroundColor: "#9333ea", flexShrink: 0 }}
              icon={<CiBellOn className="text-white" />}
            />
            <div className="flex-grow-1 overflow-hidden">
              <div
                className={`small text-wrap ${!item.isRead ? "fw-bold text-dark" : "text-muted"}`}
                style={{ fontSize: "13px", lineHeight: "1.4" }}
              >
                {item.message}
              </div>
              <div
                style={{ fontSize: "10px" }}
                className="text-secondary mt-1 d-block"
              >
                {new Date(item.createdAt).toLocaleString()}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );

  return (
    <div className="futuristic-bg min-vh-100">
      <Header />

      <div className="container mt-5 pt-5">
        <div className="row">
          {/* Main Content Area */}
          <div className="col">
            {/* Header */}
            <header className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
              <div>
                <Title level={4} className="m-0 fw-bold">
                  Welcome,{" "}
                  <span className="text-primary text-capitalize">
                    {user.name}
                  </span>
                </Title>
                <Text type="secondary" style={{ fontSize: "14px" }}>
                  {new Date().toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </Text>
              </div>
            </header>

            {/* Breadcrumb Section */}
            <div className="mb-4 bg-white p-3 rounded-4 shadow-sm border border-light">
              <Breadcrumb
                items={[
                  { title: "Home", onClick: () => navigate("/") },
                  { title: "Settings" },
                  { title: <span className="text-primary fw-bold">All</span> },
                ]}
                className="fw-medium"
              />
            </div>

            {/* Content Card */}
            <Card className="rounded-4 shadow-sm border-0 overflow-hidden mb-4">
              {/* Profile Header Banner */}
              <div
                className="p-4 d-flex flex-column flex-sm-row justify-content-between align-items-center gap-4 mb-4 rounded-4"
                style={{
                  background:
                    "linear-gradient(90deg, #f8f9fa 0%, #e9ecef 100%)",
                }}
              >
                <div className="d-flex align-items-center gap-4">
                  <div className="position-relative">
                    <Avatar
                      size={100}
                      src={user.avatar}
                      style={{ backgroundColor: "#9333ea" }}
                      className="border border-4 border-white shadow-sm"
                    >
                      {user.name ? user.name[0].toUpperCase() : "U"}
                    </Avatar>
                  </div>
                  <div className="text-center text-sm-start">
                    <Title level={4} className="m-0 fw-bold">
                      {user.name}
                    </Title>
                    <Text type="secondary">{user.email}</Text>
                  </div>
                </div>
              </div>

              {/* Form Section */}
              <Form
                form={form}
                layout="vertical"
                className="px-2 pb-4"
                onFinish={handleUpdate}
                initialValues={user}
              >
                <div className="row g-4">
                  <div className="col-12 col-md-6">
                    <Form.Item
                      name="name"
                      label={
                        <span className="fw-bold text-muted small text-uppercase">
                          Full Name
                        </span>
                      }
                      rules={[{ required: true, message: "Name is required" }]}
                    >
                      <Input
                        size="large"
                        className="bg-light border-0 rounded-3 text-dark focus-ring focus-ring-primary"
                      />
                    </Form.Item>
                  </div>
                  <div className="col-12 col-md-6">
                    <Form.Item
                      name="nickname"
                      label={
                        <span className="fw-bold text-muted small text-uppercase">
                          Nickname
                        </span>
                      }
                    >
                      <Input
                        placeholder="e.g. Uzair"
                        size="large"
                        className="bg-light border-0 rounded-3 text-dark focus-ring focus-ring-primary"
                      />
                    </Form.Item>
                  </div>
                  <div className="col-12 col-md-6">
                    <Form.Item
                      name="gender"
                      label={
                        <span className="fw-bold text-muted small text-uppercase focus-ring focus-ring-primary">
                          Gender
                        </span>
                      }
                    >
                      <Select
                        placeholder="Select Gender"
                        size="large"
                        className="bg-light border-0 rounded-3 w-100 focus-ring focus-ring-primary"
                        options={[
                          { value: "male", label: "Male" },
                          { value: "female", label: "Female" },
                          { value: "other", label: "Other" },
                        ]}
                      />
                    </Form.Item>
                  </div>
                  <div className="col-12 col-md-6">
                    <Form.Item
                      name="phone"
                      label={
                        <span className="fw-bold text-muted small text-uppercase">
                          Phone
                        </span>
                      }
                    >
                      <Input
                        placeholder="Enter Phone Number"
                        size="large"
                        className="bg-light border-0 rounded-3 text-dark focus-ring focus-ring-primary"
                      />
                    </Form.Item>
                  </div>
                  <div className="col-12 col-md-6">
                    <Form.Item
                      name="address"
                      label={
                        <span className="fw-bold text-muted small text-uppercase">
                          Address
                        </span>
                      }
                    >
                      <Input
                        placeholder="Enter Address"
                        size="large"
                        type="text"
                        className="bg-light border-0 rounded-3 text-dark focus-ring focus-ring-primary"
                      />
                    </Form.Item>
                  </div>
                  <div className="col-12 text-end mt-4">
                    <Button
                      type="primary"
                      htmlType="submit"
                      loading={loading}
                      className="rounded-3 px-5 shadow-sm fw-bold border-0"
                      size="large"
                      style={{ backgroundColor: "#9333ea" }}
                    >
                      Update Profile
                    </Button>
                  </div>
                </div>
              </Form>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Setting;
