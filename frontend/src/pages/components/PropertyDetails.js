import React, { useState, useEffect } from 'react';
import {
 Anchor,
 Layout,
 Typography,
 List,
 Spin,
 Image,
 Rate,
 Divider,
 Flex,
 Tag,
 Carousel,
 Row,
 Col,
 FloatButton,
 Button,
 Card,
 Modal,
} from 'antd';
import {
 ArrowLeftOutlined,
 PlusOutlined,
 EyeOutlined,
 SettingOutlined,
} from '@ant-design/icons';
import Head from '../../components/common/header';
import Foot from '../../components/common/footer';
import { useNavigate, useLocation } from 'react-router-dom';
import MapMarker from './MapMarker';
import NearbyPlacesCarousel from './nearbyplacescarousel';
import { Helmet } from 'react-helmet';
import useGetProperty from '../../hooks/useGetProperty';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useUserData } from '../../hooks/useUserData';
import useAmenity from '../../hooks/useAmenity';
import ReactPlayer from 'react-player';

const { Title, Text, Paragraph } = Typography;
const { Content } = Layout;
const { Meta } = Card;

const getAmenityDetails = (type, item) => {
 const details = {
  basic: {
   wifi: {
    avatar: <i className="icon-style fa-light fa-wifi"></i>,
    title: 'Wifi',
   },
   television: {
    avatar: <i className="icon-style fa-light fa-tv"></i>,
    title: 'Télévision',
   },
   kitchen: {
    avatar: <i className="icon-style fa-light fa-microwave"></i>,
    title: 'Cuisine',
   },
   washingMachine: {
    avatar: <i className="icon-style fa-light fa-washing-machine"></i>,
    title: 'Machine à laver',
   },
   freeParking: {
    avatar: <i className="icon-style fa-light fa-square-parking"></i>,
    title: 'Parking gratuit',
   },
   airConditioning: {
    avatar: <i className="icon-style fa-light fa-snowflake"></i>,
    title: 'Climatisation',
   },
   dedicatedWorkspace: {
    avatar: <i className="icon-style fa-light fa-laptop"></i>,
    title: 'Espace de travail',
   },
  },
  uncommon: {
   pool: {
    avatar: <i className="icon-style fa-light fa-water-ladder"></i>,
    title: 'Piscine',
   },
   outdoorDining: {
    avatar: <i className="icon-style fa-light fa-plate-utensils"></i>,
    title: 'Espace repas en plein air',
   },
   fireplace: {
    avatar: <i className="icon-style fa-light fa-fireplace"></i>,
    title: 'Cheminée',
   },
   fitnessEquipment: {
    avatar: <i className="icon-style fa-light fa-dumbbell"></i>,
    title: 'Équipement de fitness',
   },
   lakeAccess: {
    avatar: <i className="icon-style fa-light fa-water"></i>,
    title: 'Accès au lac',
   },
   beachAccess: {
    avatar: <i className="icon-style fa-light fa-umbrella-beach"></i>,
    title: 'Accès à la plage',
   },
   skiAccess: {
    avatar: <i className="icon-style fa-light fa-person-skiing"></i>,
    title: 'Accès aux pistes de ski',
   },
  },
  security: {
   smokeDetector: {
    avatar: <i className="icon-style fa-light fa-sensor-cloud"></i>,
    title: 'Détecteur de fumée',
   },
   firstAidKit: {
    avatar: <i className="icon-style fa-light fa-suitcase-medical"></i>,
    title: 'Kit de premiers secours',
   },
   fireExtinguisher: {
    avatar: <i className="icon-style fa-light fa-fire-extinguisher"></i>,
    title: 'Extincteur',
   },
   carbonMonoxideDetector: {
    avatar: <i className="icon-style fa-light fa-sensor"></i>,
    title: 'Détecteur de monoxyde de carbone',
   },
  },
  elements: {
   cameras: {
    avatar: <i className="icon-style fa-light fa-camera-cctv"></i>,
    title: 'Caméras de surveillance extérieures',
   },
   sonometers: {
    avatar: <i className="icon-style fa-light fa-gauge-low"></i>,
    title: 'Sonomètres',
   },
   weapons: {
    avatar: <i className="icon-style fa-light fa-crosshairs"></i>,
    title: 'Armes',
   },
  },
  houseRules: {
   noNoise: {
    avatar: <i className="icon-style fa-light fa-volume-slash"></i>,
    title: 'Pas de bruit après 23h',
   },
   noFoodDrinks: {
    avatar: <i className="icon-style fa-light fa-utensils-slash"></i>,
    title: 'Pas de nourriture ni de boissons dans les chambres à coucher',
   },
   noParties: {
    avatar: <i className="icon-style fa-light fa-champagne-glasses"></i>,
    title: "Pas de fêtes ni d'événements",
   },
   noSmoking: {
    avatar: <i className="icon-style fa-light fa-ban-smoking"></i>,
    title: 'Défense de fumer',
   },
   noPets: {
    avatar: <i className="icon-style fa-light fa-paw-simple"></i>,
    title: "Pas d'animaux de compagnie",
   },
   additionalRules: {
    avatar: <i className="icon-style fa-light fa-circle-info"></i>,
    title: 'Règles supplémentaires',
   },
  },
 };
 return details[type]?.[item] || { avatar: null, title: '' };
};

