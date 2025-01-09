import React, { useEffect, useState } from 'react';
import {
 Layout,
 Row,
 Col,
 Typography,
 Table,
 Input,
 Button,
 Space,
 Tag,
 Popconfirm,
 Avatar,
 Spin,
 message,
} from 'antd';
import { SearchOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useTranslation } from '../../context/TranslationContext';
import Head from '../../components/common/header';
import Foot from '../../components/common/footer';
import { useUserData } from '../../hooks/useUserData';
import { useNavigate } from 'react-router-dom';

const { Content } = Layout;
const { Title } = Typography;

const Managers = () => {
 const {
  Managers = [], // Default to an empty array
  isLoading,
  fetchAllManagers,
  deleteManagerById,
  success,
  error,
 } = useUserData();
 const [searchText, setSearchText] = useState('');
 const [searchedColumn, setSearchedColumn] = useState('');
 const navigate = useNavigate();
 const { t } = useTranslation();

 useEffect(() => {
  fetchAllManagers();
 }, [isLoading]);

 const handleSearch = (selectedKeys, confirm, dataIndex) => {
  confirm();
  setSearchText(selectedKeys[0]);
  setSearchedColumn(dataIndex);
 };

 const handleReset = (clearFilters) => {
  clearFilters();
  setSearchText('');
 };

 const getColumnSearchProps = (dataIndex) => ({
  filterDropdown: ({
   setSelectedKeys,
   selectedKeys,
   confirm,
   clearFilters,
  }) => (
   <div style={{ padding: 8 }}>
    <Input
     placeholder={t('common.search')}
     value={selectedKeys[0]}
     onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
     onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
     style={{ marginBottom: 8, display: 'block' }}
    />
    <Space>
     <Button
      type="primary"
      onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
      icon={<SearchOutlined />}
      size="small"
      style={{ width: 90 }}
     >
      {t('common.search')}
     </Button>
     <Button
      onClick={() => handleReset(clearFilters)}
      size="small"
      style={{ width: 90 }}
     >
      {t('common.reset')}
     </Button>
    </Space>
   </div>
  ),
  filterIcon: (filtered) => (
   <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
  ),
  onFilter: (value, record) =>
   record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
  render: (text) =>
   searchedColumn === dataIndex ? <strong>{text}</strong> : text,
 });

 const columns = [
  {
   title: t('common.avatar'),
   dataIndex: 'avatar',
   key: 'avatar',
   render: (avatar) => <Avatar src={avatar} />,
  },
  {
   title: t('common.email'),
   dataIndex: 'email',
   key: 'email',
   sorter: (a, b) => a.email.localeCompare(b.email),
   ...getColumnSearchProps('email'),
  },
  {
   title: t('account.firstName'),
   dataIndex: 'firstname',
   key: 'firstname',
   sorter: (a, b) => a.firstname.localeCompare(b.firstname),
   ...getColumnSearchProps('firstname'),
  },
  {
   title: t('account.lastName'),
   dataIndex: 'lastname',
   key: 'lastname',
   sorter: (a, b) => a.lastname.localeCompare(b.lastname),
   ...getColumnSearchProps('lastname'),
  },
  {
   title: t('common.phone'),
   dataIndex: 'phone',
   key: 'phone',
   sorter: (a, b) => a.phone.localeCompare(b.phone),
   ...getColumnSearchProps('phone'),
  },
  {
   title: t('manager.verified'),
   dataIndex: 'isVerified',
   key: 'isVerified',
   filters: [
    { text: t('manager.verifiedStatus.verified'), value: true },
    { text: t('manager.verifiedStatus.unverified'), value: false },
   ],
   onFilter: (value, record) => record.isVerified === value,
   render: (isVerified) => (
    <Tag color={isVerified ? 'green' : 'red'}>
     {isVerified
      ? t('manager.verifiedStatus.verified')
      : t('manager.verifiedStatus.unverified')}
    </Tag>
   ),
  },
  {
   title: t('manager.createdAt'),
   dataIndex: 'createdAt',
   key: 'createdAt',
   sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
   render: (createdAt) => new Date(createdAt).toLocaleString(),
  },
  {
   title: t('property.actions.actions'),
   key: 'actions',
   render: (_, record) => (
    <Space>
     <Button
      icon={<i className="Dashicon fa-light fa-eye" key="display" />}
      onClick={() => navigate(`/manager?id=${record.id}`)}
      shape="circle"
      type="link"
     />
     <Popconfirm
      title={t('messages.deleteConfirm')}
      onConfirm={() => confirmDelete(record.id)}
     >
      <Button
       danger
       icon={
        <i
         className="Dashicon fa-light fa-trash"
         style={{ color: 'red' }}
         key="delete"
        />
       }
       shape="circle"
       type="link"
      />
     </Popconfirm>
    </Space>
   ),
  },
 ];

 const confirmDelete = async (id) => {
  await deleteManagerById(id);
  if (!error) {
   message.success(t('manager.deleteSuccess'));
  } else {
   message.error(t('manager.deleteError', { error: error.message }));
  }
 };

 if (!Array.isArray(Managers)) {
  return (
   <div className="loading">
    <Spin size="large" />
   </div>
  );
 }
 return (
  <Layout className="contentStyle">
   <Head />
   <Content className="container-fluid">
    <Button
     type="default"
     shape="round"
     icon={<ArrowLeftOutlined />}
     onClick={() => navigate(-1)}
    >
     {t('button.back')}
    </Button>
    <Title level={2}>{t('dashboard.managers')}</Title>
    <Row gutter={[16, 16]}>
     <Col xs={24} md={24}>
      <Table
       columns={columns}
       dataSource={Managers}
       loading={isLoading}
       rowKey="id"
      />
     </Col>
    </Row>
   </Content>
   <Foot />
  </Layout>
 );
};

export default Managers;
