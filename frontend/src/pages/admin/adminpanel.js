import React, { useState, useEffect } from 'react';
import {
 Layout,
 Row,
 Col,
 Card,
 Typography,
 Divider,
 Avatar,
 Image,
 List,
 Statistic,
 Button,
 Spin,
 Flex,
 Tag,
 Rate,
 Popconfirm,
 message,
} from 'antd';
import { UserOutlined, PlusOutlined } from '@ant-design/icons';
import Head from '../../components/common/header';
import Foot from '../../components/common/footer';
import useGetProperties from '../../hooks/useGetProperties';
import { useUserData } from '../../hooks/useUserData';
import useNearbyPlace from '../../hooks/useNearbyPlace';

const { Content } = Layout;
const { Title, Text } = Typography;

const Dashboard = () => {
 const {
  properties = [],
  loading: PropertiesLoading,
  fetchAllProperties,
 } = useGetProperties();
 const {
  Managers = [],
  isLoading: ManagersLoading,
  fetchAllManagers,
 } = useUserData();
 const { loading, error, getAllNearbyPlaces, deleteNearbyPlace } =
  useNearbyPlace();

 const [NearbyPlaces, setNearbyPlaces] = useState([]);
 const [visibleProperties, setVisibleProperties] = useState(3);
 const [visibleManagers, setVisibleManagers] = useState(3);
 const [visibleNPlaces, setVisibleNPlaces] = useState(3);
 const [Ploading, setPLoading] = useState(false);
 const [Mloading, setMLoading] = useState(false);
 const [Nloading, setNLoading] = useState(false);

 const fetchNearbyPlaces = async () => {
  try {
   const data = await getAllNearbyPlaces(); // Properly calling the function
   setNearbyPlaces(data);
  } catch (err) {
   message.error('Échec du chargement des détails du lieu.');
  }
 };

 useEffect(() => {
  fetchAllProperties();
  fetchAllManagers();
  fetchNearbyPlaces();
 }, []);

 const numberOfProperties = properties.length;
 const totalPrice = properties.reduce(
  (sum, property) => sum + property.price,
  0
 );
 const averagePrice = totalPrice / numberOfProperties || 0;
 const numberOfManagers = Managers.length;
 const numberOfNearbyPlaces = NearbyPlaces.length;

 const handleMLoadMore = () => {
  setMLoading(true);
  setTimeout(() => {
   setVisibleManagers((prev) => prev + 3); // Show 3 more managers
   setMLoading(false); // Turn off loading state after managers are shown
  }, 1000); // Simulate a 1-second delay
 };
 const handlePLoadMore = () => {
  setPLoading(true);
  setTimeout(() => {
   setVisibleProperties((prev) => prev + 3); // Show 3 more managers
   setPLoading(false); // Turn off loading state after managers are shown
  }, 1000); // Simulate a 1-second delay
 };
 const handleNLoadMore = () => {
  setNLoading(true);
  setTimeout(() => {
   setVisibleNPlaces((prev) => prev + 3); // Show 3 more managers
   setNLoading(false); // Turn off loading state after managers are shown
  }, 1000); // Simulate a 1-second delay
 };

 const loadMMoreButton =
  !Mloading && visibleManagers < Managers.length ? (
   <div style={{ textAlign: 'center', marginTop: 12 }}>
    <Button type="primary" icon={<PlusOutlined />} onClick={handleMLoadMore}>
     Charger plus
    </Button>
   </div>
  ) : null;
 const loadPMoreButton =
  !Ploading && visibleProperties < properties.length ? (
   <div style={{ textAlign: 'center', marginTop: 12 }}>
    <Button type="primary" icon={<PlusOutlined />} onClick={handlePLoadMore}>
     Charger plus
    </Button>
   </div>
  ) : null;
 const loadNMoreButton =
  !Nloading && visibleNPlaces < NearbyPlaces.length ? (
   <div style={{ textAlign: 'center', marginTop: 12 }}>
    <Button type="primary" icon={<PlusOutlined />} onClick={handleNLoadMore}>
     Charger plus
    </Button>
   </div>
  ) : null;

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
   <Content className="container">
    <Title level={2}>Statistiques</Title>
    <Row gutter={[16, 16]}>
     <Col xs={24} md={6}>
      <Card
       title="Nombre de managers"
       className="custom-stat-card"
       bordered={false}
      >
       <Statistic value={numberOfManagers} />
      </Card>
     </Col>
     <Col xs={24} md={6}>
      <Card
       title="Nombre de propriétés"
       className="custom-stat-card"
       bordered={false}
      >
       <Statistic value={numberOfProperties} />
      </Card>
     </Col>
     <Col xs={24} md={6}>
      <Card title="Prix ​​moyen" className="custom-stat-card" bordered={false}>
       <Statistic value={averagePrice.toFixed(2)} precision={2} />
      </Card>
     </Col>
     <Col xs={24} md={6}>
      <Card
       title="Lieux à proximité"
       className="custom-stat-card"
       bordered={false}
      >
       <Statistic value={numberOfNearbyPlaces} />
      </Card>
     </Col>
    </Row>

    <Divider />

    <Row gutter={[16, 16]}>
     <Col xs={24} sm={8}>
      <Card
       className="custom-stat-card"
       title={<a href={`/managers`}>Managers</a>}
       bordered={false}
      >
       <List
        itemLayout="horizontal"
        dataSource={
         Array.isArray(Managers) ? Managers.slice(0, visibleManagers) : []
        }
        renderItem={(item) => (
         <List.Item
          actions={[
           <a href={`/manager?id=${item.id}`}>
            <i className="Dashicon fa-light fa-eye" key="display" />
           </a>,
          ]}
         >
          <List.Item.Meta
           avatar={
            <a href={`/manager?id=${item.id}`}>
             <Avatar src={item.avatar} size={46} />
            </a>
           }
           title={
            <Text>
             {item.firstname} {item.lastname}
            </Text>
           }
           description={item.email}
          />
         </List.Item>
        )}
       />
       {Mloading && (
        <div style={{ textAlign: 'center', marginTop: 12 }}>
         <Spin />
        </div>
       )}
       {loadMMoreButton}
      </Card>
     </Col>

     <Col xs={24} sm={8}>
      <Card
       className="custom-stat-card"
       title={<a href={`/properties`}>Propriétés</a>}
       bordered={false}
      >
       <List
        itemLayout="vertical"
        dataSource={
         Array.isArray(properties) ? properties.slice(0, visibleProperties) : []
        }
        renderItem={(item) => (
         <List.Item
          actions={[
           <a href={`/propertydetails?id=${item.id}`}>
            <i className="Dashicon fa-light fa-eye" key="display" />
           </a>,
           <a href={`/editproperty?id=${item.id}`}>
            <i className="Dashicon fa-light fa-pen-to-square" key="edit" />
           </a>,
           <a href={`/digitalguidebook?id=${item.id}`}>
            <i className="Dashicon fa-light fa-house-lock" key="ellipsis" />
           </a>,
          ]}
         >
          <List.Item.Meta
           avatar={<Image src={item.photos[0]} width={160} />}
           title={item.name}
           description={
            <Flex gap="4px 0" vertical>
             <Tag
              icon={
               <i className="tag-icon-style fa-light fa-map-location-dot"></i>
              }
             >
              {item.placeName}
             </Tag>
             <Tag
              icon={<i className="tag-icon-style fa-light fa-money-bill"></i>}
             >
              {item.price} Dh
             </Tag>
            </Flex>
           }
          />
         </List.Item>
        )}
       />
       {Ploading && (
        <div style={{ textAlign: 'center', marginTop: 12 }}>
         <Spin />
        </div>
       )}
       {loadPMoreButton}
      </Card>
     </Col>

     <Col xs={24} sm={8}>
      <Card
       className="custom-stat-card"
       title={<a href={`/nearbyplaces`}>Lieux à proximité</a>}
       bordered={false}
      >
       <List
        itemLayout="horizontal"
        dataSource={
         Array.isArray(NearbyPlaces)
          ? NearbyPlaces.slice(0, visibleNPlaces)
          : []
        }
        renderItem={(item) => (
         <List.Item
          actions={[
           <a href={`/nearbyplace?id=${item.id}`}>
            <i className="Dashicon fa-light fa-pen-to-square" key="edite" />
           </a>,
           <Popconfirm
            title="Etes-vous sûr de supprimer?"
            onConfirm={() => confirmDelete(item.id)}
           >
            <Button
             className="Dashicon fa-light fa-trash"
             style={{ color: 'red' }}
             key="delete"
             type="link"
             shape="circle"
            />
           </Popconfirm>,
          ]}
         >
          <List.Item.Meta
           avatar={<Image src={item.photo} width={100} />}
           title={
            <a href={item.url} target="_blank">
             {item.name}
            </a>
           }
           description={
            <>
             <Rate
              allowHalf
              disabled
              defaultValue={item.rating}
              style={{ color: '#cfaf83', fontSize: 12 }}
             />{' '}
             {item.rating}
            </>
           }
          />
         </List.Item>
        )}
       />
       {Nloading && (
        <div style={{ textAlign: 'center', marginTop: 12 }}>
         <Spin />
        </div>
       )}
       {loadNMoreButton}
      </Card>
     </Col>
    </Row>

    <Divider />
   </Content>
   <Foot />
  </Layout>
 );
};

export default Dashboard;