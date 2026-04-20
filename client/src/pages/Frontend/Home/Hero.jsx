import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Input, Spin, Empty, Popconfirm } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { motion } from 'motion/react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import axios from 'axios';
import { useAuth } from '../../../context/Auth';
import NoteCard from './NoteCard';

import { useSocket } from '../../../context/SocketContext';

const Hero = ({ activeCategory = "all", searchTerm = "" }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  
  const [form] = Form.useForm();
  const { user } = useAuth();
  const { socket } = useSocket() || {};

  const filteredNotes = notes.filter(note => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return true;
    
    const matchesTitle = note.title?.toLowerCase().includes(term);
    const matchesTags = note.tags?.some(tag => tag.toLowerCase().includes(term));
    
    return matchesTitle || matchesTags;
  });
  
  const fetchNotes = async () => {
    try {
      setLoading(true);
      let fetchUrls = [];
      if (activeCategory === "shared") fetchUrls = [`${window.api}/api/notes/shared`];
      else if (activeCategory === "all") fetchUrls = [`${window.api}/api/notes/my-notes`];
      else fetchUrls = [`${window.api}/api/notes/my-notes`, `${window.api}/api/notes/shared`];

      const responses = await Promise.all(fetchUrls.map(url => axios.get(url, {
        headers: { Authorization: `Bearer ${localStorage.getItem('jwt')}` }
      })));
      
      let allNotes = [];
      responses.forEach(res => allNotes = [...allNotes, ...(res.data.notes || [])]);
      // Distinct notes
      allNotes = allNotes.filter((v, i, a) => a.findIndex(t => t._id === v._id) === i);
      
      // Filter if favorites
      if (activeCategory === "favorites") {
        allNotes = allNotes.filter(n => n.isFavoriteBy && n.isFavoriteBy.includes(user?._id));
      }
      setNotes(allNotes);
    } catch (err) {
      console.error("Failed to fetch notes", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if(user && user._id) fetchNotes();
  }, [activeCategory, user]);

  useEffect(() => {
     if(socket) socket.on("note_updated", fetchNotes);
     return () => { if(socket) socket.off("note_updated", fetchNotes); }
  }, [socket]);

  const handleCreate = async (values) => {
    try {
      setCreating(true);
      const tags = values.tags ? values.tags.split(',').map(t=>t.trim()) : [];
      await axios.post(`${window.api}/api/notes/create`, {
        title: values.title,
        content: values.content,
        tags
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('jwt')}` }
      });
      window.toastify("Note created successfully", "success");
      setIsModalOpen(false);
      form.resetFields();
      fetchNotes();
    } catch (err) {
      window.toastify("Error creating note", "error");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="p-4 p-md-5 bg-light min-vh-100">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center border-bottom pb-4 mb-4 gap-3 bg-white p-4 rounded-4 shadow-sm"
      >
        <div>
          <h2 className="fw-bold mb-1 text-dark">My Notes</h2>
          <p className="text-muted mb-0">Manage and organize your daily tasks and ideas securely.</p>
        </div>
        <Button 
          type="primary" 
          size="large" 
          onClick={() => setIsModalOpen(true)}
          className="rounded-3 shadow-sm px-4 fw-medium" 
          style={{ backgroundColor: "#9333ea", border: "none" }}
        >
          + New Note
        </Button>
      </motion.div>
      
      {loading ? (
        <div className="d-flex justify-content-center align-items-center py-5">
           <Spin size="large" />
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="row g-4"
        >
          {filteredNotes.length === 0 ? (
            <div className="col-12 text-center py-5 mt-5 bg-white rounded-4 shadow-sm border border-light">
              <Empty 
                description={
                  <span className="text-muted fs-5">
                    {searchTerm ? `No results matching "${searchTerm}"` : "No notes found. Create your first note!"}
                  </span>
                } 
              />
            </div>
          ) : (
            filteredNotes.map(note => (
               <div className="col-12 col-md-6 col-lg-4" key={note._id}>
                 <NoteCard note={note} onRefresh={fetchNotes} />
               </div>
            ))
          )}
        </motion.div>
      )}

      {/* Create Note Modal */}
      <Modal
        title={<span className="fw-bold fs-5 text-dark">Create New Note</span>}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={700}
        centered
      >
         <Form form={form} layout="vertical" onFinish={handleCreate} className="mt-3">
            <Form.Item name="title" label={<span className="fw-medium text-secondary">Title</span>} rules={[{ required: true }]}>
               <Input size="large" placeholder="Enter note title..." className="rounded-3" />
            </Form.Item>
            <Form.Item name="content" label={<span className="fw-medium text-secondary">Content</span>} rules={[{ required: true }]}>
               <ReactQuill 
                  theme="snow" 
                  placeholder="Write something..."
                  className="mb-4 bg-light rounded-3 p-2"
                  modules={{
                    toolbar: [
                      ['bold', 'italic', 'underline'],
                      [{'list': 'ordered'}, {'list': 'bullet'}],
                      ['link']
                    ]
                  }}
                  style={{ height: "200px", paddingBottom: "40px" }} 
               />
            </Form.Item>
            <Form.Item name="tags" label={<span className="fw-medium text-secondary">Tags (comma separated)</span>} className="mt-2">
               <Input size="large" placeholder="e.g. work, personal, ideas" className="rounded-3" />
            </Form.Item>
            <div className="d-flex justify-content-end gap-2 mt-4">
              <Button onClick={() => setIsModalOpen(false)} size="large" className="rounded-3 px-4">Cancel</Button>
              <Popconfirm
                 title="Create Note"
                 description="Are you sure you want to create this note?"
                 onConfirm={() => form.submit()}
                 okText="Yes, Save"
                 cancelText="No"
                 icon={<QuestionCircleOutlined style={{ color: '#9333ea' }} />}
              >
                 <Button type="primary" loading={creating} size="large" className="rounded-3 px-4" style={{ backgroundColor: "#9333ea" }}>
                    Save Note
                 </Button>
              </Popconfirm>
            </div>
         </Form>
      </Modal>
    </div>
  );
};

export default Hero;
