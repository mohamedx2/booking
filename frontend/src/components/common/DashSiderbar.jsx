import React, { useState, useEffect } from 'react';
import { Layout, Menu, Avatar } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import {
  CommentOutlined,
  UserOutlined,
  HomeOutlined

} from '@ant-design/icons';

function getItem(label, key, icon, path, children) {
  return {
    key,
    icon,
    label: path ? <Link to={path}>{label}</Link> : label,
    ...(children && { children }),
  };
}

const items = [
  getItem('home', '1', <HomeOutlined />, 'home'),

  getItem('user', '2', <UserOutlined />, 'user'),
  getItem('Comments', '3', <CommentOutlined />, 'comments'),
  
];

const DashSiderbar = ({ collapsed, setCollapsed }) => {
  const { Sider } = Layout;
  const [userInfo, setUserInfo] = useState(null);
  const location = useLocation();
  const storedKey = localStorage.getItem('selectedKey');
  const [selectedKey, setSelectedKey] = useState(storedKey || '1');
  const avatarSize = collapsed ? 50 : 90;
  const avatarMargin = collapsed ? '16px 0' : '24px 0';

  useEffect(() => {
    localStorage.setItem('selectedKey', selectedKey);
  }, [selectedKey]);



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

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={(value) => setCollapsed(value)}
      width={220}
      collapsedWidth={80}
      style={{
        overflowY: 'hidden',
        height: '100vh',
        left: 0,
        top: 0,
        bottom: 0,
        zIndex: 1001,
        position: 'fixed',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '64px',
          margin: avatarMargin,
        }}
      >
        <Avatar
          size={avatarSize}
          style={{ backgroundColor: 'grey' }}
          src={userInfo?.profilePhoto?.url || ""}
        />
      </div>
      <Menu
        theme="dark"
        selectedKeys={[selectedKey]}
        mode="inline"
        items={items}
        onSelect={({ key }) => setSelectedKey(key)}
      />
    </Sider>
  );
};

export default DashSiderbar;
