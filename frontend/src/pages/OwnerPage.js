import React, { useState, useEffect } from 'react';
import { Button, Row, Col, Space, Spin, Empty, message } from 'antd';
import { PlusOutlined, EyeOutlined } from '@ant-design/icons';
import EtabliCard from '../components/home/EtabliCard';
import EtabliModal from '../components/home/EtabliModal';
import EditImageModal from '../components/home/EditImageModal';
import { Link } from 'react-router-dom';
import axios from 'axios';

const App = () => {
  const [hotels, setHotels] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentEtablissement, setCurrentEtablissement] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const Token = localStorage.getItem('token');
      const response = await axios.get(
        'http://localhost:5000/api/etablissements/getEtablissement',
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${Token}`,
          },
        }
      );
      const data = response.data;
      if (Array.isArray(data)) {
        setHotels(data);
      } else {
        console.error('Data is not an array:', data);
        message.error('Invalid response format from server.');
      }
    } catch (error) {
      handleError(error, 'fetching hotels');
    } finally {
      setLoading(false);
    }
  };

  const handleError = (error, action) => {
    if (error.response) {
      console.error(`Error ${action}:`, error.response.data);
      message.error(`Error ${action}: ${error.response.data.message || error.response.statusText}`);
    } else if (error.request) {
      console.error(`No response received for ${action}:`, error.request);
      message.error(`No response from server while ${action}. Please try again later.`);
    } else {
      console.error(`Error setting up ${action}:`, error.message);
      message.error(`Error ${action}: ${error.message}`);
    }
  };

  const addHotel = () => {
    fetchData();
  };

  const handleEdit = (etablissement) => {
    setCurrentEtablissement(etablissement);
    setIsEditModalVisible(true);
  };

  const deleteEtab = async (id) => {
    try {
      const Token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/etablissements/deleteEtablissement/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${Token}`,
        },
      });
      setHotels(hotels.filter((hotel) => hotel._id !== id));
  
      message.success('Hotel deleted successfully!');
    } catch (error) {
      handleError(error, 'deleting the hotel');
    }
    fetchData()
  };

  const handleDelete = (id) => {
    deleteEtab(id);
  };

  const handleUpdate = () => {
    fetchData();
    message.success('Hotel information updated successfully!');
  };

  return (
    <div style={{ margin: '0 auto', maxWidth: 1200, padding: '20px', marginTop: '100px', minHeight: '100vh' }}>
      <Space size={'middle'}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          style={{ marginBottom: 16 }}
          onClick={() => setIsModalVisible(true)}
        >
          Add New Hotel
        </Button>
        <Link to="/owner/reservation">
          <Button icon={<EyeOutlined />} style={{ marginBottom: 16 }}>
            View Reservations
          </Button>
        </Link>
      </Space>
      {loading ? (
        <Spin style={{ marginTop: '50px', display: 'block', textAlign: 'center' }} />
      ) : hotels && hotels.length === 0 ? (
        <Empty description="No hotels available" style={{ marginTop: '30vh' }} />
      ) : (
        <Row gutter={[16, 16]}>
          {hotels.map((hotel) => (
            <Col key={hotel._id} xs={24} sm={24} md={8} lg={8} xl={8} xxl={8}>
              <EtabliCard Etablissement={hotel} onDelete={() => handleDelete(hotel._id)} onEdit={handleEdit} />
            </Col>
          ))}
        </Row>
      )}
      <EtabliModal isVisible={isModalVisible} onClose={() => setIsModalVisible(false)} onAdd={addHotel} />
      {currentEtablissement && (
        <EditImageModal
          isVisible={isEditModalVisible}
          onClose={() => setIsEditModalVisible(false)}
          establishment={currentEtablissement}
          onUpdate={handleUpdate}
        />
      )}
    </div>
  );
};

export default App;
