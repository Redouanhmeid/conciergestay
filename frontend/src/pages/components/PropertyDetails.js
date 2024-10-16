import React, { useState, useEffect, useCallback } from 'react';
import {
 Anchor,
 Layout,
 Typography,
 Spin,
 Image,
 Divider,
 Flex,
 Tag,
 Carousel,
 Row,
 Col,
 FloatButton,
 Button,
 Card,
 List,
 Modal,
 Avatar,
 Tooltip,
 Dropdown,
 Popconfirm,
 message,
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
import queryString from 'query-string';
import MapMarker from './MapMarker';
import NearbyPlacesCarousel from './nearbyplacescarousel';
import { Helmet } from 'react-helmet';
import useGetProperty from '../../hooks/useGetProperty';
import useDeleteProperty from '../../hooks/useDeleteProperty';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useUserData } from '../../hooks/useUserData';
import useAmenity from '../../hooks/useAmenity';
import ReactPlayer from 'react-player';
import airbnb from '../../assets/airbnb.png';
import booking from '../../assets/booking.png';

const { Title, Text, Paragraph } = Typography;
const { Content } = Layout;
const { Meta } = Card;

const getAmenityDetails = (type, item, showARulesModal) => {
 const details = {
  basic: {
   /* Salle de bain */
   shower: {
    avatar: <i className="fa-light fa-shower fa-xl" />,
    title: 'Douche',
   },
   jacuzzi: {
    avatar: <i className="fa-light fa-hot-tub-person fa-xl" />,
    title: 'Jacuzzi',
   },
   bathtub: {
    avatar: <i className="fa-light fa-bath fa-xl" />,
    title: 'Baignoire',
   },
   /* Chambre et linge */
   washingMachine: {
    avatar: <i className="fa-light fa-washing-machine fa-xl" />,
    title: 'Machine à laver',
   },
   dryerheat: {
    avatar: <i className="fa-light fa-dryer-heat fa-xl" />,
    title: 'Sèche-linge',
   },
   vacuum: {
    avatar: <i className="fa-light fa-vacuum fa-xl" />,
    title: 'Aspirateur',
   },
   vault: {
    avatar: <i className="fa-light fa-vault fa-xl" />,
    title: 'Coffre-fort',
   },
   babybed: {
    avatar: <i className="fa-light fa-baby fa-xl" />,
    title: 'Lit bébé',
   },
   /* Divertissement */
   television: {
    avatar: <i className="fa-light fa-tv fa-xl" />,
    title: 'Télévision',
   },
   speaker: {
    avatar: <i className="fa-light fa-speaker fa-xl" />,
    title: 'Système audio',
   },
   gameconsole: {
    avatar: <i className="fa-light fa-gamepad-modern fa-xl" />,
    title: 'Console de jeux',
   },
   /* Cuisine et salle à manger */
   oven: {
    avatar: <i className="fa-light fa-oven fa-xl" />,
    title: 'Four',
   },
   microwave: {
    avatar: <i className="fa-light fa-microwave fa-xl" />,
    title: 'Micro-ondes',
   },
   coffeemaker: {
    avatar: <i className="fa-light fa-coffee-pot fa-xl" />,
    title: 'cafétière',
   },
   fridge: {
    avatar: <i className="fa-light fa-refrigerator fa-xl" />,
    title: 'Réfrigérateur',
   },
   fireburner: {
    avatar: <i className="fa-light fa-fire-burner fa-xl" />,
    title: 'Cuisinière',
   },
   /* Chauffage et climatisation */
   heating: {
    avatar: <i className="fa-light fa-temperature-arrow-up fa-xl" />,
    title: 'Chauffage',
   },
   airConditioning: {
    avatar: <i className="fa-light fa-snowflake fa-xl" />,
    title: 'Climatisation',
   },
   fireplace: {
    avatar: <i className="fa-light fa-fireplace fa-xl" />,
    title: 'Cheminée',
   },
   ceilingfan: {
    avatar: <i className="fa-light fa-fan fa-xl" />,
    title: 'Ventilateur de plafond',
   },
   tablefan: {
    avatar: <i className="fa-light fa-fan-table fa-xl" />,
    title: 'Ventilateur de table',
   },
   /* Sécurité à la maison */
   fingerprint: {
    avatar: <i className="fa-light fa-fingerprint fa-xl" />,
    title: 'Serrure biometrique à empreinte digitale',
   },
   lockbox: {
    avatar: <i className="fa-light fa-lock-hashtag fa-xl" />,
    title: 'Boite à serrure',
   },
   parkingaccess: {
    avatar: <i className="fa-light fa-square-parking fa-xl" />,
    title: 'Accès parking',
   },
   /* Internet et bureau  */
   wifi: {
    avatar: <i className="fa-light fa-wifi fa-xl" />,
    title: 'Wifi',
   },
   dedicatedworkspace: {
    avatar: <i className="fa-light fa-chair-office fa-xl" />,
    title: 'Espace dédié de travail',
   },
   /* Parking et installations */
   freeParking: {
    avatar: <i className="fa-light fa-circle-parking fa-xl" />,
    title: 'Parking gratuit',
   },
   paidParking: {
    avatar: <i className="fa-light fa-square-parking fa-xl" />,
    title: 'Stationnement payant',
   },
   pool: {
    avatar: <i className="fa-light fa-water-ladder fa-xl" />,
    title: 'Piscine',
   },
   garbageCan: {
    avatar: <i className="fa-light fa-trash-can fa-xl" />,
    title: 'Benne à ordures',
   },
  },
  houseRules: {
   noNoise: {
    avatar: <i className="fa-light fa-volume-slash fa-xl" />,
    title: 'Pas de bruit après 23h',
   },
   noFoodDrinks: {
    avatar: <i className="fa-light fa-utensils-slash fa-xl" />,
    title: 'Pas de nourriture ni de boissons dans les chambres à coucher',
   },
   noParties: {
    avatar: <i className="fa-light fa-champagne-glasses fa-xl" />,
    title: "Pas de fêtes ni d'événements",
   },
   noSmoking: {
    avatar: <i className="fa-light fa-ban-smoking fa-xl" />,
    title: 'Défense de fumer',
   },
   noPets: {
    avatar: <i className="fa-light fa-paw-simple fa-xl" />,
    title: "Pas d'animaux de compagnie",
   },
   noUnmarriedCouple: {
    avatar: <i className="fa-light fa-ban fa-xl" />,
    title: 'Pas de couple non marié',
   },
   additionalRules: {
    avatar: (
     <i
      onClick={showARulesModal}
      style={{ color: '#aa7e42', cursor: 'pointer' }}
      className="fa-light fa-circle-info fa-xl"
     />
    ),
    title: (
     <span
      style={{ color: '#aa7e42', cursor: 'pointer' }}
      onClick={showARulesModal}
     >
      Règles supplémentaires
     </span>
    ),
   },
  },
 };
 return details[type]?.[item] || { avatar: null, title: '' };
};

