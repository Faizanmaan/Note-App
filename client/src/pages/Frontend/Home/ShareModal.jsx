import React, { useState, useEffect } from 'react';
import { Modal, Select, Button, Avatar, Tag, Tooltip, Popconfirm } from 'antd';
import { DeleteOutlined, UsergroupAddOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import axios from 'axios';

const ShareModal = ({ open, onClose, note, onRefresh }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [permission, setPermission] = useState("viewer");

  useEffect(() => {
    if(open) {
      axios.get(`${window.api}/api/users/all`, { headers: { Authorization: `Bearer ${localStorage.getItem('jwt')}` } })
        .then(res => setUsers(res.data.users))
        .catch(err => console.error(err));
    }
  }, [open]);

  const handleShare = async () => {
    if(selectedUsers.length === 0) return window.toastify("Select at least one user", "error");
    try {
      setLoading(true);
      await axios.post(`${window.api}/api/notes/share/${note._id}`, { targetUserIds: selectedUsers, permission }, {
         headers: { Authorization: `Bearer ${localStorage.getItem('jwt')}` }
      });
      window.toastify("Note shared successfully!", "success");
      onRefresh();
      setSelectedUsers([]);
    } catch(err) {
      window.toastify("Error sharing note", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleUnshare = async (targetUserId) => {
     try {
        await axios.delete(`${window.api}/api/notes/unshare/${note._id}/${targetUserId}`, {
           headers: { Authorization: `Bearer ${localStorage.getItem('jwt')}` }
        });
        window.toastify("Access revoked", "success");
        onRefresh();
     } catch (err) {
        window.toastify("Failed to revoke access", "error");
     }
  };

  const handleSelectAll = () => {
     if (selectedUsers.length === users.length) {
        setSelectedUsers([]);
     } else {
        setSelectedUsers(users.map(u => u._id));
     }
  };

  return (
    <Modal 
      title={<div className="d-flex align-items-center gap-2"><UsergroupAddOutlined className="text-primary" /> <span className="fw-bold fs-5 text-dark">Share "{note.title}"</span></div>} 
      open={open} 
      onCancel={onClose} 
      footer={null} 
      centered
      width={600}
    >
       <div className="mb-4 mt-3 p-3 bg-light rounded-4 border border-light">
         <div className="d-flex justify-content-between align-items-center mb-2">
            <label className="form-label text-muted small fw-bold text-uppercase mb-0" style={{ letterSpacing: '0.5px' }}>Team Members</label>
            <Button type="link" size="small" onClick={handleSelectAll} className="p-0 fw-semibold">
               {selectedUsers.length === users.length ? "Deselect All" : "Select All"}
            </Button>
         </div>
         <div className="d-flex flex-column gap-3">
           <Select
             mode="multiple"
             showSearch
             placeholder="Search and select multiple users..."
             optionFilterProp="children"
             className="w-100"
             size="large"
             value={selectedUsers}
             onChange={v => setSelectedUsers(v)}
             maxTagCount="responsive"
           >
             {users.map(u => (
               <Select.Option key={u._id} value={u._id}>{u.name} <span className="text-muted small">({u.email})</span></Select.Option>
             ))}
           </Select>
           <div className="d-flex gap-2">
              <Select defaultValue="viewer" size="large" onChange={v => setPermission(v)} style={{ width: 130 }} className="rounded-3">
                 <Select.Option value="viewer">Viewer</Select.Option>
                 <Select.Option value="editor">Editor</Select.Option>
              </Select>
              <Button type="primary" size="large" loading={loading} onClick={handleShare} className="flex-grow-1 fw-bold rounded-3 shadow-sm border-0" style={{ backgroundColor: "#9333ea" }}>Invite Members</Button>
           </div>
         </div>
       </div>

       <div className="mt-4">
         <h6 className="text-secondary fw-bold mb-3 px-1 small text-uppercase" style={{ letterSpacing: '1px' }}>Current Access</h6>
         {(!note.sharedWith || note.sharedWith.length === 0) ? (
            <div className="text-center py-5 bg-white rounded-3 border border-dashed text-muted small">
               <div className="mb-2 fs-3 text-light opacity-50"><UsergroupAddOutlined /></div>
               This note is not shared with anyone yet.
            </div>
         ) : (
            <div className="d-flex flex-column gap-2" style={{ maxHeight: '250px', overflowY: 'auto', paddingRight: '5px' }}>
              {note.sharedWith.map((item) => (
                <div key={item._id} className="d-flex align-items-center justify-content-between p-2 hover-bg-light rounded-3 transition-all border border-light bg-white">
                  <div className="d-flex align-items-center gap-2">
                    <Avatar style={{ backgroundColor: "#6c757d" }} size="middle">
                      {item.userId?.name ? item.userId.name[0].toUpperCase() : 'U'}
                    </Avatar>
                    <div className="d-flex flex-column">
                      <span className="fw-bold text-dark small" style={{ fontSize: '13px' }}>{item.userId?.name}</span>
                      <span className="text-muted" style={{ fontSize: "10px" }}>{item.userId?.email}</span>
                    </div>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <Tag color={item.permission === 'editor' ? 'green' : '#9333ea'} className="rounded-pill px-2 m-0 fw-medium text-capitalize border-0 small">
                      {item.permission}
                    </Tag>
                    <Popconfirm
                       title="Revoke Access"
                       description="Are you sure you want to remove this user's access?"
                       onConfirm={() => handleUnshare(item.userId?._id)}
                       okText="Yes, Revoke"
                       cancelText="No"
                       icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                    >
                       <Tooltip title="Revoke access">
                          <Button 
                            type="text" 
                            danger 
                            icon={<DeleteOutlined />} 
                            size="small"
                          />
                       </Tooltip>
                    </Popconfirm>
                  </div>
                </div>
              ))}
            </div>
         )}
       </div>
    </Modal>
  );
};
export default ShareModal;
