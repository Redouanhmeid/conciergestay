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
import useGetProperties from '../../hooks/useGetProperties';
import { useUserData } from '../../hooks/useUserData';
import Head from '../../components/common/header';
import Foot from '../../components/common/footer';

const { Content } = Layout;
const { Title, Text } = Typography;

const Manager = () => {
 const location = useLocation();
 const searchParams = new URLSearchParams(location.search);
 const managerId = searchParams.get('id'); // Extract the 'id' from the query params

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
 } = useGetProperties();

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
   message.success('Manager has been verified');
   fetchManagerData();
  } catch (err) {
   message.error(errorMsg || 'Failed to verify manager');
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
   title: 'Photo',
   dataIndex: 'photos',
   key: 'photos',
   render: (photos) =>
    photos && photos.length > 0 ? (
     <Image src={photos[0]} shape="square" size="large" width={64} />
    ) : null,
  },
  {
   title: 'Nom',
   dataIndex: 'name',
   key: 'name',
   render: (text, record) => (
    <a onClick={() => navigate(`/propertydetails?id=${record.id}`)}>{text}</a>
   ),
  },
  {
   title: 'Type',
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
   title: 'Prix',
   dataIndex: 'price',
   key: 'price',
   render: (price) => `${price} MAD`,
  },
  {
   title: 'Chambres',
   dataIndex: 'rooms',
   key: 'rooms',
  },
  {
   title: 'Lits',
   dataIndex: 'beds',
   key: 'beds',
  },
  {
   title: 'Location',
   dataIndex: 'placeName',
   key: 'placeName',
  },
  {
   title: 'Créé le',
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
     Retour
    </Button>
    <Row gutter={[16, 16]}>
     <Col xs={24} md={8}>
      <Space direction="vertical">
       <br />
       <Avatar size={164} src={manager?.avatar} />
       <Title level={3}>{`${manager?.firstname} ${manager?.lastname}`}</Title>
       <Text>Email: {manager?.email}</Text>
       <Text>Téléphone: {manager?.phone}</Text>
       <Text>Rôle: {manager?.role}</Text>
       <Text>Vérifié: {manager?.isVerified ? 'Oui' : 'Non'}</Text>
       {!manager?.isVerified && (
        <Button type="primary" loading={!isLoading} onClick={handleVerify}>
         Vérifier le Manager
        </Button>
       )}
       <Text>Créé le: {new Date(manager?.createdAt).toLocaleDateString()}</Text>
      </Space>
     </Col>
     <Col xs={24} md={16}>
      <Title level={4}>Propriétés gérées</Title>
      <Table columns={columns} dataSource={managerProperties} rowKey="id" />
     </Col>
    </Row>
   </Content>
   <Foot />
  </Layout>
 );
};

export default Manager;
