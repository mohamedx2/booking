import React from 'react';
import { Button, Result } from 'antd';
import { Link } from 'react-router-dom';
const App = () => (
  <Result
  style={{minHeight:'100vh',alignContent:'center'}}
    status="404"
    title="404"
    subTitle="Sorry, the page you visited does not exist."
    extra={<Link to={'/'}><Button type="primary">Back Home</Button></Link>}
  />
);
export default App;