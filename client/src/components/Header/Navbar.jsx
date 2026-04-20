import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CiSettings, CiBellOn } from "react-icons/ci";
import { Button, Badge, Popover, Avatar } from "antd";
import { motion } from "motion/react";
import { useSocket } from "../../context/SocketContext";
import { useAuth } from "../../context/Auth";
import axios from "axios";
import logo from "@/assets/logo.svg";

const Navbar = ({ searchTerm, setSearchTerm }) => {
  const { socket } = useSocket() || {};
  const { isAuth } = useAuth();
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [unread, setUnread] = useState(0);

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
    <>
      <motion.nav
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="navbar navbar-expand-lg bg-body-tertiary py-3 sticky-top border-bottom border-light shadow-sm"
      >
        <div className="container">
          <Link to="/" className="navbar-brand">
            <img
              src={logo}
              alt="logo"
            />
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link
                  to="/"
                  className="nav-link active fw-bold fs-5 mt-2 ms-4"
                  aria-current="page"
                >
                  All Notes
                </Link>
              </li>
            </ul>
            <div className="d-flex align-items-center">
              <input
                className="form-control me-2 rounded-pill py-2 px-3 focus-ring focus-ring-primary bg-light border-0 shadow-sm"
                type="search"
                placeholder="Search by title or tags..."
                style={{ width: "300px" }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {isAuth && (
                <Popover
                  content={popoverContent}
                  title={<span className="fw-bold fs-6">Notifications</span>}
                  trigger="click"
                  placement="bottomRight"
                >
                  <Badge count={unread} size="small" offset={[-5, 5]}>
                    <Button
                      icon={<CiBellOn className="fs-4 text-dark" />}
                      shape="circle"
                      className="ms-3 p-3 d-flex justify-content-center align-items-center shadow-sm border-0 bg-white"
                    />
                  </Badge>
                </Popover>
              )}
              <Button
                icon={<CiSettings className="fs-4 text-dark" />}
                shape="circle"
                className="ms-2 p-3 d-flex justify-content-center align-items-center border-0 bg-white shadow-sm"
                onClick={() => navigate("/setting")}
              />
            </div>
          </div>
        </div>
      </motion.nav>
    </>
  );
};
export default Navbar;
