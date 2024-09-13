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
 Image,
 message,
} from 'antd';
import { SearchOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import Head from '../../components/common/header';
import Foot from '../../components/common/footer';
import { useNavigate } from 'react-router-dom';
import useNearbyPlace from '../../hooks/useNearbyPlace';

const { Content } = Layout;
const { Title } = Typography;

const NearbyPlaces = () => {
 const { loading, error, getAllNearbyPlaces, deleteNearbyPlace } =
  useNearbyPlace();
 const navigate = useNavigate();
 const [NearbyPlaces, setNearbyPlaces] = useState([]);
 const [searchText, setSearchText] = useState('');
 const [searchedColumn, setSearchedColumn] = useState('');

 const fetchNearbyPlaces = async () => {
  try {
   const data = await getAllNearbyPlaces(); // Properly calling the function
   setNearbyPlaces(data);
  } catch (err) {
   message.error('Échec du chargement des détails du lieu.');
  }
 };

 useEffect(() => {
  fetchNearbyPlaces();
 }, []);

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
     placeholder={`Chercher`}
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
      Search
     </Button>
     <Button
      onClick={() => handleReset(clearFilters)}
      size="small"
      style={{ width: 90 }}
     >
      Réinitialiser
     </Button>
    </Space>
   </div>
  ),
  filterIcon: (filtered) => (
   <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
  ),
  onFilter: (value, record) =>
   record[dataIndex]?.toString().toLowerCase().includes(value.toLowerCase()),
  render: (text) =>
   searchedColumn === dataIndex ? <strong>{text}</strong> : text,
 });

 const columns = [
  {
   title: 'Photo',
   dataIndex: 'photo',
   key: 'photo',
   render: (photo) => <Image src={photo} shape="square" width={64} />,
  },
  {
   title: 'Nom',
   dataIndex: 'name',
   key: 'name',
   sorter: (a, b) => a.name.localeCompare(b.name),
   ...getColumnSearchProps('name'),
  },
  {
   title: 'Adresse',
   dataIndex: 'address',
   key: 'address',
   sorter: (a, b) => a.address.localeCompare(b.address),
   ...getColumnSearchProps('address'),
  },
  {
   title: 'Note',
   dataIndex: 'rating',
   key: 'rating',
   sorter: (a, b) => a.rating - b.rating,
   render: (rating) => <span>{rating} / 5</span>,
  },
  {
   title: 'Vérifié',
   dataIndex: 'isVerified',
   key: 'isVerified',
   filters: [
    { text: 'Vérifié', value: true },
    { text: 'Non vérifié', value: false },
   ],
   onFilter: (value, record) => record.isVerified === value,
   render: (isVerified) => (
    <Tag color={isVerified ? 'green' : 'red'}>
     {isVerified ? 'Vérifié' : 'Non vérifié'}
    </Tag>
   ),
  },
  {
   title: 'Créé le',
   dataIndex: 'createdAt',
   key: 'createdAt',
   sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
   render: (createdAt) => new Date(createdAt).toLocaleString(),
  },
  {
   title: 'Actions',
   key: 'actions',
   render: (_, record) => (
    <Space>
     <Button
      icon={<i className="Dashicon fa-light fa-pen-to-square" key="edit" />}
      onClick={() => navigate(`/nearbyplace?id=${record.id}`)}
      type="link"
      shape="circle"
     />
     <Popconfirm
      title="Etes-vous sûr de supprimer?"
      onConfirm={() => confirmDelete(record.id)}
     >
      <Button
       className="Dashicon fa-light fa-trash"
       style={{ color: 'red' }}
       key="delete"
       type="link"
       shape="circle"
      />
     </Popconfirm>
    </Space>
   ),
  },
 ];

 const confirmDelete = async (id) => {
  await deleteNearbyPlace(id);
  if (!error) {
   fetchNearbyPlaces();
   message.success('Lieu supprimée avec succès.');
  } else {
   message.error(`Erreur lors de la suppression du lieu: ${error.message}`);
  }
 };

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
    <Title level={2}>Lieux à proximité</Title>
    <Row gutter={[16, 16]}>
     <Col xs={24} md={24}>
      <Table
       columns={columns}
       dataSource={NearbyPlaces}
       loading={loading}
       rowKey="id"
      />
     </Col>
    </Row>
   </Content>
   <Foot />
  </Layout>
 );
};

export default NearbyPlaces;
