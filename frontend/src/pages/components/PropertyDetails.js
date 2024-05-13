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
import MapMarker1 from './MapMarker1';
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

const getbasicAmenityDetails = (item) => {
 switch (item) {
  case 'wifi':
   return {
    avatar: <i className="icon-style fa-light fa-wifi"></i>,
    title: 'Wifi',
   };
  case 'television':
   return {
    avatar: <i className="icon-style fa-light fa-tv"></i>,
    title: 'Télévision',
   };
  case 'kitchen':
   return {
    avatar: <i className="icon-style fa-light fa-microwave"></i>,
    title: 'Cuisine',
   };
  case 'washingMachine':
   return {
    avatar: <i className="icon-style fa-light fa-washing-machine"></i>,
    title: 'Machine à laver',
   };
  case 'freeParking':
   return {
    avatar: <i className="icon-style fa-light fa-square-parking"></i>,
    title: 'Parking gratuit',
   };
  case 'airConditioning':
   return {
    avatar: <i className="icon-style fa-light fa-snowflake"></i>,
    title: 'Climatisation',
   };
  case 'dedicatedWorkspace':
   return {
    avatar: <i className="icon-style fa-light fa-laptop"></i>,
    title: 'Espace de travail',
   };
  default:
   return { avatar: null, title: '' };
 }
};
const getuncommonAmenityDetails = (item) => {
 switch (item) {
  case 'pool':
   return {
    avatar: <i className="icon-style fa-light fa-water-ladder"></i>,
    title: 'Piscine',
   };
  case 'outdoorDining':
   return {
    avatar: <i className="icon-style fa-light fa-plate-utensils"></i>,
    title: 'Espace repas en plein air',
   };
  case 'fireplace':
   return {
    avatar: <i className="icon-style fa-light fa-fireplace"></i>,
    title: 'Cheminée',
   };
  case 'fitnessEquipment':
   return {
    avatar: <i className="icon-style fa-light fa-dumbbell"></i>,
    title: 'Équipement de fitness',
   };
  case 'lakeAccess':
   return {
    avatar: <i className="icon-style fa-light fa-water"></i>,
    title: 'Accès au lac',
   };
  case 'beachAccess':
   return {
    avatar: <i className="icon-style fa-light fa-umbrella-beach"></i>,
    title: 'Accès à la plage',
   };
  case 'skiAccess':
   return {
    avatar: <i className="icon-style fa-light fa-person-skiing"></i>,
    title: 'Accès aux pistes de ski',
   };
  default:
   return { avatar: null, title: '' };
 }
};

