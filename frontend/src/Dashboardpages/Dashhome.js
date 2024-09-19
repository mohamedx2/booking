import React, { useEffect, useState } from 'react';
import { Table, Avatar, Tag, message, Button, Popconfirm, Input } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Column } = Table;
const { Search } = Input;

const Dashhome = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token'); // Replace this with your method of getting the token
      const response = await axios.get('http://localhost:5000/api/auth/profiles', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const profiles = response.data.map(profile => ({
        key: profile._id,
        username: `${profile.prenom} ${profile.nom}`,
        avatar: profile.profilePhoto.url,
        role: profile.role,
        status: profile.verife ? 'Approved' : 'Declined',
        email: profile.email,
      }));
      setData(profiles);
    } catch (error) {
      message.error('Failed to fetch profiles');
    } finally {
      setLoading(false);
    }
  };

  const deleteProfile = async (key) => {
    try {
      const token = localStorage.getItem('token'); // Replace this with your method of getting the token
      await axios.delete(`http://localhost:5000/api/auth/delete/${key}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      message.success('Profile deleted successfully');
      fetchData();
    } catch (error) {
      message.error('Failed to delete profile');
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredData = data.filter(profile =>
    profile.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Search
        placeholder="Search by username"
        onChange={handleSearch}
        style={{ marginBottom: 16, width: 300 }}
      />
      <Table dataSource={filteredData} loading={loading}>
        <Column
          title="Avatar & Username"
          dataIndex="username"
          key="username"
          render={(text, record) => (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Avatar src={record.avatar} />
              <span style={{ marginLeft: '10px' }}>{text}</span>
            </div>
          )}
        />
        <Column
          title="Role"
          dataIndex="role"
          key="role"
          render={(role) => (
            <Tag color={role === 'admin' ? 'blue' : role === 'proprietaire' ? 'green' : 'orange'}>
              {role}
            </Tag>
          )}
        />
        <Column
          title="Status"
          dataIndex="status"
          key="status"
          render={(status) => (
            <Tag color={status === 'Approved' ? 'green' : 'red'}>{status}</Tag>
          )}
        />
        <Column title="Email" dataIndex="email" key="email" />
        <Column
          title="Actions"
          key="actions"
          render={(text, record) => (
            <Popconfirm
              title="Are you sure to delete this profile?"
              onConfirm={() => deleteProfile(record.key)}
              okText="Yes"
              cancelText="No"
            >
              <Button type="primary" danger>
                <DeleteOutlined twoToneColor="#d9534f" />
                Delete
              </Button>
            </Popconfirm>
          )}
        />
      </Table>
    </>
  );
};

export default Dashhome;
