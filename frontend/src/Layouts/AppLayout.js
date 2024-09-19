import React from 'react';
import Navbar from '../components/common/Header';
import Footer from '../components/common/Footer';

const MemoizedNavbar = React.memo(Navbar);
const MemoizedFooter = React.memo(Footer);

const AppLayout = ({ children }) => {
  return (
    <div>
      <MemoizedNavbar />
      {children}
      <MemoizedFooter />
    </div>
  );
};

export default AppLayout;
