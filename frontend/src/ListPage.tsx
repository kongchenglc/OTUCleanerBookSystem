import { PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { ProList, ModalForm, ProFormText, ProFormTextArea } from '@ant-design/pro-components';
import { Button, Tag, message, Popconfirm, Card } from 'antd';
import React, { useState } from 'react';

export default () => {
  const [modalVisit, setModalVisit] = useState(false);
  const [editModalVisit, setEditModalVisit] = useState(false);
  const [currentArticle, setCurrentArticle] = useState(null);
  const [dataSource, setDataSource] = useState([
    { title: "Sample Article 1", content: "This is the content of article 1.", author: "Author 1", _id: "1" },
    { title: "Sample Article 2", content: "This is the content of article 2.", author: "Author 2", _id: "2" }
  ]);

  // 新建文章时，提交内容到本地数据源
  const handleFinish = async (values) => {
    const newArticle = {
      title: values.name,
      content: values.content,
      author: values.company,
      _id: String(Date.now()),  // 使用时间戳作为 ID
    };
    setDataSource([...dataSource, newArticle]); // 添加新文章到列表
    message.success('Submission successful');
    setModalVisit(false);
  };

  // 删除文章
  const handleDelete = (id) => {
    setDataSource(dataSource.filter((article) => article._id !== id)); // 从列表中移除已删除的文章
    message.success('Deletion successful');
  };

  // 编辑文章
  const handleEdit = (values) => {
    const updatedArticle = {
      ...currentArticle,
      title: values.name,
      content: values.content,
    };
    setDataSource(
      dataSource.map((article) => (article._id === currentArticle._id ? updatedArticle : article))
    ); // 更新文章
    message.success('Update successful');
    setEditModalVisit(false);
  };

  return (
    <>
      <ProList<{ title: string; content: string; author: string; _id: string }>
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
              Create new article
            </Button>,
          ];
        }}
        itemLayout="vertical"
        rowKey="_id"
        headerTitle="Article List"
        dataSource={dataSource}  // 绑定本地数据源
        metas={{
          title: {
            dataIndex: 'title',
          },
          description: {
            render: (_, row) => (
              <>
                <Tag>{row.author}</Tag>
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
                    setCurrentArticle(row);  // 设定当前编辑的文章
                    setEditModalVisit(true);  // 打开编辑模态框
                  }}
                >
                  Edit
                </Button>
                <Popconfirm
                  title="Are you sure you want to delete this article?"
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

      {/* ModalForm - 新建文章 */}
      <ModalForm
        title="Create new article"
        open={modalVisit}
        onFinish={handleFinish}  // 当用户点击提交时，直接更新本地数据源
        onOpenChange={setModalVisit}
      >
        <ProFormText
          width="md"
          name="name"
          label="Article Title"
          placeholder="Enter article title"
          rules={[{ required: true, message: 'Please enter the article title' }]}
        />
        <ProFormText
          width="md"
          name="company"
          label="Author"
          placeholder="Enter author name"
          rules={[{ required: true, message: 'Please enter the author name' }]}
        />

        <ProFormTextArea
          name="content"
          label="Article Content"
          placeholder="Enter article content"
          width="lg"
          fieldProps={{
            autoSize: { minRows: 5, maxRows: 10 },
          }}
          rules={[{ required: true, message: 'Please enter the article content' }]}
        />
      </ModalForm>

      {/* ModalForm - 编辑文章 */}
      <ModalForm
        title="Edit article"
        open={editModalVisit}
        onFinish={handleEdit}  // 修改文章
        onOpenChange={setEditModalVisit}
        initialValues={{
          name: currentArticle?.title,
          content: currentArticle?.content,
        }}
      >
        <ProFormText
          width="md"
          name="name"
          label="Article Title"
          placeholder="Enter article title"
          rules={[{ required: true, message: 'Please enter the article title' }]}
        />
        <ProFormTextArea
          name="content"
          label="Article Content"
          placeholder="Enter article content"
          width="lg"
          fieldProps={{
            autoSize: { minRows: 5, maxRows: 10 },
          }}
          rules={[{ required: true, message: 'Please enter the article content' }]}
        />
      </ModalForm>
    </>
  );
};
