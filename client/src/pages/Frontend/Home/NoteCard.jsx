import React, { useState } from "react";
import { Avatar, Tooltip, Tag, Dropdown, Popconfirm } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { motion } from "motion/react";
import {
  DeleteOutlined,
  ShareAltOutlined,
  EditOutlined,
  StarOutlined,
  StarFilled,
} from "@ant-design/icons";
import { useAuth } from "../../../context/Auth";
import axios from "axios";
import ShareModal from "./ShareModal";
import EditModal from "./EditModal";

const NoteCard = ({ note, onRefresh }) => {
  const { user } = useAuth();
  const [shareOpen, setShareOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const isOwner =
    note.creator._id === user._id ||
    note.creator.uid === user.uid ||
    note.creator === user._id;
  const isSharedEditor =
    note.sharedWith &&
    note.sharedWith.some(
      (s) => s.userId._id === user._id && s.permission === "editor",
    );
  const canEdit = isOwner || isSharedEditor;
  const isFavorite = note.isFavoriteBy && note.isFavoriteBy.some(id => (id._id || id).toString() === user?._id);

  const handleDelete = async () => {
    if (!isOwner)
      return window.toastify("Only the owner can delete this note", "error");
    try {
      await axios.delete(`${window.api}/api/notes/delete/${note._id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` },
      });
      window.toastify("Deleted successfully", "success");
      onRefresh();
    } catch (err) {
      window.toastify("Failed to delete", "error");
    }
  };

  const handleFavoriteToggle = async () => {
    try {
      await axios.patch(
        `${window.api}/api/notes/favorite/${note._id}`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` },
        },
      );
      onRefresh();
    } catch (err) {
      console.error(err);
    }
  };

  const menuItems = [
    ...(canEdit
      ? [
          {
            key: "edit",
            label: "Edit Note",
            icon: <EditOutlined />,
            onClick: () => setEditOpen(true),
          },
        ]
      : []),
    ...(isOwner
      ? [
          {
            key: "share",
            label: "Share",
            icon: <ShareAltOutlined />,
            onClick: () => setShareOpen(true),
          },
        ]
      : []),
    ...(isOwner
      ? [
          { type: "divider" },
          {
            key: "delete",
            label: (
              <Popconfirm
                title="Delete this note?"
                description="This action cannot be undone."
                onConfirm={handleDelete}
                okText="Delete"
                cancelText="Cancel"
                okButtonProps={{ danger: true }}
                icon={<QuestionCircleOutlined style={{ color: "red" }} />}
              >
                <div className="text-danger fw-medium" onClick={(e) => e.stopPropagation()}>
                    Delete
                </div>
              </Popconfirm>
            ),
            icon: <DeleteOutlined className="text-danger" />,
          },
        ]
      : []),
  ];

  return (
    <>
      <motion.div
        whileHover={{ y: -4 }}
        className="glass-card shadow-sm h-100 overflow-hidden"
        style={{ transition: "all 0.3s ease" }}
      >
        <div className="card-body p-4 d-flex flex-column bg-transparent">
          <div className="d-flex justify-content-between align-items-start mb-3">
            <h5
              className="card-title fw-bold text-dark text-truncate mb-0"
              style={{ maxWidth: "70%" }}
            >
              {note.title}
            </h5>
            <div className="d-flex align-items-center gap-2">
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  handleFavoriteToggle();
                }}
                className="cursor-pointer"
              >
                {isFavorite ? (
                  <StarFilled
                    className="text-warning fs-5"
                    style={{ cursor: "pointer" }}
                  />
                ) : (
                  <StarOutlined
                    className="text-muted fs-5"
                    style={{ cursor: "pointer" }}
                  />
                )}
              </div>
              {(isOwner || canEdit) && menuItems.length > 0 && (
                <Dropdown
                  menu={{ items: menuItems }}
                  trigger={["click"]}
                  placement="bottomRight"
                >
                  <div
                    className="cursor-pointer text-muted p-1 hover-bg-light rounded-circle text-center d-flex justify-content-center align-items-center"
                    style={{ width: "28px", height: "28px", cursor: "pointer" }}
                  >
                    &#8942;
                  </div>
                </Dropdown>
              )}
            </div>
          </div>

          <div
            className="card-text text-muted mb-4 small flex-grow-1"
            style={{
              maxHeight: "80px",
              overflow: "hidden",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              display: "-webkit-box",
            }}
            dangerouslySetInnerHTML={{ __html: note.content }}
          />

          <div className="d-flex flex-wrap gap-2 mb-4">
            {note.tags &&
              note.tags.map((tag, i) => (
                <Tag
                  key={i}
                  className="rounded-pill px-2 m-0 border-0 bg-primary bg-opacity-10 text-primary fw-medium"
                >
                  {tag}
                </Tag>
              ))}
          </div>

          <div className="mt-auto pt-3 border-top d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center gap-2">
              <Avatar style={{ backgroundColor: "#9333ea" }} size="small">
                {note.creator.name ? note.creator.name[0].toUpperCase() : "U"}
              </Avatar>
              <div className="d-flex flex-column">
                <span
                  className="small fw-semibold text-dark"
                  style={{ fontSize: "12px", lineHeight: 1 }}
                >
                  {isOwner ? "You" : note.creator.name}
                </span>
                <span
                  className="text-muted mt-1"
                  style={{ fontSize: "10px", lineHeight: 1 }}
                >
                  {new Date(
                    note.updatedAt || note.createdAt,
                  ).toLocaleDateString()}
                </span>
              </div>
            </div>

            {note.sharedWith && note.sharedWith.length > 0 && (
              <div className="d-flex align-items-center">
                <Tooltip title={`${note.sharedWith.length} user(s) shared`}>
                  <i className="bi bi-people-fill text-muted small me-1"></i>
                  <span
                    className="text-muted fw-medium"
                    style={{ fontSize: "12px" }}
                  >
                    {note.sharedWith.length}
                  </span>
                </Tooltip>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {shareOpen && (
        <ShareModal
          open={shareOpen}
          onClose={() => setShareOpen(false)}
          note={note}
          onRefresh={onRefresh}
        />
      )}
      {editOpen && (
        <EditModal
          open={editOpen}
          onClose={() => setEditOpen(false)}
          note={note}
          onRefresh={onRefresh}
        />
      )}
    </>
  );
};

export default NoteCard;
