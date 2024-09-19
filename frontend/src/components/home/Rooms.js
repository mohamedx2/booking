import React, { useState, useEffect } from 'react';
import { Card, Button, Carousel } from 'antd';
import { StarFilled } from '@ant-design/icons';
import axios from 'axios';
import ViewRoomModal from './ViewRoomModal';
import BookRoomModal from './BookRoomModal';
import CommonHeading from '../common/CommonHeading';

const BlueButtonStyle = {
  backgroundColor: "#2aa3d1",
  borderColor: "#2aa3d1",
  color: "#fff"
};

const darkButtonStyle = {
  backgroundColor: "#343a40",
  borderColor: "#343a40",
  color: "#fff"
};

export default function RoomPage() {
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [isBookModalVisible, setIsBookModalVisible] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [numberOfPeople, setNumberOfPeople] = useState(1);
  const [dates, setDates] = useState([null, null]);
  const [roomItems, setRoomItems] = useState([]);
  const [userInfo, setUserInfo] = useState({});
  const [loading, setLoading] = useState(true);
    const isvalid = userInfo&& userInfo.verife;


  useEffect(() => {
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
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setUserInfo(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/etablissements/');
        const filteredItems = response.data.filter(item => item.Nbetoil === 5);
        setRoomItems(filteredItems);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const showViewModal = (item) => {
    setCurrentItem(item);
    setIsViewModalVisible(true);
  };

  const handleViewModalCancel = () => {
    setIsViewModalVisible(false);
  };

  const showBookModal = (item) => {
    setCurrentItem(item);
    setIsBookModalVisible(true);
  };

  const handleBookModalCancel = () => {
    setIsBookModalVisible(false);
  };

  const handleBookModalOk = () => {
    // Handle booking logic here
    setIsBookModalVisible(false);
  };

  const handleDateChange = (dates) => {
    setDates(dates);
  };

  return (
    <div style={{ marginTop: '100px',justifyContent:'center' }} className='container-xl py-5' >
      <div className='container' >
      <CommonHeading
        heading="Our Rooms"
        title="Rooms"
        subtitle="Explore Our"
      />
      <div >
        <Carousel dots={false} infinite={true} slidesToShow={3} slidesToScroll={1} autoplay    autoplaySpeed={1500}  style={{paddingLeft:'50px'}}>
          {roomItems.map((item, index) => (
            <div key={index}>
              <Card
              key={index}
              hoverable
              style={{ width: 320, margin: "16px", height: 400, display: "flex", flexDirection: "column", justifyContent: "space-between" }}
              cover={<img alt={item.nom} width={260} height={156} src={item.profilePhoto.url} />}
            >
              <Card.Meta title={item.nom} description={`TND${item.prix}/night`} />
              <div className="stars" style={{ margin: "10px 0" }}>
                {Array(item.Nbetoil)
                  .fill()
                  .map((_, i) => (
                    <StarFilled key={i} style={{ color: "#fadb14" }} />
                  ))}
              </div>
              <p style={{ color: "rgba(0, 0, 0, 0.45)", marginBottom: "10px", overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical" }}>
                {item.description}
              </p>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "auto" }}>
                <Button style={BlueButtonStyle} onClick={() => showViewModal(item)}>
                  View Details
                </Button>
                {isvalid ? (
                  <Button style={{ ...darkButtonStyle, marginLeft: "10px" }} onClick={() => showBookModal(item)}>
                    Book Now
                  </Button>
                ) : (
                  ""
                )}
              </div>
            </Card>
            </div>
          ))}
        </Carousel>
      </div>
      {currentItem && (
        <>
          <ViewRoomModal
            currentItem={currentItem}
            isVisible={isViewModalVisible}
            onCancel={handleViewModalCancel}
          />
          <BookRoomModal
            currentItem={currentItem}
            isVisible={isBookModalVisible}
            onCancel={handleBookModalCancel}
            onOk={handleBookModalOk}
            handleDateChange={handleDateChange}
            numberOfPeople={numberOfPeople}
            setNumberOfPeople={setNumberOfPeople}
            dates={dates}
          />
        </>
      )}
      </div>
    </div>
  );
}
