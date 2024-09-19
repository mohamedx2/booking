import React, { useEffect, useState } from "react";
import {
  Card,
  Button,
  Input,
  Slider,
  Switch,
  Rate,
  Select,
  Spin,
  Empty,
} from "antd";
import { StarFilled } from "@ant-design/icons";
import CommonHeading from "../components/common/CommonHeading";
import axios from "axios";
import ViewRoomModal from "../components/home/ViewRoomModal";
import BookRoomModal from "../components/home/BookRoomModal";

const { Option } = Select;

const locations = [
  "Ariana",
  "Beja",
  "Ben Arous",
  "Bizerte",
  "Gabes",
  "Gafsa",
  "Jendouba",
  "Kairouan",
  "Kasserine",
  "Kebili",
  "Kef",
  "Mahdia",
  "Manouba",
  "Medenine",
  "Monastir",
  "Nabeul",
  "Sfax",
  "Sidi Bouzid",
  "Siliana",
  "Sousse",
  "Tataouine",
  "Tozeur",
  "Tunis",
  "Zaghouan",
];

const BlueButtonStyle = {
  backgroundColor: "#343a40",
  borderColor: "#343a40",
  color: "#fff",
};

const darkButtonStyle = {
  backgroundColor: "#2aa3d1",
  borderColor: "#2aa3d1",
  color: "#fff",
};

export default function RoomPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [disabled, setDisabled] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [starRating, setStarRating] = useState(0);
  const [selectedOption, setSelectedOption] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [isBookModalVisible, setIsBookModalVisible] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [numberOfPeople, setNumberOfPeople] = useState(1);
  const [dates, setDates] = useState([null, null]);
  const [rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getData();
  }, []);
  const [userInfo, setUserInfo] = useState({});

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

  const getData = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("http://localhost:5000/api/etablissements/");
      setRooms(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  const onChangeDisabled = (checked) => {
    setDisabled(checked);
  };

  const onPriceRangeChange = (value) => {
    setPriceRange(value);
  };

  const onStarRatingChange = (value) => {
    setStarRating(value);
  };

  const onOptionChange = (value) => {
    setSelectedOption(value);
  };

  const onLocationChange = (value) => {
    setSelectedLocation(value);
  };

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

  const handleBookModalOk = (values) => {
    console.log("Booking confirmed with values:", values);
    setIsBookModalVisible(false);
  };

  const handleDateChange = (dates) => {
    setDates(dates);
  };

  useEffect(() => {
    filterRooms();
  }, [searchQuery, priceRange, starRating, selectedOption, selectedLocation, rooms]);

  const filterRooms = () => {
    const filtered = rooms.filter((room) => {
      const priceInRange = room.prix >= priceRange[0] && room.prix <= priceRange[1];
      const starRatingMatch = starRating !== 0 ? room.Nbetoil === starRating : room.Nbetoil >= starRating;
      const optionMatch = selectedOption ? room.__t === selectedOption : true;
      const locationMatch = selectedLocation ? room.adress.toLowerCase() === selectedLocation : true;
      const searchMatch = room.nom && room.nom.toLowerCase().includes(searchQuery.toLowerCase());
      return priceInRange && optionMatch && locationMatch && searchMatch && starRatingMatch;
    });
    setFilteredRooms(filtered);
  };

  return (
    <div style={{ marginTop: "100px", minHeight: "100vh" }}>
      <CommonHeading heading="Our Offers" title="Offers" subtitle="Explore Our" />
      <div style={{ display: "flex", padding: "20px", flexWrap: "wrap" }}>
        <div style={{ marginRight: "20px", minWidth: "210px", marginTop: "20px", padding: "10px", borderRadius: "5px" }}>
          <Input
            placeholder="Search Offers"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ marginBottom: "20px", width: "100%" }}
          />
          <Slider
            range
            defaultValue={[0, 1000]}
            max={1000}
            disabled={disabled}
            style={{ width: "100%", marginBottom: "10px" }}
            onChange={onPriceRangeChange}
          />
          <div style={{ marginBottom: "20px", width: "100%" }}>
            Price range: TND {priceRange[0]} - TND {priceRange[1]}
          </div>
          <div style={{ marginBottom: "20px", width: "100%" }}>
            Disabled: <Switch size="small" checked={disabled} onChange={onChangeDisabled} />
          </div>
          <div style={{ marginBottom: "20px", width: "100%" }}>
            Star Rating: <Rate onChange={onStarRatingChange} value={starRating} />
          </div>
          <div style={{ marginBottom: "20px", width: "100%" }}>Establishment:</div>
          <Select defaultValue="" style={{ width: "100%", marginBottom: "20px" }} onChange={onOptionChange}>
            <Option value="">All</Option>
            <Option value="Hotel">Hotel</Option>
            <Option value="Maison">Maison d'hote</Option>
            <Option value="Restaurant">Restaurant</Option>
          </Select>
          <div style={{ marginBottom: "20px", width: "100%" }}>State:</div>
          <Select defaultValue="" style={{ width: "100%" }} onChange={onLocationChange}>
            <Option value="">All</Option>
            {locations.map((location) => (
              <Option key={location} value={location.toLowerCase()}>
                {location}
              </Option>
            ))}
          </Select>
        </div>
       
        <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", justifyContent: "center", flex: 1 }}>
          {loading ? (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", width: "100%" }}>
              <Spin />
            </div>
          ) : filteredRooms.length === 0 ? (
            <Empty description="No Offers available" style={{ marginTop: "100px" }} />
          ) : (
            filteredRooms.map((item, index) => (
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
                <Button style={darkButtonStyle} onClick={() => showViewModal(item)}>
                  View Details
                </Button>
                {isvalid ? (
                  <Button style={{ ...BlueButtonStyle, marginLeft: "10px" }} onClick={() => showBookModal(item)}>
                    Book Now
                  </Button>
                ) : (
                  ""
                )}
              </div>
            </Card>
            
            ))
          )}
        </div>
      </div>

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
      />
    </div>
  );
}
