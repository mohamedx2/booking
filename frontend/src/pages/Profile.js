import React, { useState, useEffect } from 'react';
import { Drawer, Button, Avatar, Upload, Card, Typography, Space, Form, message } from 'antd';
import { EditOutlined, UploadOutlined } from '@ant-design/icons';
import axios from 'axios';
import EditableCell from './EditableCell'; // Adjust the path based on your project structure

const { Title, Text } = Typography;

const labelStyle = {
  fontSize: '16px',
  color: '#2aa3d1',
};

const ProfileDrawer = ({ visible, onClose }) => {
  const [user, setUser] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (visible) {
      fetchData();
    }
  }, [visible]);

  const fetchData = async () => {
    try {
      const Token = localStorage.getItem('token');
      const idCompte = localStorage.getItem('userId');
      const response = await axios.get(
        `http://localhost:5000/api/auth/profile/${idCompte}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${Token}`,
          },
        }
      );
      const data = response.data;
      setUser(data);
      console.log(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleSave = (field, value) => {
    const updatedUser = { ...user, [field]: value };
    setUser(updatedUser);
  };

  const updateUser = async () => {
    try {
      const Token = localStorage.getItem('token');
      const { nom, prenom, phone, date_de_naissance, gender } = user;
      const updateData = {
        nom,
        prenom,
        gender,
        phone,
        date_de_naissance,
      };

      await axios.put(
        `http://localhost:5000/api/auth/update`,
        updateData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${Token}`,
          },
        }
      );
      window.location.href = '/';
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const toggleEditMode = () => {
    if (isEditing) {
      updateUser();
    }
    setIsEditing(!isEditing);
  };

  const handleUpload = async (file) => {
    setUploading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const authToken = localStorage.getItem('token');
      const response = await axios.post(
        `http://localhost:5000/api/auth/profile-photo-upload`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.status === 200) {
        message.success('Photo uploaded successfully');
        fetchData(); // Refresh user data after photo upload
      } else {
        throw new Error('Failed to upload photo');
      }
    } catch (error) {
      console.error('Error uploading photo:', error);
      message.error('Failed to upload photo');
    } finally {
      setUploading(false);
    }
  };

  const uploadProps = {
    beforeUpload: (file) => {
      handleUpload(file);
      return false; // Prevent default upload behavior
    },
  };

  return (
    <Drawer
      title="Profile"
      placement="right"
      onClose={onClose}
      visible={visible}
      width={400}
    >
      <Card bordered={false} style={{ textAlign: 'center', marginBottom: 20 }}>
        <Avatar size={100} src={user.profilePhoto?.url} />
        <Title level={3} style={{ marginTop: 10 }}>{`${user.nom} ${user.prenom}`}</Title>
        <Text type="secondary">{user.role}</Text>
        {isEditing && (
          <Form.Item style={{marginTop:10}}>
            <Upload {...uploadProps} showUploadList={false}>
              <Button icon={<UploadOutlined />} loading={uploading}>Upload Avatar</Button>
            </Upload>
          </Form.Item>
        )}
      </Card>
      <Form layout="vertical" style={{ padding: '0 24px' }}>
        <Form.Item label={<span style={labelStyle}>First Name</span>}>
          <EditableCell value={user.nom} onChange={(value) => handleSave('nom', value)} isEditing={isEditing} />
        </Form.Item>
        <Form.Item label={<span style={labelStyle}>Last Name</span>}>
          <EditableCell value={user.prenom} onChange={(value) => handleSave('prenom', value)} isEditing={isEditing} />
        </Form.Item>
        <Form.Item label={<span style={labelStyle}>Email</span>}>
          <EditableCell value={user.email} onChange={(value) => handleSave('email', value)} isEditing={isEditing} disabled />
        </Form.Item>
        <Form.Item label={<span style={labelStyle}>Birthday</span>}>
          <EditableCell value={user.date_de_naissance} onChange={(value) => handleSave('date_de_naissance', value)} isEditing={isEditing} isDate />
        </Form.Item>
        <Form.Item label={<span style={labelStyle}>Phone Number</span>}>
          <EditableCell value={user.phone} onChange={(value) => handleSave('phone', value)} isEditing={isEditing} />
        </Form.Item>
        
        
        <Form.Item>
          <Space style={{ display: 'flex', justifyContent: 'center' }}>
            <Button type="primary" icon={<EditOutlined />} onClick={toggleEditMode}>
              {isEditing ? 'Finish Editing' : 'Edit Profile'}
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default ProfileDrawer;
