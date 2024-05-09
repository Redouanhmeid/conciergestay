import React from 'react';
import {
 Anchor,
 Layout,
 Typography,
 List,
 Spin,
 Image,
 Rate,
 Divider,
 Space,
 Tag,
 Carousel,
 Row,
 Col,
 FloatButton,
 Button,
} from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import Head from '../../components/common/header';
import Foot from '../../components/common/footer';
import { useNavigate, useLocation } from 'react-router-dom';
import MapMarker1 from './MapMarker1';
import NearbyPlacesCarousel from './nearbyplacescarousel';
import { Helmet } from 'react-helmet';
import useGetProperty from '../../hooks/useGetProperty';

const { Title, Text, Paragraph } = Typography;
const { Content } = Layout;
const getbasicAmenityDetails = (item) => {
 switch (item) {
  case 'wifi':
   return {
    avatar: <i className="icon-style fa-light fa-wifi"></i>,
    title: 'Wifi',
    description:
     "Profitez d'un accès Internet haut débit pendant votre séjour.",
   };
  case 'television':
   return {
    avatar: <i className="icon-style fa-light fa-tv"></i>,
    title: 'Télévision',
    description:
     'Détendez-vous et regardez vos émissions préférées sur une télévision grand écran.',
   };
  case 'kitchen':
   return {
    avatar: <i className="icon-style fa-light fa-microwave"></i>,
    title: 'Cuisine',
    description:
     'Préparez vos repas à votre convenance dans une cuisine entièrement équipée',
   };
  case 'washingMachine':
   return {
    avatar: <i className="icon-style fa-light fa-washing-machine"></i>,
    title: 'Machine à laver',
    description: 'Faites votre lessive facilement pendant votre séjour.',
   };
  case 'freeParking':
   return {
    avatar: <i className="icon-style fa-light fa-square-parking"></i>,
    title: 'Parking gratuit',
    description: "Profitez d'un parking gratuit pour votre véhicule.",
   };
  case 'airConditioning':
   return {
    avatar: <i className="icon-style fa-light fa-snowflake"></i>,
    title: 'Climatisation',
    description:
     'Restez au frais grâce à la climatisation disponible dans la propriété.',
   };
  case 'dedicatedWorkspace':
   return {
    avatar: <i className="icon-style fa-light fa-laptop"></i>,
    title: 'Espace de travail dédié',
    description:
     'Travaillez confortablement avec un espace de travail dédié dans la propriété.',
   };
  default:
   return {
    avatar: null,
    title: '',
    description: '',
   };
 }
};
const getuncommonAmenityDetails = (item) => {
 switch (item) {
  case 'pool':
   return {
    avatar: <i className="icon-style fa-light fa-water-ladder"></i>,
    title: 'Piscine',
    description:
     "Profitez d'une piscine pour vous détendre et vous rafraîchir.",
   };
  case 'jacuzzi':
   return {
    avatar: <i className="icon-style fa-light fa-hot-tub-person"></i>,
    title: 'Jacuzzi',
    description: 'Détendez-vous dans un jacuzzi pour une expérience apaisante.',
   };
  case 'patio':
   return {
    avatar: <i className="icon-style fa-light fa-couch"></i>,
    title: 'Patio',
    description:
     "Profitez d'un espace extérieur pour vous détendre et profiter de l'air frais.",
   };
  case 'barbecue':
   return {
    avatar: <i className="icon-style fa-light fa-grill-hot"></i>,
    title: 'Barbecue',
    description:
     'Organisez des grillades en plein air avec un barbecue à disposition.',
   };
  case 'outdoorDining':
   return {
    avatar: <i className="icon-style fa-light fa-plate-utensils"></i>,
    title: 'Salle à manger extérieure',
    description: "Dînez en plein air dans un espace dédié à l'extérieur.",
   };
  case 'firePit':
   return {
    avatar: <i className="icon-style fa-light fa-fire"></i>,
    title: 'Foyer extérieur',
    description: "Rassemblez-vous autour d'un feu de camp en plein air.",
   };
  case 'billiards':
   return {
    avatar: <i className="icon-style fa-light fa-pool-8-ball"></i>,
    title: 'Billard',
    description:
     'Amusez-vous avec une partie de billard entre amis ou en famille.',
   };
  case 'piano':
   return {
    avatar: <i className="icon-style fa-light fa-piano-keyboard"></i>,
    title: 'Piano',
    description: 'Jouez de la musique ou détendez-vous en écoutant du piano.',
   };
  case 'fireplace':
   return {
    avatar: <i className="icon-style fa-light fa-fireplace"></i>,
    title: 'Cheminée',
    description: "Réchauffez-vous près d'une cheminée confortable.",
   };
  case 'fitnessEquipment':
   return {
    avatar: <i className="icon-style fa-light fa-dumbbell"></i>,
    title: 'Équipement de fitness',
    description:
     'Maintenez votre routine de fitness avec un équipement adapté.',
   };
  case 'lakeAccess':
   return {
    avatar: <i className="icon-style fa-light fa-water"></i>,
    title: 'Accès au lac',
    description: "Profitez de l'accès à un lac pour des activités nautiques.",
   };
  case 'beachAccess':
   return {
    avatar: <i className="icon-style fa-light fa-umbrella-beach"></i>,
    title: 'Accès à la plage',
    description:
     "Profitez de l'accès à une plage pour vous détendre au bord de l'eau.",
   };
  case 'skiAccess':
   return {
    avatar: <i className="icon-style fa-light fa-person-skiing"></i>,
    title: 'Accès aux pistes de ski',
    description:
     "Profitez de l'accès aux pistes de ski pour des vacances hivernales.",
   };
  case 'outdoorShower':
   return {
    avatar: <i className="icon-style fa-light fa-shower"></i>,
    title: 'Douche extérieure',
    description:
     'Rafraîchissez-vous avec une douche en plein air après une journée ensoleillée.',
   };
  default:
   return {
    avatar: null,
    title: '',
    description: '',
   };
 }
};

