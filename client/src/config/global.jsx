import { message } from "antd";

window.toastify = (msg, type) => message[type](msg);

window.getRandomId = () =>
  Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);

window.isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

window.api = import.meta.env.VITE_API_URL;
