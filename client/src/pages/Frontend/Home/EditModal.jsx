import React, { useState } from 'react';
import { Modal, Form, Input, Button, Popconfirm } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import axios from 'axios';

const EditModal = ({ open, onClose, note, onRefresh }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (values) => {
    try {
      setLoading(true);
      await axios.patch(`${window.api}/api/notes/update/${note._id}`, {
        title: values.title,
        content: values.content
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('jwt')}` }
      });
      window.toastify("Note updated", "success");
      onRefresh();
      onClose();
    } catch(err) {
      window.toastify("Failed to update note", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal title={<span className="fw-bold fs-5 text-dark">Edit Note</span>} open={open} onCancel={onClose} footer={null} width={700} centered>
       <Form form={form} layout="vertical" onFinish={handleUpdate} initialValues={{ title: note.title, content: note.content }} className="mt-3">
          <Form.Item name="title" label={<span className="fw-medium text-secondary">Title</span>} rules={[{ required: true }]}>
             <Input size="large" className="rounded-3" />
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
          <div className="d-flex justify-content-end gap-2 mt-5">
            <Button onClick={onClose} size="large" className="rounded-3 px-4">Cancel</Button>
            <Popconfirm
               title="Update Note"
               description="Are you sure you want to save these changes?"
               onConfirm={() => form.submit()}
               okText="Update"
               cancelText="Cancel"
               icon={<QuestionCircleOutlined style={{ color: '#9333ea' }} />}
            >
               <Button type="primary" loading={loading} size="large" className="rounded-3 px-4 fw-medium" style={{ backgroundColor: "#9333ea" }}>
                  Update Note
               </Button>
            </Popconfirm>
          </div>
       </Form>
    </Modal>
  );
};
export default EditModal;
