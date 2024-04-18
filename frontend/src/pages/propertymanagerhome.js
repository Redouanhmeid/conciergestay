import React, { useEffect } from 'react';
import SideMenu from '../components/sidemenu';
import Head from '../components/common/header';
import Foot from '../components/common/footer';
import { Layout, Spin, Card, Button, Col, Row, Carousel } from 'antd';
import {
 PlusOutlined,
 EditOutlined,
 EllipsisOutlined,
 EyeOutlined,
} from '@ant-design/icons';
import '../App.css';
import AddPropertyCard from './components/AddPropertyCard';
import { useAuthContext } from '../hooks/useAuthContext ';
import { useUserData } from '../hooks/useUserData';
import useGetProperties from '../hooks/useGetProperties';
import ClientConfig from '../ClientConfig';
import { useNavigate } from 'react-router-dom';

const { Content } = Layout;
const PropertyManagerHome = () => {
 const { user } = useAuthContext();
 const { isLoading, userData, getUserData } = useUserData();
 const User = user || JSON.parse(localStorage.getItem('user'));
 const { properties, loading } = useGetProperties(userData.id);
 const navigate = useNavigate();
 const display = (id) => {
  navigate('/propertydetails', { state: { id, properties } });
 };
 useEffect(() => {
  if (user) {
   getUserData(User.email);
  }
 }, [isLoading]);

 if (!isLoading) {
  return (
   <Layout className="contentStyle">
    <Head />
    <Layout>
     <SideMenu width="25%" className="siderStyle" />
     <Content className="container-fluid">
      <Row gutter={[32, 32]}>
       {!loading && properties && (
        <>
         {properties.map((property) => (
          <Col span={6}>
           <Card
            key={property.id}
            style={{ textAlign: 'center' }}
            cover={
             <Carousel autoplay effect="fade">
              {property.photos &&
               property.photos.map((photo) => (
                <img
                 key={photo.id}
                 alt={property.name}
                 src={`${ClientConfig.URI}${ClientConfig.BACK_PORT}${photo}`}
                />
               ))}
             </Carousel>
            }
            actions={[
             <EyeOutlined key="display" onClick={() => display(property.id)} />,
             <EditOutlined key="edit" />,
             <EllipsisOutlined key="ellipsis" />,
            ]}
           >
            <Card.Meta
             title={property.name}
             description={property.description}
            />
           </Card>
          </Col>
         ))}
        </>
       )}
       <Col span={6}>
        <AddPropertyCard userData={userData} />
       </Col>
      </Row>
     </Content>
    </Layout>
    <Foot />
   </Layout>
  );
 } else {
  return (
   <div className="loading">
    <Spin size="large" />
   </div>
  );
 }
};

export default PropertyManagerHome;
