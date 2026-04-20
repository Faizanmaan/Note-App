import { Button, Col, Form, Input, Row, Typography } from "antd";
import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/Auth";
import { motion } from "motion/react";
import logo from "@/assets/logo.svg";

const { Title, Text } = Typography;

const initialState = {
  email: "",
  password: "",
};

const Login = () => {
  const [state, setState] = useState(initialState);
  const [isProcessing, setIsProcessing] = useState(false);

  const navigate = useNavigate();
  const { readProfile } = useAuth();

  const handleChange = (e) =>
    setState((s) => ({ ...s, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();

    let { email, password } = state;

    if (!window.isValidEmail(email)) {
      window.toastify("Invalid email address", "error");
      return;
    }

    const formData = { email, password };

    setIsProcessing(true);

    axios
      .post(`${window.api}/api/auth/login`, formData)
      .then((res) => {
        const { status, data } = res;
        if (status === 200) {
          const { token } = data;
          localStorage.setItem("jwt", token);
          window.toastify(data.message, "success");
          readProfile(token);
          setState(initialState);
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
            Welcome to Note
          </Title>
          <Text type="secondary" className="small text-muted">
            Please log in to continue
          </Text>
        </div>

        <Form layout="vertical" size="large">
          <Form.Item
            label={
              <span className="fw-normal text-secondary mb-0">
                Email Address:
              </span>
            }
            className="mb-3"
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

          <div className="d-flex w-100 align-items-center mb-1">
            <span className="fw-normal text-secondary">Password:</span>

            <Link
              to="/auth/forgot-password"
              className="ms-auto text-primary text-decoration-underline"
              style={{ fontSize: "12px" }}
            >
              Forgot?
            </Link>
          </div>

          <Form.Item className="mb-4 w-100">
            <Input.Password
              name="password"
              placeholder="********"
              value={state.password}
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
              Login
            </Button>
          </Form.Item>
        </Form>

        <div className="text-center mt-4 pt-4 border-top">
          <Text className="small text-muted">
            No account yet?{" "}
            <Link
              to="/auth/register"
              className="text-primary fw-bold text-decoration-none"
            >
              Sign Up
            </Link>
          </Text>
        </div>
      </motion.div>
    </main>
  );
};

export default Login;
