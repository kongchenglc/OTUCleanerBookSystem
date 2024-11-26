import { PlusOutlined, DeleteOutlined, EditOutlined, CheckOutlined } from '@ant-design/icons';
import { ProList, ModalForm, ProFormText, ProFormTextArea } from '@ant-design/pro-components';
import { Button, Tag, message, Popconfirm, Card } from 'antd';
import React, { useState, useEffect } from 'react';
import Header from './Header';

export default () => {
  const [modalVisit, setModalVisit] = useState(false);
  const [editModalVisit, setEditModalVisit] = useState(false);
  const [currentPost, setCurrentPost] = useState(null);
  const [dataSource, setDataSource] = useState([]);
  const API_URL = import.meta.env.VITE_API_URL;


  // 获取存储在浏览器中的 homeownerId
  const homeownerId = localStorage.getItem('homeownerId');

  // Fetch all services from the backend
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(`${API_URL}/services/getAllServices`,{
          method: 'POST',
          credentials: 'include',
        });
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
      homeownerId: homeownerId,
    };

    try {
      const response = await fetch(`${API_URL}/services/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPost),
        credentials: 'include',
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
      const response = await fetch(`${API_URL}/services/${id}`, {
        method: 'DELETE',
        credentials: 'include',
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

  // Mark job as finished
  const handleMarkAsFinished = async (post) => {
    try {
      const response = await fetch(`${API_URL}/services/${post._id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'finished' }),
      });

      if (response.ok) {
        message.success('Job marked as finished');
        setDataSource(
          dataSource.map((item) =>
            item._id === post._id ? { ...item, status: 'finished' } : item
          )
        );
      } else {
        const errorText = await response.text();
        console.error('Error marking job as finished:', errorText);
        message.error(`Failed to mark job as finished: ${errorText}`);
      }
    } catch (error) {
      console.error('Detailed error:', error);
      message.error(`Failed to mark job as finished. Detailed error: ${error.message}`);
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
      const response = await fetch(`${API_URL}/services/${currentPost._id}`, {
        method: 'PUT',
        credentials: 'include',
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
        dataSource={dataSource.sort((a, b) => {
          const statusOrder = ['waiting cleaner', 'in progress', 'finished'];
          return statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status);
        })}
        metas={{
          title: {
            dataIndex: 'name',
          },
          description: {
            render: (_, row) => (
              <>
                <Tag>Price: {row.basePrice}</Tag>
                <Tag>Duration: {row.duration}</Tag>
                <Tag>Status: {row.status}</Tag>
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
                  disabled={row.status === 'finished'}
                >
                  Edit
                </Button>
                <Button
                  type="link"
                  icon={<DeleteOutlined />}
                  danger
                  disabled={row.status === 'finished'}
                  onClick={() => handleDelete(row._id)}
                >
                  Delete
                </Button>
                {row.status === 'in progress' && (
                  <Popconfirm
                    title="Are you sure you want to mark this job as finished?"
                    onConfirm={() => handleMarkAsFinished(row)}
                    okText="Yes"
                    cancelText="No"
                  >
                    <Button type="link" icon={<CheckOutlined />} style={{ color: 'green' }}>
                      Finish
                    </Button>
                  </Popconfirm>
                )}
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
        submitter={{
          searchConfig: {
            submitText: 'Submit',
            resetText: 'Cancel',
          },
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
        submitter={{
          searchConfig: {
            submitText: 'Save',
            resetText: 'Cancel',
          },
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
