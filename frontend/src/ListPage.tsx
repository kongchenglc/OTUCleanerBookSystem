import { PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { ProList, ModalForm, ProFormText, ProFormTextArea } from '@ant-design/pro-components';
import { Button, Tag, message, Popconfirm, Card } from 'antd';
import React, { useState } from 'react';
import Header from './Header'; // 导入 Header 组件

export default () => {
  const [modalVisit, setModalVisit] = useState(false);
  const [editModalVisit, setEditModalVisit] = useState(false);
  const [currentPost, setCurrentPost] = useState(null);
  const [dataSource, setDataSource] = useState([
    { title: "Sample Post 1", content: "Looking for a cleaner for 2 hours.", price: "$20", time: "2 hours", place: "123 Main St", _id: "1" },
    { title: "Sample Post 2", content: "Need a cleaner for 3 hours.", price: "$30", time: "3 hours", place: "456 Oak St", _id: "2" }
  ]);

  // 新建 post 时，提交内容到本地数据源
  const handleFinish = async (values) => {
    const newPost = {
      title: values.name,
      content: values.content,
      price: values.price,
      time: values.time,
      place: values.place,
      _id: String(Date.now()),  // 使用时间戳作为 ID
    };
    setDataSource([...dataSource, newPost]); // 添加新 post 到列表
    message.success('Post created successfully');
    setModalVisit(false);
  };

  // 删除 post
  const handleDelete = (id) => {
    setDataSource(dataSource.filter((post) => post._id !== id)); // 从列表中移除已删除的 post
    message.success('Post deleted successfully');
  };

  // 编辑 post
  const handleEdit = (values) => {
    const updatedPost = {
      ...currentPost,
      title: values.name,
      content: values.content,
      price: values.price,
      time: values.time,
      place: values.place,
    };
    setDataSource(
      dataSource.map((post) => (post._id === currentPost._id ? updatedPost : post))
    ); // 更新 post
    message.success('Post updated successfully');
    setEditModalVisit(false);
  };

  return (
    <>
      <Header /> {/* 在页面顶部显示导航栏 */}
      <ProList<{ title: string; content: string; price: string; time: string; place: string; _id: string }>
        toolBarRender={() => {
          return [
            <Button
              key="modalButton"
              type="primary"
              onClick={() => {
                setModalVisit(true);  // 打开模态框
              }}
            >
              <PlusOutlined />
              Create new Post
            </Button>,
          ];
        }}
        itemLayout="vertical"
        rowKey="_id"
        headerTitle="Post List"
        dataSource={dataSource}  // 绑定本地数据源
        metas={{
          title: {
            dataIndex: 'title',
          },
          description: {
            render: (_, row) => (
              <>
                <Tag>Price: {row.price}</Tag>
                <Tag>Time: {row.time}</Tag>
                <Tag>Place: {row.place}</Tag>
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
                    setCurrentPost(row);  // 设定当前编辑的 post
                    setEditModalVisit(true);  // 打开编辑模态框
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
            render: (_, row) => {
              return (
                <Card style={{ marginBottom: 16 }}>
                  <div>{row.content}</div>
                </Card>
              );
            },
          },
        }}
      />

      {/* ModalForm - 新建 post */}
      <ModalForm
        title="Create new post"
        open={modalVisit}
        onFinish={handleFinish}  // 当用户点击提交时，直接更新本地数据源
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
        <ProFormText
          width="md"
          name="place"
          label="Work Place"
          placeholder="Enter work place"
          rules={[{ required: true, message: 'Please enter the work place' }]}
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

      {/* ModalForm - 编辑 post */}
      <ModalForm
        title="Edit post"
        open={editModalVisit}
        onFinish={handleEdit}  // 修改 post
        onOpenChange={setEditModalVisit}
        initialValues={{
          name: currentPost?.title,
          price: currentPost?.price,
          time: currentPost?.time,
          place: currentPost?.place,
          content: currentPost?.content,
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
        <ProFormText
          width="md"
          name="place"
          label="Work Place"
          placeholder="Enter work place"
          rules={[{ required: true, message: 'Please enter the work place' }]}
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
