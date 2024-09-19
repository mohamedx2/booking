import React, { useState, useEffect } from 'react';
import { Table, Button, Tag, Popconfirm, Spin, message, Avatar, Modal, Descriptions, Divider } from 'antd';
import { CloseOutlined, DeleteTwoTone, ReloadOutlined, SyncOutlined, InfoCircleOutlined } from '@ant-design/icons';
import axios from 'axios';
import CommonHeading from '../components/common/CommonHeading';
import UpdateReservationModal from '../components/home/UpdateReservationModal';
import ReservationDetailsModal from '../components/home/ReservationDetailsModal';
import moment from 'moment';

const ReservationTable = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const Token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:5000/api/reservations/getReservation/`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Token}`,
          },
        }
      );
      const data = response.data;
      const formattedData = formatData(data);
      setReservations(formattedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatData = (data) => {
    return Object.values(data).map(item => ({
      key: item.reservation._id,
      establishment: item.etablissement.nom,
      userName: `${item.user.nom} ${item.user.prenom}`,
      avatar: item.user.profilePhoto.url,
      date: moment(item.reservation.createdAt).fromNow(),
      dateDepart: new Date(item.reservation.dateDepart).toLocaleDateString(),
      dateFin: new Date(item.reservation.dateFin).toLocaleDateString(),
      nbChomber: item.reservation.nbChomber,
      nbPers: item.reservation.nbPers,
      status: item.reservation.isAccept ? 'Approved' : 'Pending',
      details: item.reservation // Include all reservation details
    }));
  };

  const handleDecline = async (key) => {
    const authtoken = localStorage.getItem("token");
    console.log('Declined reservation with key:', key);
    try {
      const response = await axios.delete(`http://localhost:5000/api/reservations/deletReservation/${key}`, {
        headers: { Authorization: `Bearer ${authtoken}` }
      });
      fetchData();
    } catch (error) {
      message.error('Error declining reservation:', error);
    }
  };

  const handleUpdate = (record) => {
    setCurrentItem(record);
    setUpdateModalVisible(true);
  };

  const handleViewDetails = (record) => {
    setCurrentItem(record);
    setDetailsModalVisible(true);
  };

  const handleCancel = () => {
    setUpdateModalVisible(false);
    setDetailsModalVisible(false);
    setCurrentItem(null);
  };

  const handleDateChange = () => {
    // handle date change logic if needed
  };

  const columns = [
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
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        let color;
        switch (status) {
          case 'Approved':
            color = 'green';
            break;
          case 'Pending':
            color = 'blue';
            break;
          case 'Declined':
            color = 'red';
            break;
          default:
            color = 'gray';
        }
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <span>
          <Popconfirm
            title="Are you sure to delete this reservation?"
            onConfirm={() => handleDecline(record.key)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" style={{ color: "#d9534f" }}>
              <DeleteTwoTone twoToneColor="#d9534f" />
              Cancel
            </Button>
          </Popconfirm>
          <span>
            <Button type="link" onClick={() => handleUpdate(record)}>
              <SyncOutlined />
              Update
            </Button>
          </span>
          <span>
            <Button type="link" onClick={() => handleViewDetails(record)}>
              <InfoCircleOutlined />
              View Details
            </Button>
          </span>
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
        onClick={fetchData}
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
      <UpdateReservationModal
        currentItem={currentItem}
        isVisible={updateModalVisible}
        onCancel={handleCancel}
        handleDateChange={handleDateChange}
      />
      <ReservationDetailsModal
        currentItem={currentItem}
        isVisible={detailsModalVisible}
        onCancel={handleCancel}
      />
    </div>
  );
};

export default ReservationTable;
