import React, { useState,useEffect } from 'react';
import { Modal, Form, Input, InputNumber, DatePicker, Button, message } from 'antd';
import axios from 'axios';
import { Link } from "react-router-dom";

const UpdateReservationModal = ({ currentItem, isVisible, onCancel, handleDateChange }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false); // State to manage loading
  const isLoggedIn = localStorage.getItem('token') && localStorage.getItem('userId');
  useEffect(()=>{console.log("fghgfhgfhfghgfhgfh      ",currentItem)
    },[currentItem])

  const handleOk = () => {
    form.validateFields().then(values => {
      setLoading(true); // Set loading state to true when submission starts
      const { numberOfPeople, numberOfRooms, dates } = values;
      const reservationData = {
        idEtab: currentItem._id,
        idProp: currentItem.idProp,
        nbChomber: numberOfRooms ,
        nbPers: numberOfPeople,
        dateDepart: dates[0].toISOString(), // Convert to ISO string format
        dateFin: dates[1].toISOString() // Convert to ISO string format
      };
      const Token = localStorage.getItem('token');
  

      // Send reservation data to the API
      axios.put(`http://localhost:5000/api/reservations/${currentItem.key}`, reservationData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Token}`,
        },
      })
      .then(response => {
        message.success('Reservation updated successfully!');
        onCancel(); // Close the modal
        setLoading(false); // Reset loading state
        form.resetFields(); // Reset form fields
      })
      .catch(error => {
        setLoading(false); // Reset loading state
        if (error.response && error.response.status === 400) {
          message.error(`${currentItem.__t} est complet`);
        } else {
          message.error('Erreur lors de la réservation. Veuillez réessayer.');
        }
      });
    }).catch(() => {
      setLoading(false); // Reset loading state if validation fails
    });
  };

  return (
    <Modal
      title="Update Reservation"
      visible={isVisible}
      onCancel={onCancel}
      footer={isLoggedIn ? [
        <Button key="back" onClick={onCancel}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" loading={loading} onClick={handleOk}>
          Submit
        </Button>,
      ] : [
        <Link to='/login'>
          <Button type="primary">Login</Button>
        </Link>,
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
      ]}
      centered
    >
      {isLoggedIn ? (
        <>
          <Form
            form={form}
            layout="vertical"
            initialValues={{ numberOfPeople: 1, numberOfRooms: currentItem?.nbChomber}}
          >
            <Form.Item label="Hotel Name">
              <Input value={currentItem?.establishment} disabled />
            </Form.Item>
          
            
              <Form.Item
                label="Number of Tables/Rooms"
                name="numberOfRooms"
                rules={[{ required: true, message: 'Please input the number of rooms!' }]}
              >
              <InputNumber  value={currentItem?.nbChomber} disabled style={{ width: '100%' }} />
              </Form.Item>
            
            <Form.Item
              label="Number of People"
              name="numberOfPeople"
              rules={[{ required: true, message: 'Please input the number of people!' }]}
            >
              <InputNumber min={1} max={currentItem?.capacity}  style={{ width: '100%' }} />
            </Form.Item>
          
            <Form.Item
              label="Select Dates"
              name="dates"
              rules={[{ required: true, message: 'Please select the dates!' }]}
            >
              <DatePicker.RangePicker onChange={handleDateChange} style={{ width: '100%' }} />
            </Form.Item>
          </Form>
        </>
      ) : (
        <p>Please log in to update the reservation.</p>
      )}
    </Modal>
  );
};

export default UpdateReservationModal;