const PropertyDetails = () => {
 const location = useLocation();
 const { id } = queryString.parse(location.search);
 const navigate = useNavigate();
 const { property, loading } = useGetProperty(id);
 const { deleteProperty, deletesuccess, deleteloading, deleteerror } =
  useDeleteProperty();
 const { user } = useAuthContext();
 const storedUser = user || JSON.parse(localStorage.getItem('user'));
 const { userData, getUserDataById, isLoading } = useUserData();
 const { getAllAmenities, getOneAmenity } = useAmenity();
 const [amenities, setAmenities] = useState([]);
 const [selectedAmenityDetails, setSelectedAmenityDetails] = useState(null);
 const [isModalVisible, setIsModalVisible] = useState(false);
 const [isAmenitiesModalVisible, setIsAmenitiesModalVisible] = useState(false);
 const [isARulesModalOpen, setIsARulesModalOpen] = useState(false);
 const [isOwner, setIsOwner] = useState(false);

 const confirmDelete = async () => {
  await deleteProperty(id);
  if (!deleteerror) {
   message.success('Propriété supprimée avec succès.');
   navigate(`/dashboard`);
  } else {
   message.error(
    `Erreur lors de la suppression de la propriété: ${deleteerror.message}`
   );
  }
 };

 const cancelDelete = () => {
  message.error('Opération de suppression annulée.');
 };

 const actionsItems = [
  {
   key: '1',
   label: (
    <a href={`/digitalguidebook?id=${id}`}>
     <i className="fa-light fa-house-lock" /> Accéder au guidebook digital
    </a>
   ),
  },
  {
   key: '2',
   label: (
    <Popconfirm
     title="Supprimer la propriété"
     description="Etes-vous sûr de vouloir supprimer cette propriété ?"
     onConfirm={confirmDelete}
     onCancel={cancelDelete}
     okText="Oui"
     cancelText="Non"
    >
     <a>
      <i className="fa-light fa-trash-can" /> Supprimer
     </a>
    </Popconfirm>
   ),
  },
 ];

 const showARulesModal = () => {
  setIsARulesModalOpen(true);
 };
 const handleARulesCancel = () => {
  setIsARulesModalOpen(false);
 };

 useEffect(() => {
  if (property.propertyManagerId) {
   getUserDataById(property.propertyManagerId);
  }
 }, [property.propertyManagerId]);

 useEffect(() => {
  if (storedUser && userData) {
   if (String(storedUser.email) === String(userData.email)) {
    setIsOwner(true);
   }
  }
 }, [storedUser, userData]);

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

 const showAmenitiesModal = () => {
  setIsAmenitiesModalVisible(true);
 };

 // Hide modal handler
 const handleAmenitiesOk = () => {
  setIsAmenitiesModalVisible(false);
 };

 const handleAmenitiesCancel = () => {
  setIsAmenitiesModalVisible(false);
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
    {!isLoading && (
     <Card
      className="fixed-bottom-card host-card-mobile"
      style={{ width: '100%', marginTop: 16 }}
      loading={loading}
      actions={[
       userData.phone !== 'N/A' && (
        <Tooltip title={`${userData.phone}`}>
         <a href={`tel:${userData.phone}`} style={{ textDecoration: 'none' }}>
          <i className="Hosticon fa-light fa-mobile" />
         </a>
        </Tooltip>
       ),
       property.airbnbUrl && (
        <Image
         width={32}
         src={airbnb}
         preview={false}
         onClick={() => window.open(property.airbnbUrl, '_blank')}
        />
       ),
       property.bookingUrl && (
        <Image
         width={32}
         src={booking}
         preview={false}
         onClick={() => window.open(property.bookingUrl, '_blank')}
        />
       ),
      ].filter(Boolean)}
     >
      <Meta
       avatar={
        <Avatar
         size={{ xs: 54, md: 56, lg: 56, xl: 56, xxl: 56 }}
         src={userData.avatar}
        />
       }
       title={`${userData.firstname} ${userData.lastname}`}
       description={
        <>
         <i className="fa-light fa-envelope" /> {userData.email}
        </>
       }
      />
     </Card>
    )}
    <div className="mobile-hide">
     <Head />
    </div>
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
         title: (
          <div
           style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
           }}
          >
           <i className="Anchoricon fa-light fa-square-info" />
           <span>Informations</span>
          </div>
         ),
        },
        {
         key: '2',
         href: '#manuelle',
         title: (
          <div
           style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
           }}
          >
           <i className="Anchoricon fa-light fa-wifi" />
           <span>Manuelle de la maison</span>
          </div>
         ),
        },
        {
         key: '3',
         href: '#map&nearbyplaces',
         title: (
          <div
           style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
           }}
          >
           <i className="Anchoricon fa-light fa-map-marker-alt" />
           <span>Lieux à proximité</span>
          </div>
         ),
        },
        {
         key: '4',
         href: '#rules',
         title: (
          <div
           style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
           }}
          >
           <i className="Anchoricon fa-light fa-ban-smoking" />
           <span>Reglement intérieur</span>
          </div>
         ),
        },
       ]}
      />
     </div>
     <Content className="container-poperty-details">
      <Flex gap="middle" align="start" justify="space-between">
       <Button
        type="default"
        shape="round"
        icon={<ArrowLeftOutlined />}
        onClick={goBack}
       >
        Retour
       </Button>
       <div>
        {isOwner && (
         <Dropdown.Button
          menu={{
           items: actionsItems,
          }}
          className="right-button"
         >
          Actions
         </Dropdown.Button>
        )}
        {deletesuccess && <p>Propriété supprimée avec succès.</p>}
        {deleteerror && (
         <p>
          Erreur lors de la suppression de la propriété: {deleteerror.message}
         </p>
        )}
       </div>
      </Flex>
      {!isLoading &&
       (userData.role === 'manager' || userData.role === 'admin') && (
        <FloatButton
         icon={<i className="fa-light fa-location-plus" />}
         tooltip={<div>Ajouter un lieu à proximité</div>}
         type="primary"
         onClick={nearbyPlace}
        />
       )}
      <Row gutter={[16, 4]}>
       <Col xs={24} sm={12} id="desc">
        <div style={{ maxWidth: '100%', margin: '12px 0 0 0' }}>
         <Carousel autoplay effect="fade">
          {Array.isArray(parsedProperty.photos) &&
           parsedProperty.photos.map((photo, index) => (
            <div key={index}>
             <Image src={photo} />
            </div>
           ))}
         </Carousel>
        </div>
        {isOwner && (
         <Button
          icon={<i className="fa-light fa-pen-to-square" />}
          onClick={() => navigate(`/editphotos?id=${id}`)}
          type="link"
          style={{
           position: 'absolute',
           right: 15,
           top: 15,
           fontSize: 16,
           color: '#fdfdfd',
          }}
         />
        )}
       </Col>
       <Col xs={24} sm={12}>
        <Flex gap="middle" align="center" justify="space-between">
         <Title level={1}>{parsedProperty.name}</Title>
         {isOwner && (
          <Button
           icon={<i className="fa-light fa-pen-to-square" />}
           onClick={() => navigate(`/editbasicinfo?id=${id}`)}
           type="link"
           size="Large"
           style={{ fontSize: 16 }}
          />
         )}
        </Flex>
        <Title level={3}>{parsedProperty.price} Dh / Nuit</Title>
        <Flex gap="4px 0" wrap>
         <Tag icon={<i className="tag-icon-style fa-light fa-bed-front" />}>
          {parsedProperty.rooms} Chambres
         </Tag>
         <Tag icon={<i className="tag-icon-style fa-light fa-users" />}>
          {parsedProperty.capacity} Voyageurs
         </Tag>
         <Tag icon={<i className="tag-icon-style fa-light fa-bed" />}>
          {parsedProperty.beds} Lit
         </Tag>
        </Flex>
        <Divider />
        <Paragraph>{parsedProperty.description}</Paragraph>
        <Card
         className="host-card"
         style={{ width: '100%', marginTop: 16 }}
         loading={loading}
         actions={[
          userData.phone !== 'N/A' && (
           <Tooltip title={`${userData.phone}`}>
            <a
             href={`tel:${userData.phone}`}
             style={{ textDecoration: 'none' }}
            >
             <i className="Hosticon fa-light fa-mobile" />
            </a>
           </Tooltip>
          ),
          property.airbnbUrl && (
           <Image
            width={32}
            src={airbnb}
            preview={false}
            onClick={() => window.open(property.airbnbUrl, '_blank')}
           />
          ),
          property.bookingUrl && (
           <Image
            width={32}
            src={booking}
            preview={false}
            onClick={() => window.open(property.bookingUrl, '_blank')}
           />
          ),
         ].filter(Boolean)}
        >
         <Meta
          avatar={
           <Avatar
            size={{ xs: 54, md: 56, lg: 56, xl: 56, xxl: 56 }}
            src={userData.avatar}
           />
          }
          title={`${userData.firstname} ${userData.lastname}`}
          description={
           <>
            <i className="fa-light fa-envelope" /> {userData.email}
           </>
          }
         />
        </Card>
       </Col>

       <Divider id="manuelle" />
       {parsedProperty.basicAmenities && (
        <Col xs={24} sm={24}>
         <Title level={3}>Manuelle de la maison:</Title>
         <br />
         <Row gutter={[16, 0]}>
          {parsedProperty.basicAmenities.slice(0, 6).map((amenity, index) => {
           const { avatar, title } = getAmenityDetails('basic', amenity);
           const amenityExists = hasAmenity(amenity);
           return (
            <Col xs={24} md={8} key={index} style={{ textAlign: 'left' }}>
             <Card
              bordered={false}
              cover={avatar}
              style={{
               display: 'flex',
               alignItems: 'center',
              }}
             >
              <Meta title={title} />
             </Card>
            </Col>
           );
          })}
          <Col xs={24} md={24}>
           <Button
            style={{ marginTop: 24 }}
            type="default"
            size="large"
            onClick={showAmenitiesModal}
           >
            Afficher tous les équipements
           </Button>
          </Col>
         </Row>

         {selectedAmenityDetails && (
          <Modal
           title="Commodité"
           open={isModalVisible}
           onOk={handleOk}
           onCancel={handleCancel}
           footer={
            isOwner && (
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

       <Divider id="rules" />
       {parsedProperty.houseRules && (
        <Col xs={24} sm={24}>
         <Title level={3}>Reglement intérieur:</Title>
         {isOwner && (
          <Button
           icon={<i className="fa-light fa-pen-to-square" />}
           onClick={() => navigate(`/edithouserules?id=${id}`)}
           type="link"
           style={{
            position: 'absolute',
            right: 15,
            top: 15,
            fontSize: 16,
           }}
          />
         )}
         <br />
         <Row gutter={[0, 16]}>
          {parsedProperty.houseRules.map((houseRule, index) => {
           const { avatar, title } = getAmenityDetails(
            'houseRules',
            houseRule,
            showARulesModal
           );
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
      <div style={{ marginBottom: 100 }} />
     </Content>
    </Layout>
    <Foot />
   </Layout>
   <Modal
    title="Règles supplémentaires"
    open={isARulesModalOpen}
    onCancel={handleARulesCancel}
    footer={null}
   >
    <p>
     {(() => {
      const rule = parsedProperty.houseRules.find((rule) =>
       rule.startsWith('additionalRules:')
      );
      return rule
       ? rule.substring(16).trim()
       : 'Aucune règle supplémentaire trouvée';
     })()}
    </p>
   </Modal>

   <Modal
    title="Équipements"
    open={isAmenitiesModalVisible}
    onOk={handleAmenitiesOk}
    onCancel={handleAmenitiesCancel}
    footer={[
     isOwner && (
      <Button
       key="edit"
       type="primary"
       onClick={() => navigate(`/editequipements?id=${id}`)}
       icon={<i className="fa-light fa-pen-to-square" />}
      >
       Modifier les équipements
      </Button>
     ),
     <Button key="back" onClick={handleAmenitiesCancel}>
      OK
     </Button>,
    ]}
   >
    <List
     itemLayout="horizontal"
     dataSource={parsedProperty.basicAmenities}
     renderItem={(amenity) => {
      const { avatar, title } = getAmenityDetails('basic', amenity);
      const amenityExists = hasAmenity(amenity);
      return (
       <List.Item
        actions={[
         <a
          key="list-voir"
          onClick={() =>
           isOwner && (amenityExists ? showModal(amenity) : AddAmenity(amenity))
          }
         >
          {isOwner && (amenityExists ? 'Voir la carte' : 'Ajouter une carte')}
         </a>,
        ]}
       >
        {isOwner ? (
         <List.Item.Meta avatar={avatar} title={title} />
        ) : (
         <List.Item.Meta avatar={avatar} title={title} />
        )}
       </List.Item>
      );
     }}
    />
   </Modal>
  </>
 );
};

export default PropertyDetails;
