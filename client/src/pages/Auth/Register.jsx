import { Button, Col, Form, Input, Row, Typography } from "antd";
import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import logo from "@/assets/logo.svg";

const { Title, Text } = Typography;

const initialState = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const Register = () => {
  const [state, setState] = useState(initialState);
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setState((s) => ({ ...s, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();

    let { name, email, password, confirmPassword } = state;

    name = name.trim();

    if (name.length < 3) {
      window.toastify("Please enter your full name", "error");
      return;
    }

    if (!window.isValidEmail(email)) {
      window.toastify("Invalid email address", "error");
      return;
    }

    if (password.length < 6) {
      window.toastify("Password must be at least 6 characters long", "error");
      return;
    }

    if (password !== confirmPassword) {
      window.toastify("Passwords do not match", "error");
      return;
    }

    const formData = { name, email, password };

    setIsProcessing(true);

    axios
      .post(`${window.api}/api/auth/register`, formData)
      .then((res) => {
        const { status, data } = res;
        if (status === 201) {
          window.toastify(data.message, "success");
          setState(initialState);
          navigate("/auth/login");
        }
      })
      .catch((err) => {
        console.error(err);
        const { status, data } = err.response;
        if (status === 400) {
          window.toastify(data.message, "error");
        } else {
          window.toastify("Something went wrong", "error");
        }
      })
      .finally(() => {
        setIsProcessing(false);
      });
  };

  return (
    <main className="futuristic-bg d-flex justify-content-center align-items-center min-vh-100 p-3">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, cubicBezier: [0.22, 1, 0.36, 1] }}
        className="glass-card w-100 p-4 p-md-5 shadow-lg position-relative z-1"
        style={{ maxWidth: "480px" }}
      >
        <div className="text-center mb-5">
          {/* Logo with slight animation */}
          <motion.div
            whileHover={{ rotate: -10, scale: 1.1 }}
            className="d-flex justify-content-center align-items-center mb-4"
          >
            <img src={logo} alt="Note App Logo" style={{ width: "120px" }} />
          </motion.div>

          <Title level={2} className="fw-bold text-dark mb-2" style={{ letterSpacing: "-0.5px" }}>
            Create Account
          </Title>
          <Text type="secondary" className="fs-6 opacity-75">
            Join our community and start organizing your life
          </Text>
        </div>

        <Form layout="vertical" size="large" onFinish={handleSubmit}>
          <Row gutter={16}>
            <Col xs={24}>
              <Form.Item
                label={<span className="fw-medium text-secondary small text-uppercase">Full Name</span>}
                className="mb-3"
              >
                <Input
                  type="text"
                  name="name"
                  placeholder="John Doe"
                  value={state.name}
                  onChange={handleChange}
                  className="auth-input rounded-3 py-2 px-3"
                />
              </Form.Item>
            </Col>
            <Col xs={24}>
              <Form.Item
                label={<span className="fw-medium text-secondary small text-uppercase">Email Address</span>}
                className="mb-3"
              >
                <Input
                  type="email"
                  name="email"
                  placeholder="name@company.com"
                  value={state.email}
                  onChange={handleChange}
                  className="auth-input rounded-3 py-2 px-3"
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label={<span className="fw-medium text-secondary small text-uppercase">Password</span>}
                className="mb-3"
              >
                <Input.Password
                  name="password"
                  placeholder="••••••••"
                  value={state.password}
                  onChange={handleChange}
                  className="auth-input rounded-3 py-2 px-3"
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label={<span className="fw-medium text-secondary small text-uppercase">Confirm</span>}
                className="mb-4"
              >
                <Input.Password
                  name="confirmPassword"
                  placeholder="••••••••"
                  value={state.confirmPassword}
                  onChange={handleChange}
                  className="auth-input rounded-3 py-2 px-3"
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item className="mb-0">
            <Button
              type="primary"
              htmlType="submit"
              loading={isProcessing}
              block
              onClick={handleSubmit}
              className="glow-button rounded-3 fw-bold fs-6 border-0 py-2"
              style={{
                backgroundColor: "#9333ea",
                height: "52px",
                fontSize: "1.1rem"
              }}
            >
              Get Started
            </Button>
          </Form.Item>
        </Form>

        <div className="text-center mt-5 pt-4 border-top border-light opacity-75">
          <Text className="small text-secondary">
            Already have an account?{" "}
            <Link
              to="/auth/login"
              className="text-primary fw-bold text-decoration-none ms-1"
            >
              Sign In
            </Link>
          </Text>
        </div>
      </motion.div>
    </main>
  );
};

export default Register;
