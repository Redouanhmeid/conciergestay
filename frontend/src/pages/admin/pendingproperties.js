import React, { useEffect, useState } from 'react';
import {
 Layout,
 Row,
 Col,
 Typography,
 Table,
 Button,
 Image,
 Input,
 Space,
 Spin,
 message,
} from 'antd';
import { SearchOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import Head from '../../components/common/header';
import Foot from '../../components/common/footer';
import { useNavigate } from 'react-router-dom';
import useProperty from '../../hooks/useProperty';

const { Content } = Layout;
const { Title } = Typography;

const PendingProperties = () => {
 const navigate = useNavigate();
 const {
  pendingProperties,
  loading: pendingLoading,
  error,
  verifyProperty,
  bulkVerifyProperties,
  fetchPendingProperties,
 } = useProperty();

 const [managersMap, setManagersMap] = useState({});
 const [searchText, setSearchText] = useState('');
 const [searchedColumn, setSearchedColumn] = useState('');
 const [selectionType, setSelectionType] = useState('checkbox');
 const [selectedRowKeys, setSelectedRowKeys] = useState([]);

 // Handle single property verification
 const handleVerifyProperty = async (propertyId) => {
  const result = await verifyProperty(propertyId);
  if (result) {
   message.success(`La propriété a été vérifiée!`);
   fetchPendingProperties();
  }
 };
 // Handle bulk verification
 const handleBulkVerify = async () => {
  if (selectedRowKeys.length === 0) {
   message.warning('Aucune propriété sélectionnée pour vérification.');
   return;
  }

  const results = await bulkVerifyProperties(selectedRowKeys);
  if (results) {
   message.success(`${selectedRowKeys.length} propriétés vérifiées!`);
   setSelectedRowKeys([]); // Clear selection after verification
   fetchPendingProperties();
  }
 };
 // Row selection configuration
 const rowSelection = {
  selectedRowKeys,
  onChange: (newSelectedRowKeys) => {
   setSelectedRowKeys(newSelectedRowKeys);
  },
 };
 // Handle search
 const handleSearch = (selectedKeys, confirm, dataIndex) => {
  confirm();
  setSearchText(selectedKeys[0]);
  setSearchedColumn(dataIndex);
 };

 // Reset search
 const handleReset = (clearFilters) => {
  clearFilters();
  setSearchText('');
 };

 // Function to handle search props for the columns
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
      Chercher
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
  onFilter: (value, record) => {
   if (dataIndex === 'propertyManagerId') {
    const managerName = managersMap[record.propertyManagerId];
    return managerName
     ? managerName.toLowerCase().includes(value.toLowerCase())
     : false;
   }
   return record[dataIndex]
    ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
    : false;
  },
  render: (text, record) => {
   if (dataIndex === 'propertyManagerId') {
    const managerName = managersMap[record.propertyManagerId];
    return managerName || 'Loading...';
   }
   return searchedColumn === dataIndex ? <strong>{text}</strong> : text;
  },
 });

 // Filters for "type", "rooms", and "beds" columns
 const getUniqueValues = (key) =>
  [...new Set(pendingProperties.map((item) => item[key]))].sort(
   (a, b) => a - b
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
   sorter: (a, b) => a.name.localeCompare(b.name),
   ...getColumnSearchProps('name'),
  },
  {
   title: 'Voir',
   key: 'voir',
   render: (_, record) => (
    <Button
     icon={<i className="Dashicon fa-light fa-eye" key="display" />}
     onClick={() => navigate(`/propertydetails?id=${record.id}`)}
     type="link"
     shape="circle"
    />
   ),
  },
  {
   title: 'Type',
   dataIndex: 'type',
   key: 'type',
   filters: [
    { text: 'appartement', value: 'apartment' },
    { text: 'maison', value: 'house' },
    { text: "maison d'hôtes", value: 'guesthouse' },
   ],
   onFilter: (value, record) => record.type === value,
   render: (type) => {
    const typeMap = {
     apartment: 'appartement',
     house: 'maison',
     guesthouse: "maison d'hôtes",
    };
    return typeMap[type] || type; // Default to type if no mapping found
   },
  },

  {
   title: 'Prix',
   dataIndex: 'price',
   key: 'price',
   sorter: (a, b) => a.price - b.price,
   render: (price) => `${price} MAD`,
  },
  {
   title: 'Chambres',
   dataIndex: 'rooms',
   key: 'rooms',
   filters: getUniqueValues('rooms').map((value) => ({ text: value, value })),
   onFilter: (value, record) => record.rooms === value,
   sorter: (a, b) => a.rooms - b.rooms,
  },
  {
   title: 'Lits',
   dataIndex: 'beds',
   key: 'beds',
   filters: getUniqueValues('beds').map((value) => ({ text: value, value })),
   onFilter: (value, record) => record.beds === value,
   sorter: (a, b) => a.beds - b.beds,
  },
  {
   title: 'Location',
   dataIndex: 'placeName',
   key: 'placeName',
   sorter: (a, b) => a.placeName.localeCompare(b.placeName),
   ...getColumnSearchProps('placeName'),
  },
  {
   title: 'Créé le',
   dataIndex: 'createdAt',
   key: 'createdAt',
   sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
   render: (createdAt) => new Date(createdAt).toLocaleString(),
  },
  ,
  {
   title: 'Action',
   key: 'action',
   render: (_, record) => (
    <Button type="primary" onClick={() => handleVerifyProperty(record.id)}>
     Vérifier
    </Button>
   ),
  },
 ];

 if (error) return <p>Erreur: {error}</p>;
 if (pendingLoading) {
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
     Retour
    </Button>
    <Title level={2}>Propriétés en attente</Title>
    <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
     <Col>
      <Button
       type="primary"
       disabled={selectedRowKeys.length === 0}
       onClick={handleBulkVerify}
      >
       Vérifier les propriétés sélectionnées
      </Button>
     </Col>
    </Row>
    <Row gutter={[16, 16]}>
     <Col xs={24} md={24}>
      <Table
       columns={columns}
       dataSource={pendingProperties}
       loading={pendingLoading}
       rowKey="id"
       rowSelection={{
        type: selectionType,
        ...rowSelection,
       }}
      />
     </Col>
    </Row>
   </Content>
   <Foot />
  </Layout>
 );
};

export default PendingProperties;
