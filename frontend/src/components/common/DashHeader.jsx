import React, { useState, useEffect } from 'react';
import { Layout, Menu, Dropdown, Avatar, Badge, Drawer, Flex } from 'antd';
import { UserOutlined, DownOutlined, ProfileOutlined, LineChartOutlined, LogoutOutlined } from '@ant-design/icons';
import ProfileDrawer from '../../pages/Profile'; // Adjust the import path as necessary
import { Link } from 'react-router-dom';

const { Header } = Layout;

const DashHeader = () => {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  const logoutHandler = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    window.location.href = '/';
  };

  const fetchData = async () => {
    try {
      const Token = localStorage.getItem("token");
      const idCompte = localStorage.getItem("userId");
      const response = await fetch(
        `http://localhost:5000/api/auth/profile/${idCompte}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Token}`,
          },
        }
      );
      const data = await response.json();
      setUserInfo(data);
      console.log(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const menu = (
    <Menu>
      <Menu.Item key="0" icon={<ProfileOutlined />} onClick={() => setDrawerVisible(true)}>
        Profile
      </Menu.Item>
      
      <Menu.Divider />
      <Menu.Item key="2" icon={<LogoutOutlined />} onClick={logoutHandler}>
        Log Out
      </Menu.Item>
    </Menu>
  );

  return (
    <>
      <Header style={{ background: '#fff', padding: '0 16px', display: 'flex', justifyContent: 'flex-end' }}>
        <Flex justify='space-between' align='center' style={{width:'100%'}}>
        <Flex flex="auto" align="center" style={{paddingRight:'100px'}}>
        <h1 className="m-0 text-primary text-uppercase">Sch</h1>

        </Flex>
        <Dropdown overlay={menu} trigger={['click']}>
          <a className="ant-dropdown-link" onClick={e => e.preventDefault()} style={{ display: 'flex', alignItems: 'center' }}>
            <Badge count={5} offset={[-10, 10]}>
              <Avatar
                src={userInfo?.profilePhoto?.url || 'https://via.placeholder.com/150'}
                style={{ backgroundColor: '#1890ff', marginRight: '10px' }}
                icon={<UserOutlined />}
              />
            </Badge>
            <span style={{ color: '#000', marginLeft: '8px' }}>
              {userInfo?.nom} {userInfo?.prenom}
            </span>
            <DownOutlined />
          </a>
        </Dropdown>
        </Flex>
      </Header>
      <ProfileDrawer visible={drawerVisible} onClose={() => setDrawerVisible(false)} />
    </>
  );
};

export default DashHeader;
