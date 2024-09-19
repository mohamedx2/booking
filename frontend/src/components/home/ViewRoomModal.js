import React, { useState, useEffect } from 'react';
import { Modal, Carousel, Typography, Row, Col, Button, Rate, List, Avatar, Form, Input, Drawer } from 'antd';
import { LeftOutlined, RightOutlined, CloseOutlined, CommentOutlined } from '@ant-design/icons';
import axios from 'axios';
import moment from 'moment';

const { Title, Paragraph } = Typography;
const { TextArea } = Input;

const CustomComment = ({ author, avatar, content, datetime }) => (
  <div style={{ display: 'flex', marginBottom: '16px' }}>
    <Avatar src={avatar} alt={author} style={{ marginRight: '8px' }} />
    <div>
      <div style={{ fontWeight: 'bold' }}>{author}</div>
      <div>{content}</div>
      <div style={{ fontSize: '12px', color: 'gray' }}>{datetime}</div>
    </div>
  </div>
);

const ViewRoomModal = ({ currentItem, isVisible, onCancel }) => {
  const [comments, setComments] = useState([]);
  const [commentValue, setCommentValue] = useState('');
  const [drawerVisible, setDrawerVisible] = useState(false);

  useEffect(() => {
    if (isVisible && currentItem) {
      fetchComments();
    }
  }, [isVisible, currentItem]);

  const fetchComments = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/eval/${currentItem._id}`);
      const fetchedComments = response.data.map(comment => ({
        content: comment.evaluation.Comment,
        datetime: moment(comment.evaluation.createdAt).fromNow(),
        avatar: comment.user.profilePhoto.url,
        author: `${comment.user.nom} ${comment.user.prenom}`,
      }));
      setComments(fetchedComments);
    } catch (error) {
      console.error('Failed to fetch comments:', error);
      // Handle error (e.g., display an error message to the user)
    }
  };

  const handleCommentSubmit = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      // Handle missing token error
      return;
    }

    const commentData = {
      idEtab: currentItem._id,
      Comment: commentValue,
    };

    try {
      const response = await axios.post('http://localhost:5000/api/eval', commentData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const newComment = {
        content: commentValue,
        datetime: moment().fromNow(),
        avatar: 'https://joeschmoe.io/api/v1/random', // Replace with the actual avatar URL if available
        author: 'Current User', // Replace with the actual user's name if available
      };

      setComments([...comments, newComment]);
      setCommentValue('');
      fetchComments(); // Refresh comments after adding a new one
    } catch (error) {
      console.error('Failed to submit comment:', error);
      // Handle error (e.g., display an error message to the user)
    }
  };

  const showDrawer = () => {
    setDrawerVisible(true);
  };

  const closeDrawer = () => {
    setDrawerVisible(false);
  };

  if (!currentItem) {
    return null;
  }

  const { profilePhoto } = currentItem;

  const images = [
    profilePhoto.url,
    profilePhoto.url1,
    profilePhoto.url3,
    profilePhoto.url4,
    profilePhoto.url5,
  ].filter(url => url); // Filter out null or undefined URLs

  return (
    <>
      <Modal
        title={currentItem.nom}
        visible={isVisible}
        onCancel={onCancel}
        footer={null}
        width={800}
        closeIcon={<Button shape="circle" icon={<CloseOutlined />} aria-label="Close modal" />}
        bodyStyle={{ padding: '24px' }}
        centered
      >
        <Carousel autoplay arrows prevArrow={<LeftOutlined />} nextArrow={<RightOutlined />} dotPosition="bottom">
          {images.map((url, index) => (
            <div key={index}>
              <img
                src={url}
                alt={`Etablisement image ${index + 1}`}
                style={{ width: '100%', height: '400px', objectFit: 'cover', borderRadius: '8px' }}
              />
            </div>
          ))}
        </Carousel>
        <div style={{ marginTop: '20px', fontSize: '16px' }}>
          <div style={{ marginBottom: '16px' }}>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Rate disabled defaultValue={currentItem.Nbetoil} allowHalf style={{ color: '#ffc107', fontSize: '16px' }} />
              </Col>
            </Row>
          </div>
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Title level={5}>Address</Title>
              <Paragraph>{currentItem.adress}</Paragraph>
            { currentItem?.__t==="Maison"? <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Title level={5}>Capacity</Title>
                  <Paragraph>{currentItem.capacity} chomber</Paragraph>
                </Col>
              </Row>:""}
            </Col>
            <Col span={12}>
              <Title level={5}>Price</Title>
              <Paragraph>TND {currentItem.prix} per night</Paragraph>
              <Title level={5}>Contact</Title>
              <Paragraph>Email: {currentItem.email}</Paragraph>
              <Paragraph>Number: {currentItem.number}</Paragraph>
            </Col>
          </Row>
          <Button type="primary" icon={<CommentOutlined />} onClick={showDrawer} style={{ marginTop: '20px' }}>
            View Comments
          </Button>
        </div>
      </Modal>
      <Drawer
        title="Comments"
        width={400}
        onClose={closeDrawer}
        visible={drawerVisible}
        bodyStyle={{ paddingBottom: 80 }}
      >
        <List
          className="comment-list"
          itemLayout="horizontal"
          dataSource={comments}
          renderItem={item => (
            <CustomComment
              author={item.author}
              avatar={item.avatar}
              content={item.content}
              datetime={item.datetime}
            />
          )}
        />
        <Form.Item>
          <TextArea rows={4} onChange={e => setCommentValue(e.target.value)} value={commentValue} />
        </Form.Item>
        <Form.Item>
          <Button htmlType="submit" type="primary" onClick={handleCommentSubmit}>
            Add Comment
          </Button>
        </Form.Item>
      </Drawer>
    </>
  );
};

export default ViewRoomModal;
