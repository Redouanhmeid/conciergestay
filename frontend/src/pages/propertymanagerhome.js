import React, { useState, useEffect } from 'react';
import Head from '../components/common/header';
import Foot from '../components/common/footer';
import { Layout, Spin, Card, Col, Row, Carousel, Image } from 'antd';
import '../App.css';
import AddPropertyCard from './components/AddPropertyCard';
import ShareModal from '../components/common/ShareModal';
import { useAuthContext } from '../hooks/useAuthContext';
import { useUserData } from '../hooks/useUserData';
import useProperty from '../hooks/useProperty';
import { useNavigate } from 'react-router-dom';
import fallback from '../assets/fallback.png';

const { Content } = Layout;
const PropertyManagerHome = () => {
 const { user } = useAuthContext();
 const { isLoading, userData, getUserData } = useUserData();
 const User = user || JSON.parse(localStorage.getItem('user'));
 const { properties, loading, fetchPropertiesbypm } = useProperty();
 const navigate = useNavigate();
 const [isShareModalVisible, setIsShareModalVisible] = useState(false);
 const [pageUrl, setPageUrl] = useState();
 const [imageAspectRatios, setImageAspectRatios] = useState({});

 const display = (id) => {
  navigate(`/propertydetails?id=${id}`);
 };
 const displayPrivate = (id) => {
  navigate(`/digitalguidebook?id=${id}`);
 };
 const showShareModal = (id) => {
  setPageUrl();
  setPageUrl(`${window.location.origin}/propertydetails?id=${id}`);
  setIsShareModalVisible(true);
 };

 const hideShareModal = () => {
  setIsShareModalVisible(false);
 };

 useEffect(() => {
  if (user) {
   getUserData(User.email);
  }
 }, [user]);

 useEffect(() => {
  if (!isLoading) {
   fetchPropertiesbypm(userData.id);
  }
 }, [isLoading]);

 const handleImageLoad = (e, index) => {
  const { naturalWidth, naturalHeight } = e.target;
  const aspectRatio = naturalHeight > naturalWidth ? 'portrait' : 'landscape';

  setImageAspectRatios((prevState) => {
   const newState = {
    ...prevState,
    [index]: aspectRatio,
   };
   return newState;
  });
 };

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
            <Carousel
             className="propertycarousel"
             autoplay
             effect="fade"
             key={property.id}
            >
             {property.photos.map((photo, index) => (
              <div key={index} className="image-container">
               <Image
                key={index}
                alt={property.name}
                src={photo}
                preview={false}
                placeholder={
                 <div className="image-placeholder">Chargement...</div>
                }
                fallback={fallback}
                className={`card-image ${imageAspectRatios[index]}`}
                onLoad={(e) => handleImageLoad(e, index)}
               />
              </div>
             ))}
            </Carousel>
           }
           actions={[
            <div key="display" onClick={() => display(property.id)}>
             <i className="Dashicon fa-light fa-eye" />
            </div>,
            <div key="ellipsis" onClick={() => displayPrivate(property.id)}>
             <i className="Dashicon fa-light fa-house-lock" />
            </div>,
            <div key="share" onClick={() => showShareModal(property.id)}>
             <i className="Dashicon fa-light fa-share-nodes" />
            </div>,
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
   <ShareModal
    isVisible={isShareModalVisible}
    onClose={hideShareModal}
    pageUrl={pageUrl}
   />
  </Layout>
 );
};

export default PropertyManagerHome;
