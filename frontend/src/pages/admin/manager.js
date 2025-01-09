import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
 Layout,
 Row,
 Col,
 Space,
 Typography,
 Avatar,
 Image,
 Table,
 Button,
 Spin,
 message,
} from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import useProperty from '../../hooks/useProperty';
import { useUserData } from '../../hooks/useUserData';
import Head from '../../components/common/header';
import Foot from '../../components/common/footer';
import { useTranslation } from '../../context/TranslationContext';

const { Content } = Layout;
const { Title, Text } = Typography;

const Manager = () => {
 const location = useLocation();
 const searchParams = new URLSearchParams(location.search);
 const managerId = searchParams.get('id'); // Extract the 'id' from the query params
 const { t } = useTranslation();

 const navigate = useNavigate();
 const {
  isLoading,
  userData,
  fetchManagerById,
  verifyManager,
  error,
  errorMsg,
 } = useUserData();
 const {
  properties = [],
  loading: propertiesLoading,
  fetchAllProperties,
 } = useProperty();

 const [manager, setManager] = useState(null);
 const [loading, setLoading] = useState(true);

 const fetchManagerData = async () => {
  if (managerId) {
   try {
    const managerData = await fetchManagerById(managerId);
    setManager(managerData);
   } catch (error) {
    console.error('Error fetching manager data:', error);
   } finally {
    setLoading(false);
   }
  }
 };
 useEffect(() => {
  fetchManagerData();
  fetchAllProperties(); // Fetch all properties
 }, [loading]);

 const handleVerify = async () => {
  try {
   await verifyManager(managerId);
   message.success(t('manager.verifySuccess'));
   fetchManagerData();
  } catch (err) {
   message.error(errorMsg || t('manager.verifyError'));
  }
 };

 if (loading || propertiesLoading) {
  return (
   <div className="loading">
    <Spin size="large" />
   </div>
  );
 }

 const managerProperties = properties.filter(
  (property) => property.propertyManagerId === Number(managerId)
 );

 const columns = [
  {
   title: t('common.photo'),
   dataIndex: 'photos',
   key: 'photos',
   render: (photos) =>
    photos && photos.length > 0 ? (
     <Image src={photos[0]} shape="square" size="large" width={64} />
    ) : null,
  },
  {
   title: t('property.basic.name'),
   dataIndex: 'name',
   key: 'name',
   render: (text, record) => (
    <a onClick={() => navigate(`/propertydetails?id=${record.id}`)}>{text}</a>
   ),
  },
  {
   title: t('property.basic.type'),
   dataIndex: 'type',
   key: 'type',
   render: (type) => {
    switch (type) {
     case 'apartment':
      return 'appartement';
     case 'house':
      return 'maison';
     case 'guesthouse':
      return "maison d'hôtes";
     default:
      return type;
    }
   },
  },
  {
   title: t('property.basic.price'),
   dataIndex: 'price',
   key: 'price',
   render: (price) => `${price} MAD`,
  },
  {
   title: t('property.basic.rooms'),
   dataIndex: 'rooms',
   key: 'rooms',
  },
  {
   title: t('property.basic.beds'),
   dataIndex: 'beds',
   key: 'beds',
  },
  {
   title: t('property.basic.location'),
   dataIndex: 'placeName',
   key: 'placeName',
  },
  {
   title: t('manager.createdAt'),
   dataIndex: 'createdAt',
   key: 'createdAt',
   render: (createdAt) => new Date(createdAt).toLocaleString(),
  },
 ];

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
    <Row gutter={[16, 16]}>
     <Col xs={24} md={8}>
      <Space direction="vertical">
       <br />
       <Avatar size={164} src={manager?.avatar} />
       <Title level={3}>{`${manager?.firstname} ${manager?.lastname}`}</Title>
       <Text>
        {t('common.email')}: {manager?.email}
       </Text>
       <Text>
        {t('common.phone')}: {manager?.phone}
       </Text>
       <Text>
        {t('manager.role')}: {manager?.role}
       </Text>
       <Text>
        {t('manager.verified')}:{' '}
        {manager?.isVerified ? t('common.yes') : t('common.no')}
       </Text>
       {!manager?.isVerified && (
        <Button type="primary" loading={!isLoading} onClick={handleVerify}>
         {t('manager.verifyButton')}
        </Button>
       )}
       <Text>
        {t('manager.createdAt')}:{' '}
        {new Date(manager?.createdAt).toLocaleDateString()}
       </Text>
      </Space>
     </Col>
     <Col xs={24} md={16}>
      <Title level={4}>{t('manager.managedProperties')}</Title>
      <Table columns={columns} dataSource={managerProperties} rowKey="id" />
     </Col>
    </Row>
   </Content>
   <Foot />
  </Layout>
 );
};

export default Manager;
