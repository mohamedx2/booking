import React, { useState } from "react";
import { Modal, Upload, Button, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";

const EditImageModal = ({ isVisible, onClose, establishment, onUpdate }) => {
  const [profilePhotos, setProfilePhotos] = useState([]);
  const [uploading, setUploading] = useState(false);

  const Token = localStorage.getItem("token");

  const handlePhotoChange = ({ fileList }) => {
    // Ensure each file has a unique identifier and proper status
    const updatedFileList = fileList.map(file => ({
      ...file,
      status: file.status || 'done',
      uid: file.uid || Math.random().toString(36).substring(2)
    }));
    setProfilePhotos(updatedFileList.slice(-5)); // Limit to 5 files
  };

  const handleUpload = async () => {
    if (profilePhotos.length === 0) {
      message.warning("Please select at least one photo to upload.");
      return;
    }

    const formData = new FormData();
    profilePhotos.forEach((file) => {
      formData.append("profilePhotos", file.originFileObj);
    });

    try {
      setUploading(true);

      // Update each file status to 'uploading'
      setProfilePhotos(prevFiles =>
        prevFiles.map(file => ({
          ...file,
          status: 'uploading'
        }))
      );

      const response = await axios.post(
        `http://localhost:5000/api/etablissements/uploadPhotos/${establishment._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${Token}`,
          },
        }
      );

      if (response.status === 200) {
        message.success("Photos uploaded successfully!");
        setProfilePhotos(prevFiles =>
          prevFiles.map(file => ({
            ...file,
            status: 'done'
          }))
        );
        onUpdate();
        onClose();
      } else {
        message.error(`Upload failed: ${response.statusText}`);
        setProfilePhotos(prevFiles =>
          prevFiles.map(file => ({
            ...file,
            status: 'error'
          }))
        );
      }
    } catch (error) {
      console.error("Error uploading photos:", error);
      setProfilePhotos(prevFiles =>
        prevFiles.map(file => ({
          ...file,
          status: 'error'
        }))
      );

      if (error.response) {
        message.error(`Upload failed: ${error.response.data.message || error.response.statusText}`);
      } else if (error.request) {
        message.error("No response from server. Please check your internet connection and try again.");
      } else {
        message.error(`Error: ${error.message}`);
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <Modal
      title="Edit Photos"
      visible={isVisible}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button
          key="upload"
          type="primary"
          onClick={handleUpload}
          loading={uploading}
          disabled={uploading}
        >
          Upload
        </Button>
      ]}
    >
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
    </Modal>
  );
};

export default EditImageModal;
