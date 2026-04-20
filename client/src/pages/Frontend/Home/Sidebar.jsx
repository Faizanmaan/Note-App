import React, { useState, useEffect, useMemo } from "react";
import { Menu, Badge } from "antd";
import axios from "axios";
import { useAuth } from "../../../context/Auth";
import { useSocket } from "../../../context/SocketContext";

const Sidebar = ({ activeCategory, setActiveCategory }) => {
  const [counts, setCounts] = useState({ all: 0, shared: 0, favorites: 0 });
  const { user } = useAuth();
  const { socket } = useSocket() || {};

  const fetchCounts = async () => {
    try {
      const [myRes, sharedRes] = await Promise.all([
        axios.get(`${window.api}/api/notes/my-notes`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` },
        }),
        axios.get(`${window.api}/api/notes/shared`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` },
        }),
      ]);
      const myNotes = myRes.data.notes || [];
      const sharedNotes = sharedRes.data.notes || [];
      const allMixed = [...myNotes, ...sharedNotes].filter(
        (v, i, a) => a.findIndex((t) => t._id === v._id) === i,
      ); // Ensure unique

      setCounts({
        all: myNotes.length,
        shared: sharedNotes.length,
        favorites: allMixed.filter(
          (n) =>
            n.isFavoriteBy &&
            n.isFavoriteBy.some((id) => id.toString() === user._id),
        ).length,
      });
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (user && user._id) fetchCounts();
  }, [user]);

  useEffect(() => {
    if (socket) socket.on("note_updated", fetchCounts);
    return () => {
      if (socket) socket.off("note_updated", fetchCounts);
    };
  }, [socket]);

  const items = [
    {
      key: "all",
      label: (
        <div className="d-flex justify-content-between align-items-center w-100">
          All Notes{" "}
          <Badge
            count={counts.all}
            style={{ backgroundColor: "#e2e8f0", color: "#475569" }}
          />
        </div>
      ),
    },
    {
      key: "favorites",
      label: (
        <div className="d-flex justify-content-between align-items-center w-100">
          Favorites{" "}
          <Badge
            count={counts.favorites}
            style={{ backgroundColor: "#fef08a", color: "#854d0e" }}
          />
        </div>
      ),
    },
    { type: "divider" },
    {
      key: "shared",
      label: (
        <div className="d-flex justify-content-between align-items-center w-100">
          Shared with me{" "}
          <Badge
            count={counts.shared}
            style={{ backgroundColor: "#bfdbfe", color: "#1d4ed8" }}
          />
        </div>
      ),
    },
  ];

  return (
    <div
      className="h-100 bg-white border-end"
      style={{ width: "260px", overflowY: "hidden" }}
    >
      <div className="p-3">
        <h6
          className="text-primary fw-bold mb-3 px-3 small text-uppercase"
          style={{ letterSpacing: "1px" }}
        >
          Categories
        </h6>
        <Menu
          mode="inline"
          selectedKeys={[activeCategory]}
          onClick={(e) => setActiveCategory(e.key)}
          items={items}
          className="border-0 bg-transparent fw-medium"
        />
      </div>
    </div>
  );
};

export default Sidebar;