const PropertyDetails = () => {
 const location = useLocation();
 const { id } = location.state;
 const navigate = useNavigate();
 const { property, loading } = useGetProperty(id);
 const { user } = useAuthContext();
 const User = user || JSON.parse(localStorage.getItem('user'));
 const { userData, getUserData } = useUserData();
 const { getAllAmenities, getOneAmenity } = useAmenity();
 const [amenities, setAmenities] = useState([]);
 const [selectedAmenityDetails, setSelectedAmenityDetails] = useState(null);
 const [isModalVisible, setIsModalVisible] = useState(false);

 useEffect(() => {
  if (User && User.status !== 'EN ATTENTE') {
   getUserData(User.email);
  }
 }, [User]);

 useEffect(() => {
  const fetchData = async (id) => {
   const data = await getAllAmenities(id);
   if (data) {
    setAmenities(data);
   }
  };
  if (property.id) {
   fetchData(property.id);
  }
 }, [property.id]);

 const hasAmenity = (amenityName) => {
  return amenities.some((amenity) => amenity.name === amenityName);
 };

 const goBack = () => {
  navigate(-1);
 };

 const nearbyPlace = () => {
  navigate('/createnearbyplace');
 };

 const AddAmenity = (amenity) => {
  navigate('/addamenity', { state: { amenity: amenity, id: property.id } });
 };

 const EditAmenity = (id) => {
  navigate('/editamenity', { state: { id } });
 };

 const showModal = async (amenityName) => {
  const amenity = amenities.find((a) => a.name === amenityName);
  if (amenity) {
   const amenityDetails = await getOneAmenity(amenity.id);
   setSelectedAmenityDetails(amenityDetails);
   setIsModalVisible(true);
  }
 };

 const handleOk = () => {
  setIsModalVisible(false);
  setSelectedAmenityDetails(null);
 };

 const handleCancel = () => {
  setIsModalVisible(false);
 };

 // Utility to parse JSON strings safely
 const parseJSON = (str) => {
  try {
   return JSON.parse(str);
  } catch (error) {
   console.error('Failed to parse JSON:', error);
   return [];
  }
 };
 function scrollToAnchor(anchorId) {
  const element = document.getElementById(anchorId);
  if (element) {
   element.scrollIntoView({ behavior: 'smooth' });
  }
 }

 // Parse properties if they are strings
 const parsedProperty = {
  ...property,
  photos:
   typeof property.photos === 'string'
    ? parseJSON(property.photos)
    : property.photos,
  basicAmenities:
   typeof property.basicAmenities === 'string'
    ? parseJSON(property.basicAmenities)
    : property.basicAmenities,
  uncommonAmenities:
   typeof property.uncommonAmenities === 'string'
    ? parseJSON(property.uncommonAmenities)
    : property.uncommonAmenities,
  safetyFeatures:
   typeof property.safetyFeatures === 'string'
    ? parseJSON(property.safetyFeatures)
    : property.safetyFeatures,
  elements:
   typeof property.elements === 'string'
    ? parseJSON(property.elements)
    : property.elements,
  houseRules:
   typeof property.houseRules === 'string'
    ? parseJSON(property.houseRules)
    : property.houseRules,
 };

 if (loading) {
  return (
   <div className="loading">
    <Spin size="large" />
   </div>
  );
 }

 return (
  <>
   <Helmet>
    <link
     rel="stylesheet"
     href="https://site-assets.fontawesome.com/releases/v6.4.2/css/all.css"
    />
   </Helmet>
   <Layout className="contentStyle">
    <Head />

    <Layout>
     <div style={{ padding: '20px' }}>
      <Anchor
       direction="horizontal"
       className="custom-anchor"
       onClick={(e, link) => {
        e.preventDefault();
        scrollToAnchor(link.href.slice(1));
       }}
       items={[
        {
         key: '1',
         href: '#desc',
         title: 'Informations de base',
        },
        {
         key: '2',
         href: '#basicamenities',
         title: 'Commodités de base',
        },
        {
         key: '3',
         href: '#map&nearbyplaces',
         title: 'Où se situe',
        },
        {
         key: '4',
         href: '#equipements',
         title: 'Équipements',
        },
        {
         key: '5',
         href: '#rules',
         title: 'Règles',
        },
       ]}
      />
     </div>
     <Content className="container">
      <Button
       type="default"
       shape="round"
       icon={<ArrowLeftOutlined />}
       onClick={goBack}
      >
       Retour
      </Button>
      {(userData.role === 'manager' || userData.role === 'admin') && (
       <FloatButton
        icon={<i className="fa-light fa-location-plus"></i>}
        tooltip={<div>Ajouter un lieu à proximité</div>}
        type="primary"
        onClick={nearbyPlace}
       />
      )}
      <Row gutter={[32, 32]}>
       <Col xs={24} sm={12} id="desc">
        <div
         style={{ maxWidth: '600px', height: '400px', margin: '12px auto' }}
        >
         <Carousel autoplay effect="fade">
          {Array.isArray(parsedProperty.photos) &&
           parsedProperty.photos.map((photo, index) => (
            <div key={index}>
             <Image src={photo} />
            </div>
           ))}
         </Carousel>
        </div>
       </Col>
       <Col xs={24} sm={12}>
        <Title level={1}>{parsedProperty.name}</Title>
        <div>
         <Rate disabled defaultValue="4.7" />
         <Text> 4.7</Text>
         <Text> (107 avis)</Text>
        </div>
        <Title level={3}>{parsedProperty.price} Dh / Nuit</Title>
        <Flex gap="4px 0" wrap>
         <Tag icon={<i className="tag-icon-style fa-light fa-bed-front"></i>}>
          {parsedProperty.rooms} Chambres
         </Tag>
         <Tag icon={<i className="tag-icon-style fa-light fa-users"></i>}>
          {parsedProperty.capacity} Voyageurs
         </Tag>
         <Tag icon={<i className="tag-icon-style fa-light fa-bed"></i>}>
          {parsedProperty.beds} Lit
         </Tag>
        </Flex>
        <Divider />
        <Paragraph>{parsedProperty.description}</Paragraph>
       </Col>
       <Divider id="basicamenities" />
       {parsedProperty.basicAmenities && (
        <Col xs={24} sm={24}>
         <Title level={3}>Commodités de base:</Title>
         <br />
         <Row gutter={[16, 16]}>
          {parsedProperty.basicAmenities.map((amenity, index) => {
           const { avatar, title } = getAmenityDetails('basic', amenity);
           const amenityExists = hasAmenity(amenity);
           return (
            <Col
             xs={12}
             md={4}
             key={index}
             style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
             }}
            >
             <Card
              bordered={false}
              hoverable={false}
              cover={
               <div
                onClick={() =>
                 amenityExists &&
                 (userData.role === 'manager' || userData.role === 'admin') &&
                 showModal(amenity)
                }
                style={{
                 cursor:
                  amenityExists &&
                  (userData.role === 'manager' || userData.role === 'admin')
                   ? 'pointer'
                   : 'default',
                }}
               >
                {avatar}
               </div>
              }
              style={{
               textAlign: 'center',
               width: '90%',
               display: 'flex',
               flexDirection: 'column',
               alignItems: 'center',
              }}
             >
              <Meta
               title={title}
               description={
                (userData.role === 'manager' || userData.role === 'admin') && (
                 <>
                  {!amenityExists && (
                   <Button
                    icon={<PlusOutlined />}
                    onClick={() => AddAmenity(amenity)}
                   >
                    Ajouter une carte
                   </Button>
                  )}
                  {amenityExists && (
                   <Button
                    icon={<EyeOutlined />}
                    onClick={() => showModal(amenity)}
                   >
                    Voir la carte
                   </Button>
                  )}
                 </>
                )
               }
              />
             </Card>
            </Col>
           );
          })}
         </Row>
         {selectedAmenityDetails && (
          <Modal
           title={selectedAmenityDetails.name.toUpperCase()}
           open={isModalVisible}
           onOk={handleOk}
           onCancel={handleCancel}
           footer={
            (userData.role === 'manager' || userData.role === 'admin') && (
             <Button
              icon={<SettingOutlined />}
              type="primary"
              onClick={() => EditAmenity(selectedAmenityDetails.id)}
             >
              Modifier la carte
             </Button>
            )
           }
          >
           <Flex vertical align="center">
            {ReactPlayer.canPlay(selectedAmenityDetails.media) ? (
             <ReactPlayer
              url={selectedAmenityDetails.media}
              controls
              width="100%"
              height={300}
             />
            ) : (
             <Image
              width={300}
              src={selectedAmenityDetails.media}
              preview={false}
             />
            )}
            <br />
            <Text>{selectedAmenityDetails.description}</Text>
            {selectedAmenityDetails.name === 'wifi' && (
             <>
              <Divider>
               <Text strong>Accéder au Wi-Fi</Text>
              </Divider>
              <Text>Nom de réseau : {selectedAmenityDetails.wifiName}</Text>
              <Text>Mot de passe : {selectedAmenityDetails.wifiPassword}</Text>
             </>
            )}
           </Flex>
          </Modal>
         )}
        </Col>
       )}
       <Divider id="map&nearbyplaces" />
       <Col xs={24} sm={24}>
        <Title level={3}>Où se situe le logement</Title>
        <MapMarker
         latitude={parsedProperty.latitude}
         longitude={parsedProperty.longitude}
        />
       </Col>
       <Col xs={24}>
        <NearbyPlacesCarousel
         latitude={parsedProperty.latitude}
         longitude={parsedProperty.longitude}
        />
       </Col>
       <Divider id="equipements" />
       <Col xs={24} sm={8}>
        {parsedProperty.uncommonAmenities && (
         <Col xs={24} sm={24}>
          <Title level={3}>Équipement hors du commun:</Title>
          <br />
          <Row gutter={[0, 16]}>
           {parsedProperty.uncommonAmenities.map((uncommonAmenity, index) => {
            const { avatar, title } = getAmenityDetails(
             'uncommon',
             uncommonAmenity
            );
            return (
             <Col xs={12} md={4} key={index} style={{ maxWidth: '100%' }}>
              <Card
               bordered={false}
               hoverable={false}
               cover={avatar}
               style={{ width: '100%', textAlign: 'center' }}
              >
               <Meta title={title} />
              </Card>
             </Col>
            );
           })}
          </Row>
         </Col>
        )}
       </Col>
       <Col xs={24} sm={8}>
        {parsedProperty.safetyFeatures && (
         <Col xs={24} sm={24}>
          <Title level={3}>Équipement de sécurité:</Title>
          <br />
          <Row gutter={[0, 16]}>
           {parsedProperty.safetyFeatures.map((safetyFeature, index) => {
            const { avatar, title } = getAmenityDetails(
             'security',
             safetyFeature
            );
            return (
             <Col xs={12} md={4} key={index} style={{ maxWidth: '100%' }}>
              <Card
               bordered={false}
               hoverable={false}
               cover={avatar}
               style={{ width: '100%', textAlign: 'center' }}
              >
               <Meta title={title} />
              </Card>
             </Col>
            );
           })}
          </Row>
         </Col>
        )}
       </Col>
       <Col xs={24} sm={8}>
        {parsedProperty.elements && (
         <Col xs={24} sm={24}>
          <Title level={3}>Équipement supplémentaire:</Title>
          <br />
          <Row gutter={[0, 16]}>
           {parsedProperty.elements.map((element, index) => {
            const { avatar, title } = getAmenityDetails('elements', element);
            return (
             <Col xs={12} md={4} key={index} style={{ maxWidth: '100%' }}>
              <Card
               bordered={false}
               hoverable={false}
               cover={avatar}
               style={{ width: '100%', textAlign: 'center' }}
              >
               <Meta title={title} />
              </Card>
             </Col>
            );
           })}
          </Row>
         </Col>
        )}
       </Col>
       <Divider id="rules" />
       {parsedProperty.houseRules && (
        <Col xs={24} sm={24}>
         <Title level={3}>Règles de la maison:</Title>
         <br />
         <Row gutter={[0, 16]}>
          {parsedProperty.houseRules.map((houseRule, index) => {
           const { avatar, title } = getAmenityDetails('houseRules', houseRule);
           return (
            <Col xs={24} md={4} key={index} style={{ maxWidth: '100%' }}>
             <Card
              bordered={false}
              hoverable={false}
              cover={avatar}
              style={{ width: '100%', textAlign: 'center' }}
             >
              <Meta title={title} />
             </Card>
            </Col>
           );
          })}
         </Row>
        </Col>
       )}
      </Row>
     </Content>
    </Layout>
    <Foot />
   </Layout>
  </>
 );
};

export default PropertyDetails;
