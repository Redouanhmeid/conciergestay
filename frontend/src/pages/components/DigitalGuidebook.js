import React, { useState, useEffect, useMemo } from 'react';
import {
 Spin,
 Layout,
 Row,
 Col,
 Typography,
 Tabs,
 Grid,
 Divider,
 Image,
 Flex,
 Button,
 Card,
 Modal,
} from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import queryString from 'query-string';
import Head from '../../components/common/header';
import Foot from '../../components/common/footer';
import useGetProperty from '../../hooks/useGetProperty';
import useAmenity from '../../hooks/useAmenity';
import MapMarker from './MapMarker';
import ReactPlayer from 'react-player';
import NearbyPlacesCarouselByType from './nearbyplacescarouselbytype';
import MapNearbyPlaces from './MapNearbyPlaces';
import { formatTimeFromDatetime, getAdditionalRules } from '../../utils/utils';
import {
 getHouseRuleDetails,
 getElementsDetails,
 getSafetyFeaturesDetails,
 getEarlyCheckInDetails,
 getAccessToPropertyDetails,
 getLateCheckOutPolicyDetails,
 getBeforeCheckOutDetails,
} from '../../utils/iconMappings';
import Print from './print';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useUserData } from '../../hooks/useUserData';
import ShareModal from '../../components/common/ShareModal';
import HouseManual from './HouseManual';

const { Content } = Layout;
const { Text, Paragraph } = Typography;
const { useBreakpoint } = Grid;
const { Meta } = Card;

const parseJSON = (str) => {
 try {
  return JSON.parse(str);
 } catch (error) {
  console.error('Failed to parse JSON:', error);
  return [];
 }
};

const ensureArray = (value) => {
 if (typeof value === 'string') {
  return parseJSON(value);
 }
 if (Array.isArray(value)) {
  return value;
 }
 return [];
};

const isValidCoordinate = (coord) => typeof coord === 'number' && !isNaN(coord);

