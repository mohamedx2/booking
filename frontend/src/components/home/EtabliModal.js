import React, { useState } from "react";
import {
  Form,
  Input,
  Button,
  Steps,
  Upload,
  Select,
  Modal,
  message,
  InputNumber,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";

const { Step } = Steps;
const { Option } = Select;
const { TextArea } = Input;

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

const EtabliModal = ({ isVisible, onClose, onAdd }) => {
  const [current, setCurrent] = useState(0);
  const [form] = Form.useForm();
  const [type, setType] = useState("");
  const [capacity, setCapacity] = useState(0);
  const [nombreEtoiles, setNombreEtoiles] = useState(0);
  const [prix, setPrix] = useState(0);
  const [profilePhotos, setProfilePhotos] = useState([]);
  const [idEtablissement, setIdEtablissement] = useState(null);
  const [uploading, setUploading] = useState(false);

  const Token = localStorage.getItem("token");
  const idProp = localStorage.getItem("userId");

  const next = async () => {
    if (current === 0) {
      try {
        await form.validateFields();
        const values = form.getFieldsValue();

        const commonFields = {
          idProp,
          nom: values.name,
          email: values.email,
          number: values.phone,
          adress: values.address,
          description: values.description,
          Nbetoil: nombreEtoiles,
          capacity,
          prix,
        };

        let response;
        if (type === "hotel") {
          const newHotel = { ...commonFields, capacity, prix };
          response = await axios.post(
            `http://localhost:5000/api/etablissements/addHotel`,
            newHotel,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${Token}`,
              },
            }
          );
        } else if (type === "restaurant") {
          const newRestaurant = { ...commonFields, capacity, prix };
          response = await axios.post(
            `http://localhost:5000/api/etablissements/addRestaurant`,
            newRestaurant,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${Token}`,
              },
            }
          );
        } else if (type === "maison") {
          const newMaison = { ...commonFields };
          response = await axios.post(
            `http://localhost:5000/api/etablissements/addMaison`,
            newMaison,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${Token}`,
              },
            }
          );
        }

        if (response && response.data) {
          setIdEtablissement(response.data._id);
          message.success(`${type.charAt(0).toUpperCase() + type.slice(1)} registered successfully!`);
          setCurrent(current + 1);
        } else {
          throw new Error("No response data");
        }
      } catch (error) {
        handleError(error, 'registering the establishment');
      }
    } else {
      setCurrent(current + 1);
    }
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const handleDone = async () => {
    try {
      await uploadPhotos(idEtablissement);
      onClose();
      form.resetFields();
      setCurrent(0);
      onAdd();
    } catch (error) {
      console.error("Error in handleDone:", error);
      message.error("Error finalizing the process. Please try again later.");
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

  const handleTypeChange = (value) => {
    setType(value);
  };

  const handleEtoilesChange = (value) => {
    setNombreEtoiles(value);
  };

  const handlePhotoChange = ({ fileList }) => {
    setProfilePhotos(fileList.slice(-5)); // Limit to 5 files
  };

  const uploadPhotos = async (idEtablissement) => {
    const formData = new FormData();
    profilePhotos.forEach((file) => {
      formData.append("profilePhotos", file.originFileObj);
    });

    try {
      setUploading(true);
      await axios.post(
        `http://localhost:5000/api/etablissements/uploadPhotos/${idEtablissement}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${Token}`,
          },
        }
      );
      setUploading(false);
      message.success("Photos uploaded successfully!");
      window.location.href = '/owner';
    } catch (error) {
      handleError(error, 'uploading photos');
    }
  };

  const steps = [
    {
      title: "Details and Contact",
      content: (
        <Form form={form} layout="vertical" name="step1">
          <Form.Item
            name="type"
            label="Type"
            rules={[{ required: true, message: "Please select the type!" }]}
          >
            <Select placeholder="Select the type" onChange={handleTypeChange}>
              <Option value="hotel">Hotel</Option>
              <Option value="restaurant">Restaurant</Option>
              <Option value="maison">Maison d'hôte</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: "Please input the name!" }]}
          >
            <Input placeholder="Enter the name" />
          </Form.Item>
          <Form.Item
            name="address"
            label="Address"
            rules={[{ required: true, message: "Please select the address!" }]}
          >
            <Select placeholder="Select the address">
              {locations.map((location) => (
                <Option key={location} value={location}>
                  {location}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="phone"
            label="Phone Number"
            rules={[
              { required: true, message: "Please input the phone number!" },
            ]}
          >
            <Input placeholder="Enter the phone number" />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Please input the email!" },
              { type: "email", message: "The input is not valid E-mail!" },
            ]}
          >
            <Input placeholder="Enter the email" />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: "Please input the description!" }]}
          >
            <TextArea rows={4} placeholder="Enter the description" />
          </Form.Item>
          <Form.Item
            name="capacity"
            label="Capacity"
            rules={[
              { required: true, message: "Please input the capacity!" },
            ]}
          >
            <InputNumber
              style={{ width: "100%" }}
              min={0}
              onChange={(value) => setCapacity(value)}
            />
          </Form.Item>
          <Form.Item
            name="prix"
            label="Prix"
            rules={[{ required: true, message: "Please input the price!" }]}
          >
            <InputNumber
              style={{ width: "100%" }}
              min={0}
              onChange={(value) => setPrix(value)}
            />
          </Form.Item>
          <Form.Item
            name="nombreEtoiles"
            label="Nombre d'étoiles"
            rules={[
              {
                required: true,
                message: "Veuillez sélectionner le nombre d'étoiles!",
              },
            ]}
          >
            <Select
              placeholder="Sélectionnez le nombre d'étoiles"
              onChange={handleEtoilesChange}
            >
              {[1, 2, 3, 4, 5].map((etoile) => (
                <Option key={etoile} value={etoile}>
                  {etoile} étoile{etoile > 1 ? "s" : ""}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      ),
    },
    {
      title: "Upload Photos",
      content: (
        <Upload
          listType="picture-card"
          fileList={profilePhotos}
          onChange={handlePhotoChange}
          beforeUpload={() => false}
          multiple
        >
          {profilePhotos.length >= 5 ? null : (
            <div>
              <UploadOutlined />
              <div style={{ marginTop: 8 }}>Upload</div>
            </div>
          )}
        </Upload>
      ),
    },
  ];

  return (
    <Modal
      title="Ajouter un établissement"
      visible={isVisible}
      onCancel={() => {
        form.resetFields();
        setCurrent(0);
        onClose();
      }}
      footer={null}
    >
      <Steps current={current}>
        {steps.map((item) => (
          <Step key={item.title} title={item.title} />
        ))}
      </Steps>
      <div className="steps-content" style={{ marginTop: 24 }}>
        {steps[current].content}
      </div>
      <div className="steps-action" style={{ marginTop: 24 }}>
        {current < steps.length - 1 && (
          <Button type="primary" onClick={next}>
            Next
          </Button>
        )}
        {current === steps.length - 1 && (
          <Button
            type="primary"
            onClick={handleDone}
            loading={uploading}
            disabled={uploading}
          >
            Done
          </Button>
        )}
        {current > 0 && (
          <Button style={{ margin: '0 8px' }} onClick={prev}>
            Previous
          </Button>
        )}
      </div>
    </Modal>
  );
};

export default EtabliModal;
