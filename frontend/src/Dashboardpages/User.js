import React, { useEffect, useState } from 'react';
import { Table, Button, Avatar, Popconfirm, Spin } from 'antd';
import { CheckOutlined, CloseOutlined, ReloadOutlined } from '@ant-design/icons';
import CommonHeading from '../components/common/CommonHeading';
import axios from 'axios';

const ReservationTable = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/auth/profiles/Nvalidate', {
        headers: { Authorization: `Bearer ${token}` },
      
      });
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (key) => {
    console.log('Approved reservation with key:', key);
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/auth/validate/${key}`,   {verife:true}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      getData();
    } catch (error) {
      console.error('Error approving reservation:', error);
    }
  };

  const handleDecline = async (key) => {
    console.log('Declined reservation with key:', key);
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/auth/delete/${key}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      getData();
    } catch (error) {
      console.error('Error declining reservation:', error);
    }
  };

  const columns = [
    {
      title: 'Profile Photo',
      dataIndex: 'profilePhoto',
      key: 'profilePhoto',
      render: (text, record) => (
        <Avatar src={record.profilePhoto?.url} />
      ),
    },
    {
      title: 'First Name',
      dataIndex: 'prenom',
      key: 'prenom',
      sorter: (a, b) => a.prenom.localeCompare(b.prenom),
    },
    {
      title: 'Last Name',
      dataIndex: 'nom',
      key: 'nom',
      sorter: (a, b) => a.nom.localeCompare(b.nom),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      sorter: (a, b) => a.email.localeCompare(b.email),
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <span>
          <Button
            type="primary"
            icon={<CheckOutlined />}
            onClick={() => handleApprove(record._id)}
            style={{ backgroundColor: 'green', borderColor: 'green' }}
          >
            Validate Account
          </Button>
          <Popconfirm
            title="Are you sure to decline this Accont?"
            onConfirm={() => handleDecline(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              type="default"
              icon={<CloseOutlined />}
              style={{ marginLeft: 8, backgroundColor: 'red', borderColor: 'red', color: 'white' }}
            >
              Delete Account
            </Button>
          </Popconfirm>
        </span>
      ),
    },
  ];

  return (
    <div className="container" style={{ marginTop: '100px', minHeight: '100vh' }}>
      <CommonHeading
        heading="User"
        title="Accounts"
        subtitle="Manage"
      />
      <Button
        type="primary"
        icon={<ReloadOutlined />}
        onClick={getData}
        style={{ marginBottom: '20px' }}
      >
        Refresh
      </Button>
      <Spin spinning={loading}>
        <Table
          columns={columns}
          dataSource={users}
          pagination={{ pageSize: 10 }}
          rowKey="_id"
        />
      </Spin>
    </div>
  );
};

export default ReservationTable;
