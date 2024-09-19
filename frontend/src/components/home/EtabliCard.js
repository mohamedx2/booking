import React from 'react';
import { Card, Carousel, Skeleton, Popconfirm, Button } from 'antd';
import { EditOutlined, DeleteTwoTone, LeftOutlined, RightOutlined } from '@ant-design/icons';

const EtabliCard = ({ Etablissement, onDelete, onEdit }) => {
  if (!Etablissement) {
    return <Skeleton active />;
  }

  const images = [
    Etablissement.profilePhoto?.url,
    Etablissement.profilePhoto?.url1,
    Etablissement.profilePhoto?.url2,
    Etablissement.profilePhoto?.url3,
    Etablissement.profilePhoto?.url4,
    Etablissement.profilePhoto?.url5,
  ].filter(url => url);

  return (
    <Card
      bordered={false}
      style={{ width: '100%', marginBottom: 16 }}
      actions={[
        <span key="edit" onClick={() => onEdit(Etablissement)}>
          <EditOutlined /> Edit
        </span>,
        <Popconfirm
          title="Are you sure to delete this item?"
          onConfirm={() => onDelete(Etablissement._id)}
          okText="Yes"
          cancelText="No"
        >
          <Button type="link" style={{ color: "#d9534f" }}>
            <DeleteTwoTone twoToneColor="#d9534f" />
            Delete
          </Button>
        </Popconfirm>
      ]}
    >
      <h3>{Etablissement.nom}</h3>
      <p><strong>Email:</strong> {Etablissement.email}</p>
      <p><strong>Phone Number:</strong> {Etablissement.number}</p>
      <p><strong>Address:</strong> {Etablissement.adress}</p>
      <p><strong>Type:</strong> {Etablissement.__t}</p>
      <p><strong>Number of Stars:</strong> {Etablissement.Nbetoil}</p>
      <div style={{ marginBottom: 16 }}>
        <strong>Photos:</strong>
        {images.length > 0 ? (
          <Carousel autoplay arrows prevArrow={<LeftOutlined />} nextArrow={<RightOutlined />}>
            {images.map((url, index) => (
              <div key={index}>
                <img
                  src={url}
                  alt={`Room image ${index + 1}`}
                  style={{ width: '100%', height: '300px', objectFit: 'cover', borderRadius: '8px' }}
                />
              </div>
            ))}
          </Carousel>
        ) : (
          <Skeleton.Image style={{ width: '100%', height: '200px' }} />
        )}
      </div>
    </Card>
  );
};

export default EtabliCard;
