import React, { memo, useState } from 'react';
import { Layout } from 'antd';
import DashFooter from '../components/common/DashFooter';
import DashHeader from '../components/common/DashHeader';
import DashSiderbar from '../components/common/DashSiderbar';
import { Outlet } from 'react-router-dom';

const { Header, Content } = Layout;

// Memoizing Sidebar component
const MemoizedSidebar = memo(DashSiderbar);
// Memoizing DashboardFooter component
const MemoizedDashboardFooter = memo(DashFooter);
// Memoizing Dash_Header component
const MemoizedDashHeader = memo(DashHeader);

const DashboardLayout = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <MemoizedSidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <Layout
      
        style={{
          marginLeft: collapsed ? 80 : 220, // Adjust based on sidebar width
          transition: 'margin-left 0.2s',
        }}
      >
        <MemoizedDashHeader />
        <Content style={{ margin: '24px 16px 0', overflow: 'initial' }}>
          <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
            <Outlet /> {/* Nested routes will be rendered here */}
          </div>
        </Content>
        <MemoizedDashboardFooter />
      </Layout>
    </Layout>
  );
};

export default DashboardLayout;
