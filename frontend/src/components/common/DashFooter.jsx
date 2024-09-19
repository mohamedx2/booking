import React from 'react';
import { Layout } from 'antd';

const { Footer } = Layout;

const DashFooter=() => {
  return (
    <Footer style={{ 
      textAlign: 'center', 
      bottom: 0, 
      left:0,
      width: '100%', 
      zIndex: 1
    }}>
      SCH ©{new Date().getFullYear()}
    </Footer>
  );
};


export default DashFooter;
