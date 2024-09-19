import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, Dropdown, Avatar, Badge, Drawer, Button } from 'antd';
import { UserOutlined, DownOutlined, ProfileOutlined, LineChartOutlined, LogoutOutlined, CloseOutlined } from '@ant-design/icons';
import ProfileDrawer from '../../pages/Profile';
import { navList } from "../data/Data";

export default function Header() {
  const [navbarCollapse, setNavbarCollapse] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(false);

  const logoutHandler = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    window.location.href = '/';
  };

  const validatAuthTitle = (item) => {
    const isOwner = userInfo && userInfo.role === "proprietaire" && userInfo.verife;
    if (item === "Owner" && !isOwner) return "";
    return item;
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
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();console.log(userInfo)
  }, []);

  const menu = (
    <Menu>
      <Menu.Item key="0" icon={<ProfileOutlined />} onClick={() => setDrawerVisible(true)}>
        Profile
      </Menu.Item>
      <Menu.Item key="1" icon={<LineChartOutlined />}>
        <Link to="/userreservation">
          Reservations
        </Link>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="2" icon={<LogoutOutlined />} onClick={logoutHandler}>
        Log Out
      </Menu.Item>
    </Menu>
  );

  const token = localStorage.getItem('token');

  const handleMouseEnter = (itemId) => {
    setActiveDropdown(itemId);
  };

  const handleMouseLeave = () => {
    setActiveDropdown(null);
  };

  const navbarStyle = {
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    zIndex: 1000
  };

  const navItemsStyle = {
    display: "flex",
    justifyContent: "center",
    width: "100%",
  };

  const loginRegisterBtnsStyle = {
    marginRight: "1rem",
  };

  const buttonStyle = {
    fontSize: "1.2rem",
    padding: "10px 20px",
    borderRadius: "15px",
    transition: "all 0.3s ease",
  };

  const drawerStyle = {
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    padding: "20px"
  };

  const linkStyle = {
    color: "#fff",
    padding: "10px 0",
    display: "block",
    fontSize: "1.2rem",
    textDecoration: "none"
  };

  const closeButtonStyle = {
    position: 'absolute',
    top: '10px',
    right: '10px',
    color: '#fff'
  };

  return (
    <>
      <div className="container-fluid px-0" style={navbarStyle}>
        <div className="row gx-0">
          <div className="col-lg-3 d-none d-lg-block">
            <Link
              to="/"
              className="navbar-brand w-100 h-100 m-0 p-0 d-flex align-items-center justify-content-center"
            >
              <h1 className="m-0 text-primary text-uppercase">Sch</h1>
            </Link>
          </div>
          <div className="col-lg-9">
            <nav className="navbar navbar-expand-lg navbar-dark p-3 p-lg-0">
              <Link to="/" className="navbar-brand d-block d-lg-none">
                <h1 className="m-0 text-primary text-uppercase">Sch</h1>
              </Link>
              <button
                type="button"
                className="navbar-toggler"
                onClick={() => setSidebarVisible(!sidebarVisible)}
              >
                <span className="navbar-toggler-icon"></span>
              </button>
              <div
                className={
                  navbarCollapse
                    ? "navbar-collapse justify-content-between navbarCollapse"
                    : "collapse navbar-collapse justify-content-between"
                }
              >
                <div className="navbar-nav py-0 d-none d-lg-flex" style={navItemsStyle}>
                  {navList.map((item, index) => (
                    <div key={index}>
                      {item.subItems ? (
                        <div
                          className="nav-item dropdown"
                          onMouseEnter={() => handleMouseEnter(item.id)}
                          onMouseLeave={handleMouseLeave}
                        >
                          <Link to="#" className="nav-link dropdown-toggle">
                            {validatAuthTitle(item.text)}
                          </Link>
                          <div
                            className={`dropdown-menu rounded-0 m-0 ${
                              activeDropdown === item.id ? "show" : ""
                            }`}
                          >
                            {item.subItems.map((sub, subIndex) => (
                              <Link key={subIndex} to={sub.path} className="dropdown-item">
                                {sub.text}
                              </Link>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <Link to={item.path} className="nav-item nav-link">
                          {validatAuthTitle(item.text)}
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
                <div style={{ width: '300px' }}>
                  {token ? (
                    userInfo ? (
                      <Dropdown overlay={menu} trigger={['click']}>
                        <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                          <Badge count={5} offset={[-12, 0]}>
                            <Avatar src={userInfo?.profilePhoto.url} style={{ backgroundColor: '#1890ff', marginRight: '20px' }} icon={<UserOutlined />} />
                          </Badge>
                          <span style={{ color: '#fff', marginLeft: '8px' }}>{userInfo.nom} {userInfo.prenom}</span><DownOutlined />
                        </a>
                      </Dropdown>
                    ) : (
                      <span style={{ color: '#fff' }}>Loading...</span>
                    )
                  ) : (
                    <div className="d-flex align-items-center" style={loginRegisterBtnsStyle}>
                      <Link to="/login" className="btn btn-primary me-2" style={buttonStyle}>
                        Login
                      </Link>
                      <Link to="/register" className="btn btn-light" style={buttonStyle}>
                        Register
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </nav>
          </div>
        </div>
      </div>
      <Drawer
        placement="left"
        closable={false}
        onClose={() => setSidebarVisible(false)}
        visible={sidebarVisible}
        bodyStyle={drawerStyle}
      >
        <Button type="text" icon={<CloseOutlined />} onClick={() => setSidebarVisible(false)} style={closeButtonStyle} />
        <div className="d-lg-none">
          {navList.map((item, index) => (
            <div key={index}>
              {item.subItems ? (
                <div className="nav-item dropdown">
                  <Link to="#" className="nav-link dropdown-toggle" style={linkStyle} onClick={() => setNavbarCollapse(!navbarCollapse)}>
                    {item.text}
                  </Link>
                  <div className={`dropdown-menu rounded-0 m-0 ${navbarCollapse ? "show" : ""}`}>
                    {item.subItems.map((sub, subIndex) => (
                      <Link key={subIndex} to={sub.path} className="dropdown-item" style={linkStyle} onClick={() => setSidebarVisible(false)}>
                        {sub.text}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link to={item.path} className="nav-item nav-link" style={linkStyle} onClick={() => setSidebarVisible(false)}>
                  {item.text}
                </Link>
              )}
            </div>
          ))}
          {token ? (
            userInfo ? (
              <Dropdown overlay={menu} trigger={['click']}>
                <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                  <Badge count={5} offset={[-12, 0]}>
                    <Avatar src={userInfo?.profilePhoto.url} style={{ backgroundColor: '#1890ff', marginRight: '20px' }} icon={<UserOutlined />} />
                  </Badge>
                  <span style={{ color: '#fff', marginLeft: '8px' }}>{userInfo.nom} {userInfo.prenom}</span><DownOutlined />
                </a>
              </Dropdown>
            ) : (
              <span style={{ color: '#fff' }}>Loading...</span>
            )
          ) : (
            <div className="d-flex align-items-center" style={loginRegisterBtnsStyle}>
              <Link to="/login" className="btn btn-primary me-2" style={buttonStyle}>
                Login
              </Link>
              <Link to="/register" className="btn btn-light" style={buttonStyle}>
                Register
              </Link>
            </div>
          )}
        </div>
      </Drawer>
      <ProfileDrawer visible={drawerVisible} onClose={() => setDrawerVisible(false)} />
    </>
  );
}