const generateTabs = (
 isOwner,
 property,
 amenities,
 memoizedAmenities,
 navigate,
 id,
 earlyCheckInParagraphs,
 accessToPropertyParagraphs,
 validLatitude,
 validLongitude,
 parkingAmenity,
 paidparkingAmenity,
 lateCheckOutPolicyParagraphs,
 beforeCheckOutParagraphs
) => [
 {
  key: '1',
  icon: <i className="fa-light fa-key"></i>,
  tab: 'Arrivée',
  content: (
   <div>
    {earlyCheckInParagraphs.length > 0 && (
     <div>
      <Flex gap="middle" align="center" justify="space-between">
       <Divider>
        <Text strong>
         <i className="fa-light fa-key"></i> Arrivée
        </Text>
        {isOwner && (
         <Button
          icon={<i className="fa-light fa-pen-to-square" />}
          onClick={() => navigate(`/editcheckin?id=${id}`)}
          type="link"
          size="Large"
          style={{ fontSize: 16 }}
         />
        )}
       </Divider>
      </Flex>
      <Row gutter={[16, 16]}>
       <Col xs={24} md={16}>
        <Paragraph>
         L'heure d'enregistrement s'effectue à tout moment après{' '}
         {formatTimeFromDatetime(property.checkInTime)}
        </Paragraph>
        {earlyCheckInParagraphs.map((paragraph, index) => (
         <Paragraph key={index}>{paragraph}</Paragraph>
        ))}
       </Col>
       <Col xs={24} md={8}>
        {property.frontPhoto && <Image src={property.frontPhoto} />}
       </Col>
      </Row>
     </div>
    )}
    {/* Display video if videoCheckIn is not null or empty */}
    {property.videoCheckIn && (
     <div>
      <Divider>
       <i className="fa-light fa-video"></i>
       <Text strong> Vidéo d'enregistrement</Text>
      </Divider>
      <ReactPlayer url={property.videoCheckIn} controls width="100%" />
     </div>
    )}
    {accessToPropertyParagraphs.length > 0 && (
     <div>
      <Divider>
       <i className="fa-light fa-lock-keyhole-open"></i>
       <Text strong> Obtenir l'accès</Text>
      </Divider>
      {accessToPropertyParagraphs.map((paragraph, index) => (
       <Paragraph key={index}>{paragraph}</Paragraph>
      ))}
     </div>
    )}
    {property.guestAccessInfo && (
     <Paragraph>
      <Text strong>N.b : </Text>
      {property.guestAccessInfo}
     </Paragraph>
    )}

    {validLatitude && validLongitude ? (
     <Divider>
      <i className="fa-light fa-map-location-dot"></i>
      <Text strong> Arriver ici</Text>
     </Divider>
    ) : (
     <div>Coordonnées fournies non valides.</div>
    )}
    {validLatitude && validLongitude && (
     <Row gutter={[16, 16]}>
      <Col
       xs={24}
       md={
        parkingAmenity && paidparkingAmenity
         ? 12 // both exist
         : parkingAmenity || paidparkingAmenity
         ? 16 // one exists
         : 24 // none exist
       }
      >
       <MapMarker latitude={property.latitude} longitude={property.longitude} />
      </Col>

      {parkingAmenity && (
       <Col xs={24} md={paidparkingAmenity ? 6 : 8}>
        <Image width={'100%'} src={parkingAmenity.media} />
        <br />
        <Paragraph>{parkingAmenity.description}</Paragraph>
       </Col>
      )}
      {paidparkingAmenity && (
       <Col xs={24} md={parkingAmenity ? 6 : 8}>
        <Image width={'100%'} src={paidparkingAmenity.media} />
        <br />
        <Paragraph>{paidparkingAmenity.description}</Paragraph>
       </Col>
      )}
     </Row>
    )}
   </div>
  ),
 },
 {
  key: '2',
  icon: <i className="fa-light fa-door-open"></i>,
  tab: 'Manuel de la maison',
  content:
   amenities.length > 0 ? (
    <HouseManual amenities={memoizedAmenities} />
   ) : (
    <div
     style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
     }}
    >
     Aucun équipement disponible
    </div> // Fallback when no amenities exist
   ),
 },
 {
  key: '3',
  icon: <i className="fa-light fa-lock-keyhole"></i>,
  tab: 'Départ',
  content: (
   <div>
    {lateCheckOutPolicyParagraphs.length > 0 && (
     <div>
      <Flex gap="middle" align="center" justify="space-between">
       <Divider>
        <Text strong>
         <i className="fa-light fa-lock-keyhole"></i> Départ
        </Text>
        {isOwner && (
         <Button
          icon={<i className="fa-light fa-pen-to-square" />}
          onClick={() => navigate(`/editcheckout?id=${id}`)}
          type="link"
          size="Large"
          style={{ fontSize: 16 }}
         />
        )}
       </Divider>
      </Flex>
      <Paragraph>
       L'heure de départ s'effectue à tout moment avant{' '}
       {formatTimeFromDatetime(property.checkOutTime)}
      </Paragraph>
      {lateCheckOutPolicyParagraphs.map((paragraph, index) => (
       <Paragraph key={index}>{paragraph}</Paragraph>
      ))}
     </div>
    )}

    {beforeCheckOutParagraphs.length > 0 && (
     <div>
      <Divider>
       <i className="fa-light fa-house-person-leave"></i>
       <Text strong> Avant de quitter</Text>
      </Divider>
      {beforeCheckOutParagraphs.map((paragraph, index) => (
       <Paragraph key={index}>{paragraph}</Paragraph>
      ))}
     </div>
    )}

    {property.additionalCheckOutInfo && (
     <Paragraph>
      <Text strong>N.b : </Text>
      {property.additionalCheckOutInfo}
     </Paragraph>
    )}
   </div>
  ),
 },
 {
  key: '4',
  icon: <i className="fa-light fa-plate-utensils"></i>,
  tab: 'Restaurants & Cafés',
  content: (
   <div>
    <MapNearbyPlaces
     latitude={property.latitude}
     longitude={property.longitude}
     type="Restaurant & Café"
    />
    <Divider />
    <NearbyPlacesCarouselByType
     latitude={property.latitude}
     longitude={property.longitude}
     type="Restaurant & Café"
    />
   </div>
  ),
 },
 {
  key: '5',
  icon: <i className="fa-light fa-sun-cloud"></i>,
  tab: 'Activités',
  content: (
   <div>
    <MapNearbyPlaces
     latitude={property.latitude}
     longitude={property.longitude}
     type="Activité"
    />
    <Divider />
    <NearbyPlacesCarouselByType
     latitude={property.latitude}
     longitude={property.longitude}
     type="Activité"
    />
   </div>
  ),
 },
 {
  key: '6',
  icon: <i className="fa-light fa-camera"></i>,
  tab: 'Attractions',
  content: (
   <div>
    <MapNearbyPlaces
     latitude={property.latitude}
     longitude={property.longitude}
     type="Attraction"
    />
    <Divider />
    <NearbyPlacesCarouselByType
     latitude={property.latitude}
     longitude={property.longitude}
     type="Attraction"
    />
   </div>
  ),
 },
 {
  key: '7',
  icon: <i className="fa-light fa-store"></i>,
  tab: 'Centres commerciaux',
  content: (
   <div>
    <MapNearbyPlaces
     latitude={property.latitude}
     longitude={property.longitude}
     type="Centre commercial"
    />
    <Divider />
    <NearbyPlacesCarouselByType
     latitude={property.latitude}
     longitude={property.longitude}
     type="Centre commercial"
    />
   </div>
  ),
 },
];

