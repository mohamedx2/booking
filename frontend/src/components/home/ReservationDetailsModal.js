import React from 'react';
import { Modal, Descriptions, Avatar, Divider, Button } from 'antd';

const ReservationDetailsModal = ({ currentItem, isVisible, onCancel }) => {
  return (
    <Modal
      title="Reservation Details"
      visible={isVisible}
      onCancel={onCancel}
      footer={[
        <Button key="close" onClick={onCancel}>
          Close
        </Button>,
      ]}
      bodyStyle={{ padding: '20px' }}
    >
      {currentItem && (
        <>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
            <Avatar src={currentItem.avatar} size={64} style={{ marginRight: '16px' }} />
            <h3 style={{ margin: 0 }}>{currentItem.userName}</h3>
          </div>
          <Divider />
          <Descriptions bordered column={1} layout="horizontal" labelStyle={{ fontWeight: 'bold' }}>
            <Descriptions.Item label="Establishment">{currentItem.establishment}</Descriptions.Item>
            <Descriptions.Item label="Date of Application">{currentItem.date}</Descriptions.Item>
            <Descriptions.Item label="Date of Departure">{currentItem.dateDepart}</Descriptions.Item>
            <Descriptions.Item label="Date of End">{currentItem.dateFin}</Descriptions.Item>
            <Descriptions.Item label="Number of Rooms/Table">{currentItem.nbChomber}</Descriptions.Item>
            <Descriptions.Item label="Number of Persons">{currentItem.nbPers}</Descriptions.Item>
          </Descriptions>
        </>
      )}
    </Modal>
  );
};

export default ReservationDetailsModal;
