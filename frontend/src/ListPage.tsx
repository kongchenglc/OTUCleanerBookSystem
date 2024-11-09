import { PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { ProList, ModalForm, ProFormText, ProFormTextArea } from '@ant-design/pro-components';
import { Button, Tag, message, Popconfirm, Card } from 'antd';
import React, { useState, useEffect } from 'react';
import Header from './Header';

export default () => {
  const [modalVisit, setModalVisit] = useState(false);
  const [editModalVisit, setEditModalVisit] = useState(false);
  const [currentPost, setCurrentPost] = useState(null);
  const [dataSource, setDataSource] = useState([]);

  // Fetch all services from the backend
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/v1/services/getAllServices');
        const result = await response.json();
        if (response.ok) {
          setDataSource(result.data || []);
        } else {
          console.error("Error fetching posts:", result.message);
          message.error(`Failed to fetch posts: ${result.message}`);
        }
      } catch (error) {
        console.error("Detailed error:", error);
        message.error("Failed to fetch posts. Check console for details.");
      }
    };

    fetchPosts();
  }, []);

  // Create new post
  const handleFinish = async (values) => {
    const newPost = {
      name: values.name,
      description: values.content,
      basePrice: values.price,
      duration: values.time,
    };

    try {
      const response = await fetch('http://localhost:8000/api/v1/services/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPost),
      });

      if (response.ok) {
        const createdPost = await response.json();
        message.success('Post created successfully');
        setDataSource([...dataSource, createdPost.data]);
        setModalVisit(false);
      } else {
        const errorText = await response.text();
        console.error('Error creating post:', errorText);
        message.error(`Failed to create post: ${errorText}`);
      }
    } catch (error) {
      console.error('Detailed error:', error);
      message.error(`Failed to create post. Detailed error: ${error.message}`);
    }
  };

  // Delete post
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:8000/api/v1/services/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        message.success('Post deleted successfully');
        setDataSource(dataSource.filter((post) => post._id !== id));
      } else {
        const errorText = await response.text();
        console.error('Error deleting post:', errorText);
        message.error(`Failed to delete post: ${errorText}`);
      }
    } catch (error) {
      console.error('Detailed error:', error);
      message.error(`Failed to delete post. Detailed error: ${error.message}`);
    }
  };

  // Edit post
  const handleEdit = async (values) => {
    const updatedPost = {
      name: values.name,
      description: values.content,
      basePrice: values.price,
      duration: values.time,
    };

    try {
      const response = await fetch(`http://localhost:8000/api/v1/services/${currentPost._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedPost),
      });

      if (response.ok) {
        message.success('Post updated successfully');
        setDataSource(
          dataSource.map((post) => (post._id === currentPost._id ? { ...post, ...updatedPost } : post))
        );
        setEditModalVisit(false);
      } else {
        const errorText = await response.text();
        console.error('Error updating post:', errorText);
        message.error(`Failed to update post: ${errorText}`);
      }
    } catch (error) {
      console.error('Detailed error:', error);
      message.error(`Failed to update post. Detailed error: ${error.message}`);
    }
  };

  return (
    <>
      <Header />
      <ProList
        toolBarRender={() => [
          <Button
            key="modalButton"
            type="primary"
            onClick={() => {
              setModalVisit(true);
            }}
          >
            <PlusOutlined />
            Create new Post
          </Button>,
        ]}
        itemLayout="vertical"
        rowKey="_id"
        headerTitle="Post List"
        dataSource={dataSource}
        metas={{
          title: {
            dataIndex: 'name',
          },
          description: {
            render: (_, row) => (
              <>
                <Tag>Price: {row.basePrice}</Tag>
                <Tag>Duration: {row.duration}</Tag>
              </>
            ),
          },
          actions: {
            render: (_, row) => [
              <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
                <Button
                  type="link"
                  icon={<EditOutlined />}
                  onClick={() => {
                    setCurrentPost(row);
                    setEditModalVisit(true);
                  }}
                >
                  Edit
                </Button>
                <Popconfirm
                  title="Are you sure you want to delete this post?"
                  onConfirm={() => handleDelete(row._id)}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button type="link" icon={<DeleteOutlined />} danger>
                    Delete
                  </Button>
                </Popconfirm>
              </div>
            ],
          },
          content: {
            render: (_, row) => (
              <Card style={{ marginBottom: 16 }}>
                <div>{row.description}</div>
              </Card>
            ),
          },
        }}
      />

      {/* ModalForm - Create new post */}
      <ModalForm
        title="Create new post"
        open={modalVisit}
        onFinish={handleFinish}
        onOpenChange={setModalVisit}
      >
        <ProFormText
          width="md"
          name="name"
          label="Post Title"
          placeholder="Enter post title"
          rules={[{ required: true, message: 'Please enter the post title' }]}
        />
        <ProFormText
          width="md"
          name="price"
          label="Price"
          placeholder="Enter price"
          rules={[{ required: true, message: 'Please enter the price' }]}
        />
        <ProFormText
          width="md"
          name="time"
          label="Approximate Time"
          placeholder="Enter approximate time"
          rules={[{ required: true, message: 'Please enter the approximate time' }]}
        />
        <ProFormTextArea
          name="content"
          label="Post Content"
          placeholder="Enter post content"
          width="lg"
          fieldProps={{
            autoSize: { minRows: 5, maxRows: 10 },
          }}
          rules={[{ required: true, message: 'Please enter the post content' }]}
        />
      </ModalForm>

      {/* ModalForm - Edit post */}
      <ModalForm
        title="Edit post"
        open={editModalVisit}
        onFinish={handleEdit}
        onOpenChange={setEditModalVisit}
        initialValues={{
          name: currentPost?.name,
          price: currentPost?.basePrice,
          time: currentPost?.duration,
          content: currentPost?.description,
        }}
      >
        <ProFormText
          width="md"
          name="name"
          label="Post Title"
          placeholder="Enter post title"
          rules={[{ required: true, message: 'Please enter the post title' }]}
        />
        <ProFormText
          width="md"
          name="price"
          label="Price"
          placeholder="Enter price"
          rules={[{ required: true, message: 'Please enter the price' }]}
        />
        <ProFormText
          width="md"
          name="time"
          label="Approximate Time"
          placeholder="Enter approximate time"
          rules={[{ required: true, message: 'Please enter the approximate time' }]}
        />
        <ProFormTextArea
          name="content"
          label="Post Content"
          placeholder="Enter post content"
          width="lg"
          fieldProps={{
            autoSize: { minRows: 5, maxRows: 10 },
          }}
          rules={[{ required: true, message: 'Please enter the post content' }]}
        />
      </ModalForm>
    </>
  );
};