const DigitalGuidebook = () => {
 const screens = useBreakpoint();
 const location = useLocation();
 const { id } = queryString.parse(location.search);
 const navigate = useNavigate();
 const { user } = useAuthContext();
 const storedUser = user || JSON.parse(localStorage.getItem('user'));
 const { userData, getUserDataById, isLoading } = useUserData();
 const { property, loading } = useGetProperty(id);
 const { getAllAmenities } = useAmenity();
 const [amenities, setAmenities] = useState([]);
 const [isOwner, setIsOwner] = useState(false);
 const [isShareModalVisible, setIsShareModalVisible] = useState(false);
 const rows = 4;

 useEffect(() => {
  if (property.propertyManagerId) {
   getUserDataById(property.propertyManagerId);
  }
 }, [property.propertyManagerId]);

 const fetchAmenities = async () => {
  if (id) {
   try {
    const response = await getAllAmenities(id);

    // Only update the amenities state if there are valid amenities to show
    if (response && Array.isArray(response) && response.length > 0) {
     setAmenities(response);
    }
   } catch (error) {
    console.error('Failed to fetch amenities:', error);
   }
  }
 };

 useEffect(() => {
  fetchAmenities();
 }, [id]);

 useEffect(() => {
  if (storedUser && userData) {
   if (String(storedUser.email) === String(userData.email)) {
    setIsOwner(true);
   }
  }
 }, [storedUser, userData]);

 const parsedAmenities = useMemo(() => ensureArray(amenities), [amenities]);
 const parkingAmenity = useMemo(
  () => parsedAmenities.find((amenity) => amenity.name === 'freeParking'),
  [parsedAmenities]
 );
 const paidparkingAmenity = useMemo(
  () => parsedAmenities.find((amenity) => amenity.name === 'paidParking'),
  [parsedAmenities]
 );
 const earlyCheckInParagraphs = useMemo(
  () => ensureArray(property?.earlyCheckIn).map(getEarlyCheckInDetails),
  [property?.earlyCheckIn]
 );
 const accessToPropertyParagraphs = useMemo(
  () => ensureArray(property?.accessToProperty).map(getAccessToPropertyDetails),
  [property?.accessToProperty]
 );
 const lateCheckOutPolicyParagraphs = useMemo(
  () =>
   ensureArray(property?.lateCheckOutPolicy).map(getLateCheckOutPolicyDetails),
  [property?.lateCheckOutPolicy]
 );
 const beforeCheckOutParagraphs = useMemo(
  () => ensureArray(property?.beforeCheckOut).map(getBeforeCheckOutDetails),
  [property?.beforeCheckOut]
 );

 const validLatitude = isValidCoordinate(property?.latitude);
 const validLongitude = isValidCoordinate(property?.longitude);

 const showShareModal = () => {
  setIsShareModalVisible(true);
 };

 const hideShareModal = () => {
  setIsShareModalVisible(false);
 };

 const pageUrl = window.location.href;

 const memoizedAmenities = useMemo(() => {
  // Transform amenities data into the required format
  return amenities.reduce((acc, amenity) => {
   acc[amenity.name] = {
    description: amenity.description,
    media: amenity.media,
    wifiName: amenity.wifiName,
    wifiPassword: amenity.wifiPassword,
   };
   return acc;
  }, {});
 }, [amenities]);

 const innerTabs = useMemo(
  () =>
   generateTabs(
    isOwner,
    property,
    amenities,
    memoizedAmenities,
    navigate,
    id,
    earlyCheckInParagraphs,
    accessToPropertyParagraphs,
    validLatitude,
    validLongitude,
    parkingAmenity,
    paidparkingAmenity,
    lateCheckOutPolicyParagraphs,
    beforeCheckOutParagraphs
   ),
  [
   isOwner,
   property,
   amenities,
   memoizedAmenities,
   navigate,
   id,
   earlyCheckInParagraphs,
   accessToPropertyParagraphs,
   validLatitude,
   validLongitude,
   parkingAmenity,
   paidparkingAmenity,
   lateCheckOutPolicyParagraphs,
   beforeCheckOutParagraphs,
  ]
 );

 if (loading) {
  return (
   <div className="loading">
    <Spin size="large" />
   </div>
  );
 }

 return (
  <Layout className="contentStyle">
   <Head />
   <Layout className="container-fluid">
    <Content>
     <Flex gap="middle" align="start" justify="space-between">
      <Button
       type="default"
       shape="round"
       icon={<ArrowLeftOutlined />}
       onClick={() => navigate(-1)}
      >
       Retour
      </Button>
      <Button
       icon={<i className="fa-light fa-share-nodes" />}
       onClick={showShareModal}
      >
       Partager
      </Button>
     </Flex>
     <Divider type="vertical" />
     <Row gutter={[16, 16]}>
      <Col xs={24}>
       <Tabs
        defaultActiveKey="1"
        tabPosition={screens.md ? 'left' : 'top'}
        size="large"
        items={innerTabs.map((tab) => ({
         label: tab.tab,
         icon: tab.icon,
         key: tab.key,
         children:
          tab.key === '1' && (!validLatitude || !validLongitude) ? (
           <div>Coordonnées fournies non valides.</div>
          ) : (
           tab.content
          ),
        }))}
       />
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

export default DigitalGuidebook;
