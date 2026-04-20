import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CiSettings, CiBellOn, CiMenuBurger, CiCircleRemove, CiLogout } from "react-icons/ci";
import { Button, Badge, Popover, Avatar, Popconfirm } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { motion } from "motion/react";
import { useSocket } from "../../context/SocketContext";
import { useAuth } from "../../context/Auth";
import { useUI } from "../../context/UIContext";
import axios from "axios";
import logo from "@/assets/logo.svg";

const Navbar = ({ searchTerm, setSearchTerm }) => {
  const { socket } = useSocket() || {};
  const { isAuth, handleLogout } = useAuth();
  const { openSidebar, closeSidebar, isSidebarVisible } = useUI();
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [unread, setUnread] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
    <motion.nav
      initial={{ y: -100, opacity: 0, x: "-50%" }}
      animate={{ y: 0, opacity: 1, x: "-50%" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={`navbar navbar-expand-lg floating-nav ${isScrolled ? "scrolled" : ""}`}
    >
      <div className="container-fluid p-0 d-flex align-items-center">
        <div className="d-flex align-items-center me-auto">
          {/* Mobile Sidebar Toggle Button - Only visible when < 786px and sidebar is hidden */}
          {windowWidth < 992 && (
            <Button
              icon={isSidebarVisible ? <CiCircleRemove className="fs-4" /> : <CiMenuBurger className="fs-4" />}
              shape="circle"
              className="nav-btn-glass me-2 p-0 border-0"
              style={{ width: "38px", height: "38px" }}
              onClick={isSidebarVisible ? closeSidebar : openSidebar}
            />
          )}

          <Link to="/" className="navbar-brand d-flex align-items-center">
            <motion.img
              whileHover={{ scale: 1.05 }}
              src={logo}
              alt="logo"
              style={{ height: "30px", width: "auto" }}
            />
          </Link>
        </div>

        <div className="ms-4 d-none d-lg-block">
          <Link to="/" className="nav-link-futuristic text-decoration-none">
            All Notes
          </Link>
        </div>

        <div className="d-flex align-items-center ms-auto gap-3">
          <div className="position-relative d-none d-md-block">
            <input
              className="form-control search-island rounded-pill py-2 px-4 shadow-none"
              type="search"
              placeholder="Search anything..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: "240px", fontSize: "14px" }}
            />
          </div>

          <div className="d-flex align-items-center gap-2">
            {isAuth && (
              <Popover
                content={popoverContent}
                title={<span className="fw-bold fs-6">Notifications</span>}
                trigger="click"
                placement="bottomRight"
              >
                <Badge count={unread} size="small" offset={[-4, 4]}>
                  <Button
                    icon={<CiBellOn className="fs-4" />}
                    shape="circle"
                    className="nav-btn-glass p-0 border-0"
                    style={{ width: "38px", height: "38px" }}
                  />
                </Badge>
              </Popover>
            )}

            <Button
              icon={<CiSettings className="fs-4" />}
              shape="circle"
              className="nav-btn-glass p-0 border-0"
              style={{ width: "38px", height: "38px" }}
              onClick={() => navigate("/setting")}
            />

            {isAuth && (
              <Popconfirm
                title="Logout"
                description="Are you sure you want to logout?"
                onConfirm={handleLogout}
                okText="Yes"
                cancelText="No"
                okButtonProps={{ danger: true }}
                icon={<QuestionCircleOutlined style={{ color: "red" }} />}
                placement="bottomRight"
              >
                <Button
                  icon={<CiLogout className="fs-4 text-danger" />}
                  shape="circle"
                  className="nav-btn-glass p-0 border-0"
                  style={{ width: "38px", height: "38px" }}
                />
              </Popconfirm>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
};
export default Navbar;
