import React, { useState, useEffect } from 'react';
import { List, Avatar, Button, Popconfirm } from 'antd';
import axios from 'axios';
import CommonHeading from '../components/common/CommonHeading';

const AdminCommentsPage = () => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/eval', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setComments(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Function to handle comment deletion

const handleDelete = async (id) => {
  try {
    const token = localStorage.getItem('token');
    await axios.delete(`http://localhost:5000/api/eval/delete/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    // Filtrer et mettre à jour la liste des commentaires après la suppression
    const updatedComments = comments.filter(comment => comment._id !== id);
    setComments(updatedComments);
    getData()
  } catch (error) {
    console.error('Erreur lors de la suppression du commentaire :', error);
  }
};


  return (
    <div className="container" style={{ marginTop: '100px', minHeight: '100vh' }}>
      <CommonHeading
        heading="Comments"
        title="Comments"
        subtitle="manage"
      />
      <List
        itemLayout="horizontal"
        dataSource={comments}
        loading={loading}
        renderItem={item => (
          <List.Item
            actions={[
              <Popconfirm
                title="Are you sure you want to delete this comment?"
                onConfirm={() => handleDelete(item.evaluation._id)}
                okText="Yes"
                cancelText="No"
              >
                <Button type="danger">Delete</Button>
              </Popconfirm>
            ]}
          >
            <List.Item.Meta
              avatar={<Avatar src={item.user.profilePhoto?.url} />}
              title={`${item.user.nom} ${item.user.prenom}`}
              description={item.evaluation.Comment}
            />
          </List.Item>
        )}
      />
    </div>
  );
};

export default AdminCommentsPage;