const getSecurityEquipment = (item) => {
 switch (item) {
  case 'smokeDetector':
   return {
    avatar: <i className="icon-style fa-light fa-sensor-cloud"></i>,
    title: 'Détecteur de fumée',
   };
  case 'firstAidKit':
   return {
    avatar: <i className="icon-style fa-light fa-suitcase-medical"></i>,
    title: 'Kit de premiers secours',
   };
  case 'fireExtinguisher':
   return {
    avatar: <i className="icon-style fa-light fa-fire-extinguisher"></i>,
    title: 'Extincteur',
   };
  case 'carbonMonoxideDetector':
   return {
    avatar: <i className="icon-style fa-light fa-sensor"></i>,
    title: 'Détecteur de monoxyde de carbone',
   };
  default:
   return { avatar: null, title: '' };
 }
};
const getElements = (item) => {
 switch (item) {
  case 'cameras':
   return {
    avatar: <i className="icon-style fa-light fa-camera-cctv"></i>,
    title: 'Caméras de surveillance extérieures',
   };
  case 'sonometers':
   return {
    avatar: <i className="icon-style fa-light fa-gauge-low"></i>,
    title: 'Sonomètres',
   };
  case 'weapons':
   return {
    avatar: <i className="icon-style fa-light fa-crosshairs"></i>,
    title: 'Armes',
   };
  default:
   return { avatar: null, title: '' };
 }
};
const getHouseRules = (item) => {
 switch (item) {
  case 'noNoise':
   return {
    avatar: <i className="icon-style fa-light fa-volume-slash"></i>,
    title: 'Pas de bruit après 23h',
   };
  case 'noFoodDrinks':
   return {
    avatar: <i className="icon-style fa-light fa-utensils-slash"></i>,
    title: 'Pas de nourriture ni de boissons dans les chambres à coucher',
   };
  case 'noParties':
   return {
    avatar: <i className="icon-style fa-light fa-champagne-glasses"></i>,
    title: "Pas de fêtes ni d'événements",
   };
  case 'noSmoking':
   return {
    avatar: <i className="icon-style fa-light fa-ban-smoking"></i>,
    title: 'Défense de fumer',
   };
  case 'petsAllowed':
   return {
    avatar: <i className="icon-style fa-light fa-paw-simple"></i>,
    title: "Pas d'animaux de compagnie",
   };
  case 'additionalRules':
   return {
    avatar: <i className="icon-style fa-light fa-circle-info"></i>,
    title: 'Règles supplémentaires',
   };
  default:
   return { avatar: null, title: '' };
 }
};
function scrollToAnchor(anchorId) {
 const element = document.getElementById(anchorId);
 if (element) {
  element.scrollIntoView({ behavior: 'smooth' });
 }
}
const PropertyDetails = () => {
 const location = useLocation();
 const { id } = location.state;
 const { property, loading } = useGetProperty(id);
 const { user } = useAuthContext();
 const User = user || JSON.parse(localStorage.getItem('user'));
 const { userData, getUserData } = useUserData();
 const navigate = useNavigate();
 const { getAllAmenities, getOneAmenity } = useAmenity();
 const [amenities, setAmenities] = useState([]);
 const [selectedAmenityDetails, setSelectedAmenityDetails] = useState(null);
 const [isModalVisible, setIsModalVisible] = useState(false);
 const [selectedAmenity, setSelectedAmenity] = useState(null);

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
 // Check if an amenity exists
 const hasAmenity = (amenityName) => {
  return amenities.some((amenity) => amenity.name === amenityName);
 };
 const goBack = () => {
  navigate(-1); // This will navigate back to the previous page
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
 // Check if the photos property is a string
 if (typeof property.photos === 'string') {
  // Parse string representation of array to actual array
  property.photos = JSON.parse(property.photos);
 }
 // Check if property items are a string and parse them accordingly
 if (typeof property.basicAmenities === 'string') {
  property.basicAmenities = JSON.parse(property.basicAmenities);
 }
 if (typeof property.uncommonAmenities === 'string') {
  property.uncommonAmenities = JSON.parse(property.uncommonAmenities);
 }
 if (typeof property.safetyFeatures === 'string') {
  property.safetyFeatures = JSON.parse(property.safetyFeatures);
 }
 if (typeof property.elements === 'string') {
  property.elements = JSON.parse(property.elements);
 }
 if (typeof property.houseRules === 'string') {
  property.houseRules = JSON.parse(property.houseRules);
 }
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
     <div
      style={{
       padding: '20px',
      }}
     >
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
         style={{ maxWidth: '600px', heidth: '400px', margin: '12px auto' }}
        >
         <Carousel autoplay effect="fade">
          {Array.isArray(property.photos) &&
           property.photos.map((photo, index) => (
            <div key={index}>
             <Image src={photo} />
            </div>
           ))}
         </Carousel>
        </div>
       </Col>
       <Col xs={24} sm={12}>
        <Title level={1}>{property.name}</Title>
        <div>
         <Rate disabled defaultValue="4.7" />
         <Text> 4.7</Text>
         <Text> (107 avis)</Text>
        </div>
        <Title level={3}>{property.price} Dh / Nuit</Title>
        <Flex gap="4px 0" wrap>
         <Tag icon={<i className="tag-icon-style fa-light fa-bed-front"></i>}>
          {property.rooms} Chambres
         </Tag>
         <Tag icon={<i className="tag-icon-style fa-light fa-users"></i>}>
          {property.capacity} Voyageurs
         </Tag>
         <Tag icon={<i className="tag-icon-style fa-light fa-bed"></i>}>
          {property.beds} Lit
         </Tag>
        </Flex>
        <Divider />
        <Paragraph>{property.description}</Paragraph>
       </Col>
       <Divider id="basicamenities" />
       {property.basicAmenities && (
        <Col xs={24} sm={24}>
         <Title level={3}>Commodités de base:</Title>
         <br />
         <Row gutter={[16, 16]}>
          {property.basicAmenities.map((amenity, index) => {
           const { avatar, title } = getbasicAmenityDetails(amenity);
           const amenityExists = hasAmenity(amenity); // Determine if the current amenity exists
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
                onClick={() => amenityExists && showModal(amenity)}
                style={{ cursor: amenityExists ? 'pointer' : 'default' }}
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
        <MapMarker1
         latitude={property.latitude}
         longitude={property.longitude}
        />
       </Col>
       <Col xs={24}>
        <NearbyPlacesCarousel
         latitude={property.latitude}
         longitude={property.longitude}
        />
       </Col>
       <Divider id="equipements" />
       <Col xs={24} sm={8}>
        {property.uncommonAmenities && (
         <Col xs={24} sm={24}>
          <Title level={3}>Équipement hors du commun:</Title>
          <br />
          <Row gutter={[0, 16]}>
           {property.uncommonAmenities.map((uncommonAmenity, index) => {
            const { avatar, title } =
             getuncommonAmenityDetails(uncommonAmenity);
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
        {property.safetyFeatures && (
         <Col xs={24} sm={24}>
          <Title level={3}>Équipement de sécurité:</Title>
          <br />
          <Row gutter={[0, 16]}>
           {property.safetyFeatures.map((safetyFeature, index) => {
            const { avatar, title } = getSecurityEquipment(safetyFeature);
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
        {property.elements && (
         <Col xs={24} sm={24}>
          <Title level={3}>Équipement supplémentaire:</Title>
          <br />
          <Row gutter={[0, 16]}>
           {property.elements.map((element, index) => {
            const { avatar, title } = getElements(element);
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
       {property.houseRules && (
        <Col xs={24} sm={24}>
         <Title level={3}>Règles de la maison:</Title>
         <br />
         <Row gutter={[0, 16]}>
          {property.houseRules.map((houseRule, index) => {
           const { avatar, title } = getHouseRules(houseRule);
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
