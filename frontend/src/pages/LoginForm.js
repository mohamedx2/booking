import React, { useState } from 'react';
import { Form, Input, Button, Checkbox, Typography, Alert } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const { Title } = Typography;






const onFinish = async () => {
  try {
  
    const { data } = await axios.post("http://localhost:5000/api/etablissements/getChambre", {
      
    });
    
  console.log("yor data ",data)

  } catch (error) {
  
    console.error('Registration error:', error);

  }
};





const LoginForm = () => {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    const { email, password } = values;
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      const { data } = await axios.post("http://localhost:5000/api/auth/login", { email, mot_passe: password });
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data._id);
      window.location.href = '/' 
    } catch (error) {
      if (error.response) {
        setError(error.response.data.message);
      } else if (error.request) {
        setError('Network error. Please try again.');
      } else {
        setError('An error occurred. Please try again later.');
      }
    }
    setIsLoading(false);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundImage: 'url(/bg.jpg)', backgroundSize: 'cover', }}>
      <div style={{ padding: 60, background: 'rgba(255, 255, 255, 0.4)', borderRadius: 10, boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', width: '100%', maxWidth: 500, height: 600, display: 'flex', flexDirection: 'column', justifyContent: 'center',backdropFilter: 'blur(100px)' }}>
        <Title level={2} style={{ textAlign: 'center', marginBottom: 40, color: '#2596be' }}>Login to your account</Title>
        {error && <Alert message={error} type="error" showIcon style={{ marginBottom: 20 }} />}
        <Form
          name="login"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          size="large"
          style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
        >
          <Form.Item
            name="email"
            rules={[{ required: true, message: 'Please input your Email!' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Email" style={{ fontSize: '16px', padding: '10px' }} />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your Password!' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Password" style={{ fontSize: '16px', padding: '10px' }} />
          </Form.Item>
          <Form.Item>
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>Remember me</Checkbox>
            </Form.Item>
            <a style={{ float: 'right', color: '#111' }} href="">Forgot password</a>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ width: '100%', fontSize: '16px'}} loading={isLoading}>
              Log in
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default LoginForm;
