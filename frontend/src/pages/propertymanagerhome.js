import React, { useEffect } from 'react';
import Head from '../components/common/header';
import Foot from '../components/common/footer';
import { Layout, Spin, Card, Col, Row, Carousel } from 'antd';
import { EditOutlined, EllipsisOutlined, EyeOutlined } from '@ant-design/icons';
import '../App.css';
import AddPropertyCard from './components/AddPropertyCard';
import { useAuthContext } from '../hooks/useAuthContext';
import { useUserData } from '../hooks/useUserData';
import useGetProperties from '../hooks/useGetProperties';
import ClientConfig from '../ClientConfig';
import { useNavigate } from 'react-router-dom';

const { Content } = Layout;
const PropertyManagerHome = () => {
 const { user } = useAuthContext();
 const { isLoading, userData, getUserData } = useUserData();
 const User = user || JSON.parse(localStorage.getItem('user'));
 const { properties, loading, fetchProperties } = useGetProperties();
 const navigate = useNavigate();
 const display = (id) => {
  navigate('/propertydetails', { state: { id } });
 };
 const edit = (id) => {
  navigate('/editproperty', { state: { id } });
 };

 useEffect(() => {
  if (user) {
   getUserData(User.email);
  }
 }, [user]);

 useEffect(() => {
  if (!isLoading) {
   fetchProperties(userData.id);
  }
 }, [isLoading]);

 if (isLoading) {
  return (
   <div className="loading">
    <Spin size="large" />
   </div>
  );
 }
 return (
  <Layout className="contentStyle">
   <Head />
   <Layout>
    <Content className="container">
     <Row gutter={[32, 32]}>
      {!loading && properties && (
       <>
        {properties.map((property) => (
         <Col xs={24} md={6} key={property.id}>
          <Card
           style={{ textAlign: 'center' }}
           cover={
            <Carousel autoplay effect="fade" key={property.id}>
             {typeof property.photos === 'string'
              ? JSON.parse(property.photos).map((photo) => (
                 <img key={photo} alt={property.name} src={photo} />
                ))
              : property.photos.map((photo, index) => (
                 <img key={index} alt={property.name} src={photo} />
                ))}
            </Carousel>
           }
           actions={[
            <EyeOutlined key="display" onClick={() => display(property.id)} />,
            <EditOutlined key="edit" onClick={() => edit(property.id)} />,
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
      <Col xs={24} md={6}>
       <AddPropertyCard userData={userData} />
      </Col>
     </Row>
    </Content>
   </Layout>
   <Foot />
  </Layout>
 );
};

export default PropertyManagerHome;
