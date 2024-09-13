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
 Popconfirm,
 Image,
 message,
} from 'antd';
import { SearchOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import Head from '../../components/common/header';
import Foot from '../../components/common/footer';
import useGetProperties from '../../hooks/useGetProperties';
import { useUserData } from '../../hooks/useUserData';
import { useNavigate } from 'react-router-dom';
import useDeleteProperty from '../../hooks/useDeleteProperty';

const { Content } = Layout;
const { Title } = Typography;

const Properties = () => {
 const { properties = [], loading, fetchAllProperties } = useGetProperties();
 const { deleteProperty, deletesuccess, deleteloading, deleteerror } =
  useDeleteProperty();
 const { fetchManagerById } = useUserData();
 const navigate = useNavigate();

 const [managersMap, setManagersMap] = useState({});
 const [searchText, setSearchText] = useState('');
 const [searchedColumn, setSearchedColumn] = useState('');

 useEffect(() => {
  fetchAllProperties();
 }, [loading]);

 useEffect(() => {
  const fetchManagersData = async () => {
   const newManagersMap = { ...managersMap };

   for (const property of properties) {
    if (
     property.propertyManagerId &&
     !newManagersMap[property.propertyManagerId]
    ) {
     try {
      // Await the manager data directly from the API
      const manager = await fetchManagerById(property.propertyManagerId);

      // Check if the manager data is available and update the map
      if (manager && manager.firstname && manager.lastname) {
       newManagersMap[
        property.propertyManagerId
       ] = `${manager.firstname} ${manager.lastname}`;
      } else {
       console.warn(`No manager found for ID: ${property.propertyManagerId}`);
       newManagersMap[property.propertyManagerId] = 'Unknown Manager'; // Fallback
      }
     } catch (error) {
      console.error(
       `Failed to fetch manager with ID: ${property.propertyManagerId}`,
       error
      );
      newManagersMap[property.propertyManagerId] = 'Error loading manager'; // Error fallback
     }
    }
   }

   console.log(newManagersMap);
   setManagersMap(newManagersMap);
  };

  if (properties.length > 0) {
   fetchManagersData();
  }
 }, [properties]);

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
  [...new Set(properties.map((item) => item[key]))].sort((a, b) => a - b);

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
  {
   title: 'Manager',
   key: 'propertyManagerId',
   render: (_, record) => {
    const managerName = managersMap[record.propertyManagerId]; // Get the manager's name from the map
    return managerName || 'Loading...'; // Display the manager's name or 'Loading...'
   },
   // Add search filter based on manager's name
   filterDropdown: ({
    setSelectedKeys,
    selectedKeys,
    confirm,
    clearFilters,
   }) => (
    <div style={{ padding: 8 }}>
     <Input
      placeholder={`Chercher Manager`}
      value={selectedKeys[0]}
      onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
      onPressEnter={() => confirm()}
      style={{ marginBottom: 8, display: 'block' }}
     />
     <Space>
      <Button
       type="primary"
       onClick={() => confirm()}
       icon={<SearchOutlined />}
       size="small"
       style={{ width: 90 }}
      >
       Chercher
      </Button>
      <Button
       onClick={() => clearFilters && clearFilters()}
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
    const managerName = managersMap[record.propertyManagerId];
    return managerName
     ? managerName.toLowerCase().includes(value.toLowerCase())
     : false;
   },
  },
  {
   title: 'Actions',
   key: 'actions',
   render: (_, record) => (
    <Space>
     <Button
      icon={<i className="Dashicon fa-light fa-eye" key="display" />}
      onClick={() => navigate(`/propertydetails?id=${record.id}`)}
      type="link"
      shape="circle"
     />
     <Button
      icon={<i className="Dashicon fa-light fa-pen-to-square" key="edit" />}
      onClick={() => navigate(`/editproperty?id=${record.id}`)}
      type="link"
      shape="circle"
     />
     <Button
      icon={<i className="Dashicon fa-light fa-house-lock" key="ellipsis" />}
      onClick={() => navigate(`/digitalguidebook?id=${record.id}`)}
      type="link"
      shape="circle"
     />
     <Popconfirm
      title="Etes-vous sûr de supprimer ?"
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
       type="link"
       shape="circle"
      />
     </Popconfirm>
    </Space>
   ),
  },
 ];

 const confirmDelete = async (id) => {
  await deleteProperty(id);
  if (!deleteerror) {
   await fetchAllProperties();
   message.success('Propriété supprimée avec succès.');
  } else {
   message.error(
    `Erreur lors de la suppression de la propriété: ${deleteerror.message}`
   );
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
    <Title level={2}>Propriétés</Title>
    <Row gutter={[16, 16]}>
     <Col xs={24} md={24}>
      <Table
       columns={columns}
       dataSource={properties}
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

export default Properties;
