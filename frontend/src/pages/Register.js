import React, { useState } from 'react';
import { Form, Input, Button, Typography, Alert, Radio, DatePicker, Select } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined, ManOutlined, WomanOutlined } from '@ant-design/icons';
import axios from "axios";
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;
const { Option } = Select;

const RegisterForm = () => {
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      const { firstName, lastName, email, password, gender, date_de_naissance, phone, role } = values;
      if (!firstName || !lastName || !email || !password || !gender || !date_de_naissance || !phone || !role) {
        setError('Please fill in all fields');
        return;
      }
      const { data } = await axios.post("http://localhost:5000/api/auth/register", {
        "nom":firstName,
        "prenom":lastName,
        "email":email,
        "mot_passe":password,
        "date_de_naissance":date_de_naissance,
        "phone":phone,
      "gender":gender,
      "role":role
      });
      
      // Handle successful registration
      console.log('Registration successful');
      
      // Optionally, you can store the token in localStorage or a state management solution
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data._id);
      
      // Redirect to a different page (e.g., dashboard)
      window.location.href = '/' 
    } catch (error) {
      setError('An error occurred. Please try again later.');
      console.error('Registration error:', error);

    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundImage: 'url(/bg.jpg)', backgroundSize: 'cover', paddingTop: '70px' }}>
      <div style={{ padding: 60, background: 'rgba(255, 255, 255, 0.4)', borderRadius: 10, boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', width: '100%', maxWidth: 500, height: 'auto', display: 'flex', flexDirection: 'column', justifyContent: 'center', backdropFilter: 'blur(100px)' }}>
        <Title level={2} style={{ textAlign: 'center', marginBottom: 40, color: '#2596be' }}>Register your account</Title>
        {error && <Alert message={error} type="error" showIcon style={{ marginBottom: 20 }} />}
        <Form
          name="register"
          onFinish={onFinish}
          size="large"
          style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
        >
          <Form.Item
            name="firstName"
            rules={[{ required: true, message: 'Please input your First Name!' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="First Name" style={{ fontSize: '16px', padding: '10px',  }} />
          </Form.Item>
          <Form.Item
            name="lastName"
            rules={[{ required: true, message: 'Please input your Last Name!' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Last Name" style={{ fontSize: '16px', padding: '10px',  }} />
          </Form.Item>
          <Form.Item
            name="email"
            rules={[{ required: true, message: 'Please input your Email!' }, { type: 'email', message: 'The input is not valid E-mail!' }]}
          >
            <Input prefix={<MailOutlined />} placeholder="Email" style={{ fontSize: '16px', padding: '10px',  }} />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your Password!' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Password" style={{ fontSize: '16px', padding: '10px',  }} />
          </Form.Item>
          <Form.Item
            name="gender"
            rules={[{ required: true, message: 'Please select your Gender!' }]}
          >
            <Radio.Group>
              <Radio value="M"><ManOutlined /> Male</Radio>
              <Radio value="F"><WomanOutlined /> Female</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            name="date_de_naissance"
            rules={[{ required: true, message: 'Please select your Birthday!' }]}
          >
            <DatePicker
              placeholder="Select Birthday"
              style={{ width: '100%', fontSize: '16px', padding: '10px',  }}
              format="YYYY-MM-DD"
            />
          </Form.Item>
          <Form.Item
            name="phone"
            rules={[{ required: true, message: 'Please input your Phone Number!' }]}
          >
            <Input prefix={<PhoneOutlined />} placeholder="Phone Number" style={{ fontSize: '16px', padding: '10px',  }} />
          </Form.Item>
          <Form.Item
            name="role"
            rules={[{ required: true, message: 'Please select a Role!' }]}
          >
            <Select placeholder="Select Role" >
              <Option value="client">User</Option>
              <Option value="admin">Admin</Option>
              <Option value="proprietaire">Owner</Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
              Register
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default RegisterForm;
