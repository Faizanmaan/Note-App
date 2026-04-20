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
    <main className="auth d-flex justify-content-center align-items-center min-vh-100 p-3">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="card w-100 p-4 p-md-5 border-light shadow-sm rounded-4"
        style={{ maxWidth: "440px" }}
      >
        <div className="text-center mb-4">
          {/* Logo */}
          <div className="d-flex justify-content-center align-items-center mb-3">
            <div>
              {" "}
              <img
                src={logo}
                alt=""
              />
            </div>
          </div>

          <Title level={3} className="fw-bold text-dark mb-1 fs-4">
            Create an account
          </Title>
          <Text type="secondary" className="small text-muted">
            Please fill in the details to register
          </Text>
        </div>

        <Form layout="vertical" size="large">
          <Form.Item
            label={<span className="fw-normal text-secondary">Name:</span>}
          >
            <Input
              type="text"
              name="name"
              placeholder="Full Name"
              value={state.name}
              onChange={handleChange}
              className="rounded-3 bg-light py-2"
            />
          </Form.Item>

          <Form.Item
            label={
              <span className="fw-normal text-secondary">Email Address:</span>
            }
          >
            <Input
              type="email"
              name="email"
              placeholder="email@example.com"
              value={state.email}
              onChange={handleChange}
              className="rounded-3 bg-light py-2"
            />
          </Form.Item>

          <Form.Item
            label={<span className="fw-normal text-secondary">Password:</span>}
          >
            <Input.Password
              name="password"
              placeholder="********"
              value={state.password}
              onChange={handleChange}
              className="rounded-3 bg-light py-2"
            />
          </Form.Item>

          <Form.Item
            label={
              <span className="fw-normal text-secondary">
                Confirm Password:
              </span>
            }
            className="mb-4"
          >
            <Input.Password
              name="confirmPassword"
              placeholder="********"
              value={state.confirmPassword}
              onChange={handleChange}
              className="rounded-3 bg-light py-2"
            />
          </Form.Item>

          <Form.Item className="mb-0">
            <Button
              type="primary"
              htmlType="submit"
              loading={isProcessing}
              block
              onClick={handleSubmit}
              className="rounded-3 fw-bold fs-6 border-0 py-2"
              style={{ backgroundColor: "#9333ea", height: "46px" }}
            >
              Sign Up
            </Button>
          </Form.Item>
        </Form>

        <div className="text-center mt-4">
          <Text className="small text-muted">
            Already have an account?{" "}
            <Link
              to="/auth/login"
              className="text-primary fw-bold text-decoration-none"
            >
              Login
            </Link>
          </Text>
        </div>
      </motion.div>
    </main>
  );
};

export default Register;
