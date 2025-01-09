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
 Checkbox,
 message,
} from 'antd';
import { SearchOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import Head from '../../components/common/header';
import Foot from '../../components/common/footer';
import useProperty from '../../hooks/useProperty';
import { useUserData } from '../../hooks/useUserData';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../../context/TranslationContext';

const { Content } = Layout;
const { Title } = Typography;

const Properties = () => {
 const {
  properties = [],
  loading,
  success,
  error,
  deleteProperty,
  fetchAllProperties,
 } = useProperty();
 const { fetchManagerById } = useUserData();
 const navigate = useNavigate();
 const { t } = useTranslation();

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
       newManagersMap[property.propertyManagerId] = t('manager.unknown'); // Fallback
      }
     } catch (error) {
      console.error(
       `Failed to fetch manager with ID: ${property.propertyManagerId}`,
       error
      );
      newManagersMap[property.propertyManagerId] = t('manager.loadError'); // Error fallback
     }
    }
   }
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
    return managerName || t('common.loading');
   }
   return searchedColumn === dataIndex ? <strong>{text}</strong> : text;
  },
 });

 // Filters for "type", "rooms", and "beds" columns
 const getUniqueValues = (key) =>
  [...new Set(properties.map((item) => item[key]))].sort((a, b) => a - b);

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
   sorter: (a, b) => a.name.localeCompare(b.name),
   ...getColumnSearchProps('name'),
  },
  {
   title: t('property.basic.type'),
   dataIndex: 'type',
   key: 'type',
   filterDropdown: ({
    setSelectedKeys,
    selectedKeys,
    confirm,
    clearFilters,
   }) => (
    <div style={{ padding: 8 }}>
     <div style={{ marginBottom: 8 }}>
      {[
       { text: t('type.apartment'), value: 'apartment' },
       { text: t('type.house'), value: 'house' },
       { text: t('type.guesthouse'), value: 'guesthouse' },
      ].map((option) => (
       <div key={option.value} style={{ marginBottom: 4 }}>
        <Checkbox
         checked={selectedKeys.includes(option.value)}
         onChange={(e) => {
          const newSelectedKeys = e.target.checked
           ? [...selectedKeys, option.value]
           : selectedKeys.filter((key) => key !== option.value);
          setSelectedKeys(newSelectedKeys);
         }}
        >
         {option.text}
        </Checkbox>
       </div>
      ))}
     </div>
     <Space>
      <Button
       onClick={() => {
        clearFilters();
        confirm();
       }}
       size="small"
      >
       {t('common.reset')}
      </Button>
      <Button type="primary" onClick={() => confirm()} size="small">
       OK
      </Button>
     </Space>
    </div>
   ),
   onFilter: (value, record) => record.type === value,
   render: (type) => t(`type.${type}`),
  },
  {
   title: t('property.basic.price'),
   dataIndex: 'price',
   key: 'price',
   sorter: (a, b) => a.price - b.price,
   render: (price) => `${price} ${t('property.basic.priceNight')}`,
  },
  {
   title: t('property.basic.rooms'),
   dataIndex: 'rooms',
   key: 'rooms',
   filterDropdown: ({
    setSelectedKeys,
    selectedKeys,
    confirm,
    clearFilters,
   }) => (
    <div style={{ padding: 8 }}>
     <div style={{ marginBottom: 8 }}>
      {getUniqueValues('rooms').map((value) => (
       <div key={value} style={{ marginBottom: 4 }}>
        <Checkbox
         checked={selectedKeys.includes(value)}
         onChange={(e) => {
          const newSelectedKeys = e.target.checked
           ? [...selectedKeys, value]
           : selectedKeys.filter((key) => key !== value);
          setSelectedKeys(newSelectedKeys);
         }}
        >
         {value}
        </Checkbox>
       </div>
      ))}
     </div>
     <Space>
      <Button
       onClick={() => {
        clearFilters();
        confirm();
       }}
       size="small"
      >
       {t('common.reset')}
      </Button>
      <Button type="primary" onClick={() => confirm()} size="small">
       OK
      </Button>
     </Space>
    </div>
   ),
   onFilter: (value, record) => record.rooms === value,
   sorter: (a, b) => a.rooms - b.rooms,
  },
  {
   title: t('property.basic.beds'),
   dataIndex: 'beds',
   key: 'beds',
   filterDropdown: ({
    setSelectedKeys,
    selectedKeys,
    confirm,
    clearFilters,
   }) => (
    <div style={{ padding: 8 }}>
     <div style={{ marginBottom: 8 }}>
      {getUniqueValues('beds').map((value) => (
       <div key={value} style={{ marginBottom: 4 }}>
        <Checkbox
         checked={selectedKeys.includes(value)}
         onChange={(e) => {
          const newSelectedKeys = e.target.checked
           ? [...selectedKeys, value]
           : selectedKeys.filter((key) => key !== value);
          setSelectedKeys(newSelectedKeys);
         }}
        >
         {value}
        </Checkbox>
       </div>
      ))}
     </div>
     <Space>
      <Button
       onClick={() => {
        clearFilters();
        confirm();
       }}
       size="small"
      >
       {t('common.reset')}
      </Button>
      <Button type="primary" onClick={() => confirm()} size="small">
       OK
      </Button>
     </Space>
    </div>
   ),
   onFilter: (value, record) => record.beds === value,
   sorter: (a, b) => a.beds - b.beds,
  },
  {
   title: t('property.basic.location'),
   dataIndex: 'placeName',
   key: 'placeName',
   sorter: (a, b) => a.placeName.localeCompare(b.placeName),
   ...getColumnSearchProps('placeName'),
  },
  {
   title: t('manager.createdAt'),
   dataIndex: 'createdAt',
   key: 'createdAt',
   sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
   render: (createdAt) => new Date(createdAt).toLocaleString(),
  },
  {
   title: t('property.manager'),
   key: 'propertyManagerId',
   render: (_, record) => {
    const managerName = managersMap[record.propertyManagerId]; // Get the manager's name from the map
    return managerName || t('common.loading'); // Display the manager's name or 'Loading...'
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
      placeholder={t('property.searchManager')}
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
       {t('common.search')}
      </Button>
      <Button
       onClick={() => clearFilters && clearFilters()}
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
   onFilter: (value, record) => {
    const managerName = managersMap[record.propertyManagerId];
    return managerName
     ? managerName.toLowerCase().includes(value.toLowerCase())
     : false;
   },
  },
  {
   title: t('property.actions.actions'),
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
     <Button
      icon={
       <i
        className="Dashicon fa-light fa-list-check"
        style={{ color: '#2b2c32' }}
        key="task"
       />
      }
      onClick={() =>
       navigate(`/propertytaskdashboard?id=${record.id}&name=${record.name}`)
      }
      type="link"
      shape="circle"
     />

     <Button
      icon={
       <i
        className="Dashicon fa-light fa-dollar-sign"
        style={{ color: '#389e0d' }}
        key="revenue"
       />
      }
      onClick={() =>
       navigate(`/propertyrevenuedashboard?id=${record.id}&name=${record.name}`)
      }
      type="link"
      shape="circle"
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
  if (!error) {
   await fetchAllProperties();
   message.success(t('messages.deleteSuccess'));
  } else {
   message.error(t('messages.deleteError', { error: error.message }));
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
     {t('button.back')}
    </Button>
    <Title level={2}>{t('property.title')}</Title>
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