const getSecurityEquipment = (item) => {
 switch (item) {
  case 'smokeDetector':
   return {
    avatar: <i className="icon-style fa-light fa-sensor-cloud"></i>,
    title: 'Détecteur de fumée',
    description:
     "Équipement de sécurité essentiel pour détecter la fumée en cas d'incendie.",
   };
  case 'firstAidKit':
   return {
    avatar: <i className="icon-style fa-light fa-suitcase-medical"></i>,
    title: 'Kit de premiers secours',
    description:
     "Équipement médical de base pour les premiers secours en cas d'urgence.",
   };
  case 'fireExtinguisher':
   return {
    avatar: <i className="icon-style fa-light fa-fire-extinguisher"></i>,
    title: 'Extincteur',
    description:
     "Équipement de lutte contre l'incendie pour éteindre les petits incendies.",
   };
  case 'carbonMonoxideDetector':
   return {
    avatar: <i className="icon-style fa-light fa-sensor"></i>,
    title: 'Détecteur de monoxyde de carbone',
    description:
     'Équipement de sécurité pour détecter le monoxyde de carbone, un gaz incolore et inodore.',
   };
  default:
   return {
    avatar: null,
    title: '',
    description: '',
   };
 }
};
const getElements = (item) => {
 switch (item) {
  case 'cameras':
   return {
    avatar: <i className="icon-style fa-light fa-camera-cctv"></i>,
    title: 'Caméras de surveillance extérieures',
    description:
     'Sécurité renforcée avec des caméras de surveillance extérieures 24h/24.',
   };
  case 'sonometers':
   return {
    avatar: <i className="icon-style fa-light fa-gauge-low"></i>,
    title: 'Sonomètres',
    description:
     'Surveillez les niveaux sonores pour maintenir un environnement serein pour tous les clients.',
   };
  case 'weapons':
   return {
    avatar: <i className="icon-style fa-light fa-crosshairs"></i>,
    title: 'Armes',
    description:
     "Personnel de sécurité formé et systèmes de détection d'armes pour une sécurité accrue.",
   };
  default:
   return {
    avatar: null,
    title: '',
    description: '',
   };
 }
};
const getHouseRules = (item) => {
 switch (item) {
  case 'noNoise':
   return {
    avatar: <i className="icon-style fa-light fa-volume-slash"></i>,
    title: 'Pas de bruit après 23h',
    description:
     'Respectez le calme des voisins en évitant les bruits excessifs.',
   };
  case 'noFoodDrinks':
   return {
    avatar: <i className="icon-style fa-light fa-utensils-slash"></i>,
    title: 'Pas de nourriture ni de boissons dans les chambres à coucher',
    description:
     "Pour maintenir la propreté, veuillez ne pas apporter de nourriture ou de boissons à l'intérieur des chambres à coucher.",
   };
  case 'noParties':
   return {
    avatar: <i className="icon-style fa-light fa-champagne-glasses"></i>,
    title: "Pas de fêtes ni d'événements",
    description:
     'Pour garantir la tranquillité des autres résidents, les fêtes ne sont pas autorisées.',
   };
  case 'noSmoking':
   return {
    avatar: <i className="icon-style fa-light fa-ban-smoking"></i>,
    title: 'Défense de fumer',
    description:
     "L'intérieur de la propriété est strictement non-fumeur. Merci de respecter cette règle.",
   };
  case 'petsAllowed':
   return {
    avatar: <i className="icon-style fa-light fa-paw-simple"></i>,
    title: "Pas d'animaux de compagnie",
    description:
     'Les animaux de compagnie sont les bienvenus, mais veuillez respecter les règles concernant les animaux domestiques.',
   };
  case 'additionalRules':
   return {
    avatar: <i className="icon-style fa-light fa-circle-info"></i>,
    title: 'Règles supplémentaires',
    description:
     'Veuillez vous référer aux règles supplémentaires fournies pour garantir un séjour agréable pour tous.',
   };
  default:
   return {
    avatar: null,
    title: '',
    description: '',
   };
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
 const navigate = useNavigate();

 const goBack = () => {
  navigate(-1); // This will navigate back to the previous page
 };
 const nearbyPlace = () => {
  navigate('/createnearbyplace');
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
     <Content className="container-fluid">
      <Button
       type="default"
       shape="round"
       icon={<ArrowLeftOutlined />}
       onClick={goBack}
      >
       Retour
      </Button>
      <FloatButton
       icon={<i className="fa-light fa-location-plus"></i>}
       tooltip={<div>Ajouter un lieu à proximité</div>}
       type="primary"
       onClick={nearbyPlace}
      />
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
        <Space wrap>
         <Tag>
          <Text size={18}>{property.rooms} Chambres</Text>
         </Tag>
         <Tag>
          <Text size={18}>{property.capacity} Capacité Personne</Text>
         </Tag>
         <Tag>
          <Text size={18}>{property.beds} Lit</Text>
         </Tag>
        </Space>
        <Divider />
        <Paragraph>{property.description}</Paragraph>
        <Divider />
       </Col>
       {property.basicAmenities && (
        <Col xs={24} sm={12} id="basicamenities">
         <Title level={3}>Commodités de base :</Title>
         <List
          itemLayout="horizontal"
          dataSource={property.basicAmenities}
          renderItem={(item, index) => {
           const { avatar, title, description } = getbasicAmenityDetails(item);
           return (
            <List.Item key={index}>
             <List.Item.Meta
              avatar={avatar}
              title={title}
              description={description}
             />
            </List.Item>
           );
          }}
         />
        </Col>
       )}

       <Col xs={24} sm={24} id="map&nearbyplaces">
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
       <Col xs={24} sm={12} id="equipements">
        <Title level={3}>Équipement hors du commun:</Title>
        <List
         itemLayout="horizontal"
         dataSource={property.uncommonAmenities}
         renderItem={(item, index) => {
          const { avatar, title, description } =
           getuncommonAmenityDetails(item);
          return (
           <List.Item key={index}>
            <List.Item.Meta
             avatar={avatar}
             title={title}
             description={description}
            />
           </List.Item>
          );
         }}
        />
       </Col>
       <Col xs={24} sm={12}>
        {property.safetyFeatures !== null && (
         <div>
          <Title level={3}>Équipement de sécurité:</Title>
          <List
           itemLayout="horizontal"
           dataSource={property.safetyFeatures}
           renderItem={(item, index) => {
            const { avatar, title, description } = getSecurityEquipment(item);
            return (
             <List.Item key={index}>
              <List.Item.Meta
               avatar={avatar}
               title={title}
               description={description}
              />
             </List.Item>
            );
           }}
          />
         </div>
        )}
        {property.elements !== null && (
         <div>
          <br />
          <Title level={3}>Équipement supplémentaire:</Title>
          <List
           itemLayout="horizontal"
           dataSource={property.elements}
           renderItem={(item, index) => {
            const { avatar, title, description } = getElements(item);
            return (
             <List.Item key={index}>
              <List.Item.Meta
               avatar={avatar}
               title={title}
               description={description}
              />
             </List.Item>
            );
           }}
          />
         </div>
        )}
       </Col>
       <Col xs={24} sm={24} id="rules">
        {property.houseRules !== null && (
         <div>
          <br />
          <Title level={3}>Règles de la maison:</Title>
          <List
           itemLayout="horizontal"
           dataSource={property.houseRules}
           renderItem={(item, index) => {
            const { avatar, title, description } = getHouseRules(item);
            return (
             <List.Item key={index}>
              <List.Item.Meta
               avatar={avatar}
               title={title}
               description={description}
              />
             </List.Item>
            );
           }}
          />
         </div>
        )}
       </Col>
      </Row>
     </Content>
    </Layout>
    <Foot />
   </Layout>
  </>
 );
};

export default PropertyDetails;
