import React, { useEffect, useState } from 'react';
import { Table, Button, Avatar, Popconfirm, Spin, message, Modal, Descriptions, Divider } from 'antd';
import { CheckOutlined, CloseOutlined, ReloadOutlined } from '@ant-design/icons';
import CommonHeading from '../components/common/CommonHeading';
import axios from 'axios';
import moment from 'moment';


const ReservationTable = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    setLoading(true);
    const authtoken = localStorage.getItem('token');
    try {
      const { data } = await axios.get("http://localhost:5000/api/reservations", {
        headers: { Authorization: `Bearer ${authtoken}` }
      });
      const reservationData = Object.values(data).map(item => ({
        key: item.reservation._id,
        establishment: item.etablissement.nom,
        userName: `${item.user.nom} ${item.user.prenom}`,
        avatar: item.user.profilePhoto.url,
        date: moment(item.reservation.createdAt).fromNow(),
        dateDepart: new Date(item.reservation.dateDepart).toLocaleDateString(),
        dateFin: new Date(item.reservation.dateFin).toLocaleDateString(),
        nbChomber: item.reservation.nbChomber,
        nbPers: item.reservation.nbPers,
        details: item.reservation // Include all reservation details
      }));
      setReservations(reservationData);
    } catch (error) {
      message.error('Error fetching data. Please try again later.');
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (key) => {
    const authtoken = localStorage.getItem('token');
    try {
      await axios.put(`http://localhost:5000/api/reservations/accepte/${key}`, {}, {
        headers: { Authorization: `Bearer ${authtoken}` }
      });
      message.success('Reservation approved successfully!');
      getData();
    } catch (error) {
      message.error('Error approving reservation. Please try again.');
      console.error("Error approving reservation:", error);
    }
  };

  const handleDecline = async (key) => {
    const authtoken = localStorage.getItem('token');
    try {
      await axios.delete(`http://localhost:5000/api/reservations/deletReservation/${key}`, {
        headers: { Authorization: `Bearer ${authtoken}` }
      });
      message.success('Reservation declined successfully!');
      getData();
    } catch (error) {
      message.error('Error declining reservation. Please try again.');
      console.error("Error declining reservation:", error);
    }
  };

  const showModal = (record) => {
    setSelectedReservation(record);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedReservation(null);
  };

  const columns = [
    {
      title: 'User',
      dataIndex: 'userName',
      key: 'userName',
      sorter: (a, b) => a.userName.localeCompare(b.userName),
      render: (text, record) => (
        <span>
          <Avatar src={record.avatar} style={{ marginRight: 8 }} />
          {record.userName}
        </span>
      ),
    },
    {
      title: 'Establishment Name',
      dataIndex: 'establishment',
      key: 'establishment',
      sorter: (a, b) => a.establishment.localeCompare(b.establishment),
    },
    {
      title: 'Date of Application',
      dataIndex: 'date',
      key: 'date',
      sorter: (a, b) => new Date(a.date) - new Date(b.date),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <span>
          <Button
            type="primary"
            icon={<CheckOutlined />}
            onClick={() => handleApprove(record.key)}
            style={{ backgroundColor: 'green', borderColor: 'green' }}
          >
            Approve
          </Button>
          <Popconfirm
            title="Are you sure to decline this reservation?"
            onConfirm={() => handleDecline(record.key)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              type="default"
              icon={<CloseOutlined />}
              style={{ marginLeft: 8, backgroundColor: 'red', borderColor: 'red', color: 'white' }}
            >
              Decline
            </Button>
          </Popconfirm>
          <Button
            type="default"
            onClick={() => showModal(record)}
            style={{ marginLeft: 8 }}
          >
            View Details
          </Button>
        </span>
      ),
    },
  ];

  return (
    <div className="container" style={{ marginTop: '100px', minHeight: '100vh' }}>
      <CommonHeading
        heading="Reservations"
        title="Reservations"
        subtitle="Your"
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
          dataSource={reservations}
          pagination={{ pageSize: 10 }}
        />
      </Spin>
      {selectedReservation && (
        <Modal
          title="Reservation Details"
          visible={isModalVisible}
          onCancel={handleCancel}
          footer={[
            <Button key="close" onClick={handleCancel}>
              Close
            </Button>,
          ]}
          bodyStyle={{ padding: '20px' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
            <Avatar src={selectedReservation.avatar} size={64} style={{ marginRight: '16px' }} />
            <h3 style={{ margin: 0 }}>{selectedReservation.userName}</h3>
          </div>
          <Divider />
          <Descriptions bordered column={1} layout="horizontal" labelStyle={{ fontWeight: 'bold' }}>
            <Descriptions.Item label="Establishment">{selectedReservation.establishment}</Descriptions.Item>
            <Descriptions.Item label="Date of Application">{selectedReservation.date}</Descriptions.Item>
            <Descriptions.Item label="Date of Departure">{selectedReservation.dateDepart}</Descriptions.Item>
            <Descriptions.Item label="Date of End">{selectedReservation.dateFin}</Descriptions.Item>
            <Descriptions.Item label="Number of Rooms">{selectedReservation.nbChomber}</Descriptions.Item>
            <Descriptions.Item label="Number of Persons">{selectedReservation.nbPers}</Descriptions.Item>
          </Descriptions>
        </Modal>
      )}
    </div>
  );
};

export default ReservationTable;
