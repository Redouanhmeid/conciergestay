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
 Badge,
 Button,
 Spin,
 Flex,
 Tag,
 Rate,
 Popconfirm,
 message,
} from 'antd';
import { UserOutlined, PlusOutlined } from '@ant-design/icons';
import { useTranslation } from '../../context/TranslationContext';
import Head from '../../components/common/header';
import Foot from '../../components/common/footer';
import useProperty from '../../hooks/useProperty';
import { useUserData } from '../../hooks/useUserData';
import useNearbyPlace from '../../hooks/useNearbyPlace';

const { Content } = Layout;
const { Title, Text } = Typography;

const Dashboard = () => {
 const {
  properties = [],
  pendingProperties,
  loading: PropertiesLoading,
  fetchPendingProperties,
  fetchAllProperties,
 } = useProperty();
 const {
  Managers = [],
  isLoading: ManagersLoading,
  fetchAllManagers,
 } = useUserData();
 const { error, getAllNearbyPlaces, deleteNearbyPlace } = useNearbyPlace();
 const { t } = useTranslation();

 const [NearbyPlaces, setNearbyPlaces] = useState([]);
 const [visibleProperties, setVisibleProperties] = useState(3);
 const [visibleManagers, setVisibleManagers] = useState(3);
 const [visibleNPlaces, setVisibleNPlaces] = useState(3);
 const [Ploading, setPLoading] = useState(false);
 const [Mloading, setMLoading] = useState(false);
 const [Nloading, setNLoading] = useState(false);

 const pendingNearbyPlaces = NearbyPlaces.filter(
  (NearbyPlace) => NearbyPlace.isVerified === false
 ).length;

 const fetchNearbyPlaces = async () => {
  try {
   const data = await getAllNearbyPlaces(); // Properly calling the function
   setNearbyPlaces(data);
  } catch (err) {
   message.error(t('error.update'));
  }
 };

 useEffect(() => {
  fetchAllProperties();
  fetchPendingProperties();
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
     {t('button.loadmore')}
    </Button>
   </div>
  ) : null;
 const loadPMoreButton =
  !Ploading && visibleProperties < properties.length ? (
   <div style={{ textAlign: 'center', marginTop: 12 }}>
    <Button type="primary" icon={<PlusOutlined />} onClick={handlePLoadMore}>
     {t('button.loadmore')}
    </Button>
   </div>
  ) : null;
 const loadNMoreButton =
  !Nloading && visibleNPlaces < NearbyPlaces.length ? (
   <div style={{ textAlign: 'center', marginTop: 12 }}>
    <Button type="primary" icon={<PlusOutlined />} onClick={handleNLoadMore}>
     {t('button.loadmore')}
    </Button>
   </div>
  ) : null;

 const confirmDelete = async (id) => {
  await deleteNearbyPlace(id);
  if (!error) {
   fetchNearbyPlaces();
   message.success(t('messages.deleteSuccess'));
  } else {
   message.error(t('messages.deleteError') + error.message);
  }
 };

 return (
  <Layout className="contentStyle">
   <Head />
   <Content className="container">
    <Title level={2}>{t('messages.reviewAndApprove')}</Title>
    <Row gutter={[16, 16]}>
     <Col xs={24} md={12}>
      <a href={`/pendingproperties`}>
       <Badge count={pendingProperties.length} status="warning" offset={[4, 4]}>
        <Statistic
         value={t('property.pending')}
         prefix={
          <i className="fa-light fa-house" style={{ color: '#aa7e42' }} />
         }
        />
       </Badge>
      </a>
     </Col>
     <Col xs={24} md={12}>
      <a href={`/pendingnearbyplaces`}>
       <Badge count={pendingNearbyPlaces} status="warning" offset={[4, 4]}>
        <Statistic
         value={t('nearbyPlace.pending')}
         prefix={
          <i
           className="fa-light fa-map-location"
           style={{ color: '#aa7e42' }}
          />
         }
        />
       </Badge>
      </a>
     </Col>
    </Row>
    <Divider />
    <Title level={2}>{t('dashboard.statistics')}</Title>
    <Row gutter={[16, 16]}>
     <Col xs={24} md={6}>
      <Card
       title={t('dashboard.totalManagers')}
       className="custom-stat-card"
       bordered={false}
      >
       <Statistic value={numberOfManagers} />
      </Card>
     </Col>
     <Col xs={24} md={6}>
      <Card
       title={t('dashboard.totalProperties')}
       className="custom-stat-card"
       bordered={false}
      >
       <Statistic value={numberOfProperties} />
      </Card>
     </Col>
     <Col xs={24} md={6}>
      <Card
       title={t('dashboard.averagePrice')}
       className="custom-stat-card"
       bordered={false}
      >
       <Statistic value={averagePrice.toFixed(2)} precision={2} />
      </Card>
     </Col>
     <Col xs={24} md={6}>
      <Card
       title={t('nearbyPlace.title')}
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
       title={<a href={`/managers`}>{t('dashboard.managers')}</a>}
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
       title={<a href={`/properties`}>{t('property.title')}</a>}
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
              {item.price} {t('property.basic.priceNight')}
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
       title={<a href={`/nearbyplaces`}>{t('nearbyPlace.title')}</a>}
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
            title={t('messages.deleteConfirm')}
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
