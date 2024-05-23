import React, { useState, useEffect } from 'react';
import {
 Spin,
 Layout,
 Row,
 Col,
 Typography,
 Button,
 Collapse,
 Tabs,
 Grid,
 Divider,
 Image,
 Flex,
 Card,
} from 'antd';
import { UnorderedListOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { useLocation } from 'react-router-dom';
import queryString from 'query-string';
import Head from '../../components/common/header';
import Foot from '../../components/common/footer';
import useGetProperty from '../../hooks/useGetProperty';
import useAmenity from '../../hooks/useAmenity';
import MapMarker from './MapMarker';
import ReactPlayer from 'react-player';
import NearbyPlacesCarouselByType from './nearbyplacescarouselbytype';
import MapNearbyPlaces from './MapNearbyPlaces';

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;
const { Panel } = Collapse;
const { TabPane } = Tabs;
const { useBreakpoint } = Grid;
const { Meta } = Card;

const formatTimeFromDatetime = (datetimeString) => {
 const date = new Date(datetimeString);
 const hours = date.getHours();
 const minutes = date.getMinutes().toString().padStart(2, '0');
 return `${hours}:${minutes}`;
};

const getHouseRuleDetails = (rule) => {
 switch (rule) {
  case 'noNoise':
   return {
    icon: <i className="icon-style-dg fa-light fa-volume-slash"></i>,
    title: 'Pas de bruit après 23h',
   };
  case 'noFoodDrinks':
   return {
    icon: <i className="icon-style-dg fa-light fa-utensils-slash"></i>,
    title: 'Pas de nourriture ni de boissons dans les chambres à coucher',
   };
  case 'noParties':
   return {
    icon: <i className="icon-style-dg fa-light fa-champagne-glasses"></i>,
    title: "Pas de fêtes ni d'événements",
   };
  case 'noSmoking':
   return {
    icon: <i className="icon-style-dg fa-light fa-ban-smoking"></i>,
    title: 'Défense de fumer',
   };
  case 'noPets':
   return {
    icon: <i className="icon-style-dg fa-light fa-paw-simple"></i>,
    title: 'Animaux de compagnie autorisés',
   };
  case 'additionalRules':
   return {
    icon: <i className="icon-style-dg fa-light fa-circle-info"></i>,
    title: 'Règles supplémentaires',
   };
  default:
   return { icon: null, title: '' };
 }
};
const getElementsDetails = (element) => {
 switch (element) {
  case 'cameras':
   return {
    icon: <i className="icon-style-dg fa-light fa-camera-cctv"></i>,
    title: 'Caméras de surveillance extérieures',
   };
  case 'sonometers':
   return {
    icon: <i className="icon-style-dg fa-light fa-gauge-low"></i>,
    title: 'Sonomètres',
   };
  default:
   return { icon: null, title: '' };
 }
};
const getSafetyFeaturesDetails = (feature) => {
 switch (feature) {
  case 'smokeDetector':
   return {
    icon: <i className="icon-style-dg fa-light fa-sensor-cloud"></i>,
    title: 'Détecteur de fumée',
   };
  case 'firstAidKit':
   return {
    icon: <i className="icon-style-dg fa-light fa-suitcase-medical"></i>,
    title: 'Kit de premiers secours',
   };
  case 'fireExtinguisher':
   return {
    icon: <i className="icon-style-dg fa-light fa-fire-extinguisher"></i>,
    title: 'Extincteur',
   };
  case 'carbonMonoxideDetector':
   return {
    icon: <i className="icon-style-dg fa-light fa-sensor"></i>,
    title: 'Détecteur de monoxyde de carbone',
   };
  default:
   return { icon: null, title: '' };
 }
};
const getAdditionalRules = (houseRules) => {
 const additionalRuleEntry = houseRules.find((rule) =>
  rule.startsWith('additionalRules:')
 );
 if (additionalRuleEntry) {
  return additionalRuleEntry.split('additionalRules: ')[1];
 }
 return null;
};
const getEarlyCheckInDetails = (earlyCheckIn) => {
 switch (earlyCheckIn) {
  case 'heureNonFlexible':
   return "Malheureusement l'heure d'arrivée n'est pas flexible.";
  case 'ajustementHeure':
   return "À l'occasion il est possible d'ajuster votre heure d'arrivée si vous nous contactez.";
  case 'autreHeureArrivee':
   return 'Lorsque que cela est possible, nous pouvons vous arranger en vous proposant une autre heure d’arrivée qui vous conviendrait mieux. Contactez nous à l’avance si vous souhaitez modifier votre heure d’arrivée.';
  case 'laissezBagages':
   return 'Vous pouvez laissez vos bagages pendant la journée.';
  default:
   return '';
 }
};
const getAccessToPropertyDetails = (accessToProperty) => {
 switch (accessToProperty) {
  case 'acceuilContactezMoi':
   return 'La clé de la maison se trouve dans la boîte à clé';
  case 'cleDansBoite':
   return 'On sera là pour vous accueillir, sinon, contactez moi quand vous arrivez.';
  case 'codesAccesCourriel':
   return 'Nous vous enverrons vos codes d’accès par courriel avant votre arrivée.';
  case 'verifiezCourriel':
   return 'Vérifiez votre courriel pour les instructions relatives à votre arrivée.';
  case 'serrureNumero':
   return 'Nous avons une serrure à numéro.';
  default:
   return '';
 }
};
const getLateCheckOutPolicyDetails = (lateCheckOutPolicy) => {
 switch (lateCheckOutPolicy) {
  case 'heureNonFlexible':
   return 'Malheureusement l’heure de départ n’est pas flexible.';
  case 'heureDepartAlternative':
   return 'Lorsque l’horaire le permet, il nous fait plaisir d’accommoder une heure de départ alternative. Contactez-nous à l’avance si vous souhaitez prendre un arrangement à cet effet.';
  case 'codesAccesCourriel':
   return 'Nous vous enverrons vos codes d’accès par courriel avant votre arrivée.';
  case 'contactezNous':
   return 'Communiquez avec nous si vous aimeriez quitter plus tard.';
  case 'optionDepartTardif':
   return 'Montrer l’option du départ tardif (si ce n’est pas coché on ne va pas le mentionner)';
  default:
   return '';
 }
};
const getBeforeCheckOutDetails = (beforeCheckOut) => {
 switch (beforeCheckOut) {
  case 'vaisselleLaveVaisselle':
   return 'Mettez la vaisselle de dernière minute dans le lave-vaisselle.';
  case 'eteindreAppareilsElectriques':
   return 'Merci de vous assurer que vous avez bien éteint la cuisinière, lumières et autres appareils électriques.';
  case 'porteNonVerrouillee':
   return 'Assurez-vous que les portes sont verrouillées.';
  case 'laissezBagages':
   return 'Vous pouvez laissez vos bagages dans la propriété après l’heure du départ.';
  case 'signezLivreOr':
   return 'S’il vous plait, signez notre livre d’or avant de partir.';
  case 'litsNonFaits':
   return 'Laissez les lits que vous avez utilisés défaits.';
  case 'laverVaisselle':
   return 'Merci de laver et ranger vaisselle et plats utilisés.';
  case 'replacezMeubles':
   return 'Replacez les meubles à leur endroit original.';
  case 'deposePoubelles':
   return 'Merci de déposer poubelles et déchets dans les containers appropriés.';
  case 'serviettesDansBaignoire':
   return 'Mettez vos serviettes utilisées dans la baignoire.';
  case 'serviettesParTerre':
   return 'Laissez les serviettes utilisées par terre.';
  case 'portesVerrouillees':
   return 'Laissez la porte déverrouillée.';
  case 'laissezCleMaison':
   return ' Laissez la clé dans la maison.';
  case 'laissezCleBoiteCle':
   return 'Laissez la clé dans la boîte à clef.';
  default:
   return '';
 }
};

const DigitalGuidebook = () => {
 const screens = useBreakpoint();
 const location = useLocation();
 const { id } = queryString.parse(location.search);
 const { property, loading } = useGetProperty(id);
 const { getAllAmenities } = useAmenity();
 const [amenities, setAmenities] = useState([]);
 const [wifiAmenity, setWifiAmenity] = useState(null);
 const [parkingAmenity, setParkingAmenity] = useState(null);
 const [tvAmenity, setTvAmenity] = useState(null);
 const [kitchenAmenity, setKitchenAmenity] = useState(null);
 const [rows, setRows] = useState(4);
 const [airConditioningAmenity, setAirConditioningAmenity] = useState(null);
 const [washingMachineAmenity, setWashingMachineAmenity] = useState(null);
 const [dedicatedWorkspaceAmenity, setDedicatedWorkspaceAmenity] =
  useState(null);

 useEffect(() => {
  const fetchData = async (ID) => {
   const data = await getAllAmenities(ID);
   if (data) {
    setAmenities(data);
    const wifiAmenity = data.find((amenity) => amenity.name === 'wifi');
    setWifiAmenity(wifiAmenity);
    const parkingAmenity = data.find(
     (amenity) => amenity.name === 'freeParking'
    );
    setParkingAmenity(parkingAmenity);
    const tvAmenity = data.find((amenity) => amenity.name === 'television');
    setTvAmenity(tvAmenity);
    const kitchenAmenity = data.find((amenity) => amenity.name === 'kitchen');
    setKitchenAmenity(kitchenAmenity);
    const airConditioningAmenity = data.find(
     (amenity) => amenity.name === 'airConditioning'
    );
    setAirConditioningAmenity(airConditioningAmenity);
    const washingMachineAmenity = data.find(
     (amenity) => amenity.name === 'washingMachine'
    );
    setWashingMachineAmenity(washingMachineAmenity);
    const dedicatedWorkspaceAmenity = data.find(
     (amenity) => amenity.name === 'dedicatedWorkspace'
    );
    setDedicatedWorkspaceAmenity(dedicatedWorkspaceAmenity);
   }
  };
  if (id) {
   fetchData(id);
  }
 }, [id, loading]);

 const additionalRules =
  property && property.houseRules
   ? getAdditionalRules(property.houseRules)
   : null;
 const earlyCheckInParagraphs =
  property && property.earlyCheckIn
   ? property.earlyCheckIn.map(getEarlyCheckInDetails)
   : [];
 const accessToPropertyParagraphs =
  property && property.accessToProperty
   ? property.accessToProperty.map(getAccessToPropertyDetails)
   : [];
 const lateCheckOutPolicyParagraphs =
  property && property.lateCheckOutPolicy
   ? property.lateCheckOutPolicy.map(getLateCheckOutPolicyDetails)
   : [];
 const beforeCheckOutParagraphs =
  property && property.beforeCheckOut
   ? property.beforeCheckOut.map(getBeforeCheckOutDetails)
   : [];

 const innerTabs = [
  {
   key: '1',
   icon: <i className="fa-light fa-key"></i>,
   tab: 'Arrivée',
   content: (
    <div>
     {earlyCheckInParagraphs.length > 0 && (
      <div>
       <Divider>
        <i className="fa-light fa-key"></i>
        <Text strong> Arrivée</Text>
       </Divider>
       {earlyCheckInParagraphs.map((paragraph, index) => (
        <Paragraph key={index}>{paragraph}</Paragraph>
       ))}
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
     {wifiAmenity && (
      <>
       <Divider>
        <i className="fa-light fa-wifi"></i>
        <Text strong> Accès Wi-Fi</Text>
       </Divider>
       <Row gutter={[16, 16]}>
        <Col xs={24} md={6}>
         <Image src={wifiAmenity.media} />
        </Col>
        <Col xs={24} md={18}>
         <br />
         <Paragraph>
          <Text strong>Nom Wi-Fi: </Text>
          {wifiAmenity.wifiName}
         </Paragraph>
         <Paragraph>
          <Text strong>Mot de passe Wi-Fi: </Text>
          <Text copyable>{wifiAmenity.wifiPassword}</Text>
         </Paragraph>
         <Paragraph>{wifiAmenity.description}</Paragraph>
        </Col>
       </Row>
      </>
     )}

     <Divider>
      <i className="fa-light fa-map-location-dot"></i>
      <Text strong> Arriver ici</Text>
     </Divider>
     <Row gutter={[16, 16]}>
      <Col xs={24} md={16}>
       <MapMarker latitude={property.latitude} longitude={property.longitude} />
      </Col>
      <Col xs={24} md={8}>
       {parkingAmenity && (
        <>
         <Image width={'100%'} src={parkingAmenity.media} />
         <br />
         <Paragraph>{parkingAmenity.description}</Paragraph>
        </>
       )}
      </Col>
     </Row>
    </div>
   ),
  },
  {
   key: '2',
   icon: <i className="fa-light fa-door-open"></i>,
   tab: 'Manuel de la maison',
   content: (
    <Row gutter={[16, 16]}>
     {wifiAmenity && (
      <Col xs={24} md={6}>
       <Divider>
        <i className="fa-light fa-wifi"></i>
        <Text strong> Accès Wi-Fi</Text>
       </Divider>
       <Card
        hoverable={false}
        style={{
         width: '100%',
        }}
        cover={
         ReactPlayer.canPlay(wifiAmenity.media) ? (
          <ReactPlayer
           url={wifiAmenity.media}
           controls
           width={'100%'}
           height={240}
          />
         ) : (
          <Image src={wifiAmenity.media} />
         )
        }
       >
        <Meta
         title={
          <>
           <Paragraph>
            <Text strong>Nom Wi-Fi: </Text>
            {wifiAmenity.wifiName}
           </Paragraph>
           <Paragraph>
            <Text strong>Mot de passe Wi-Fi: </Text>
            <Text copyable>{wifiAmenity.wifiPassword}</Text>
           </Paragraph>
          </>
         }
         description={wifiAmenity.description}
        />
       </Card>
      </Col>
     )}

     {tvAmenity && (
      <Col xs={24} md={10}>
       <Divider>
        <i className="fa-light fa-tv"></i>
        <Text strong> Télévision</Text>
       </Divider>
       <Card
        hoverable={false}
        style={{
         width: '100%',
        }}
        cover={
         ReactPlayer.canPlay(tvAmenity.media) ? (
          <ReactPlayer
           url={tvAmenity.media}
           controls
           width={'100%'}
           height={300}
          />
         ) : (
          <Image src={tvAmenity.media} />
         )
        }
       >
        <Meta title="Télévision" description={tvAmenity.description} />
       </Card>
      </Col>
     )}

     {kitchenAmenity && (
      <Col xs={24} md={8}>
       <Divider>
        <i className="fa-light fa-microwave"></i>
        <Text strong> Cuisine</Text>
       </Divider>
       <Card
        hoverable={false}
        style={{
         width: '100%',
        }}
        cover={
         ReactPlayer.canPlay(kitchenAmenity.media) ? (
          <ReactPlayer
           url={kitchenAmenity.media}
           controls
           width={'100%'}
           height={240}
          />
         ) : (
          <Image src={kitchenAmenity.media} />
         )
        }
       >
        <Meta
         title="Cuisine"
         description={
          <Paragraph
           ellipsis={{
            rows,
            expandable: true,
            symbol: 'lire plus',
           }}
          >
           {kitchenAmenity.description}
          </Paragraph>
         }
        />
       </Card>
      </Col>
     )}

     {airConditioningAmenity && (
      <Col xs={24} md={8}>
       <Divider>
        <i className="fa-light fa-snowflake"></i>
        <Text strong> Climatisation</Text>
       </Divider>
       <Card
        hoverable={false}
        style={{
         width: '100%',
        }}
        cover={
         ReactPlayer.canPlay(airConditioningAmenity.media) ? (
          <ReactPlayer
           url={airConditioningAmenity.media}
           controls
           width={'100%'}
           height={240}
          />
         ) : (
          <Image src={airConditioningAmenity.media} />
         )
        }
       >
        <Meta
         title="Climatisation"
         description={
          <Paragraph
           ellipsis={{
            rows,
            expandable: true,
            symbol: 'lire plus',
           }}
          >
           {airConditioningAmenity.description}
          </Paragraph>
         }
        />
       </Card>
      </Col>
     )}

     {washingMachineAmenity && (
      <Col xs={24} md={8}>
       <Divider>
        <i className="fa-light fa-washing-machine"></i>
        <Text strong> Machine à laver</Text>
       </Divider>
       <Card
        hoverable={false}
        style={{
         width: '100%',
        }}
        cover={
         ReactPlayer.canPlay(washingMachineAmenity.media) ? (
          <ReactPlayer
           url={washingMachineAmenity.media}
           controls
           width={'100%'}
           height={240}
          />
         ) : (
          <Image src={washingMachineAmenity.media} />
         )
        }
       >
        <Meta
         title="Climatisation"
         description={
          <Paragraph
           ellipsis={{
            rows,
            expandable: true,
            symbol: 'lire plus',
           }}
          >
           {washingMachineAmenity.description}
          </Paragraph>
         }
        />
       </Card>
      </Col>
     )}

     {dedicatedWorkspaceAmenity && (
      <Col xs={24} md={8}>
       <Divider>
        <i className="fa-light fa-laptop"></i>
        <Text strong> Espace de travail</Text>
       </Divider>
       <Card
        hoverable={false}
        style={{
         width: '100%',
        }}
        cover={
         ReactPlayer.canPlay(dedicatedWorkspaceAmenity.media) ? (
          <ReactPlayer
           url={dedicatedWorkspaceAmenity.media}
           controls
           width={'100%'}
           height={240}
          />
         ) : (
          <Image src={dedicatedWorkspaceAmenity.media} />
         )
        }
       >
        <Meta
         title="Climatisation"
         description={
          <Paragraph
           ellipsis={{
            rows,
            expandable: true,
            symbol: 'lire plus',
           }}
          >
           {dedicatedWorkspaceAmenity.description}
          </Paragraph>
         }
        />
       </Card>
      </Col>
     )}

     {property.houseRules && (
      <Col xs={24} md={12}>
       <Divider>
        <i className="fa-light fa-ban"></i>
        <Text strong> Règles de la maison</Text>
       </Divider>
       <Flex gap="middle" vertical>
        {property.houseRules.map((rule, index) => {
         const { icon, title } = getHouseRuleDetails(rule);
         return (
          <Col key={index} xs={24}>
           {icon}
           <Text> {title}</Text>
          </Col>
         );
        })}
        {additionalRules && (
         <Col xs={24}>
          <Text strong>Règles supplémentaire : </Text>
          <Text>{additionalRules}</Text>
         </Col>
        )}
       </Flex>
      </Col>
     )}
     <Col xs={24} md={12}>
      {property.elements && (
       <Col xs={24}>
        <Divider>
         <i className="fa-light fa-bell-plus"></i>
         <Text strong> Équipement supplémentaire</Text>
        </Divider>
        <Flex gap="middle" vertical>
         {property.elements.map((element, index) => {
          const { icon, title } = getElementsDetails(element);
          return (
           <Col key={index} xs={24}>
            {icon}
            <Text> {title}</Text>
           </Col>
          );
         })}
        </Flex>
       </Col>
      )}
      {property.safetyFeatures && (
       <Col xs={24}>
        <Divider>
         <i className="fa-light fa-shield-check"></i>
         <Text strong> Équipement de sécurité</Text>
        </Divider>
        <Flex gap="middle" vertical>
         {property.safetyFeatures.map((feature, index) => {
          const { icon, title } = getSafetyFeaturesDetails(feature);
          return (
           <Col key={index} xs={24}>
            {icon}
            <Text> {title}</Text>
           </Col>
          );
         })}
        </Flex>
       </Col>
      )}
     </Col>
    </Row>
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
       <Divider>
        <i className="fa-light fa-lock-keyhole"></i>
        <Text strong> Departure</Text>
       </Divider>
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
   icon: <i className="fa-light fa-utensils"></i>,
   tab: 'Endroits où manger',
   content: (
    <div>
     <MapNearbyPlaces
      latitude={property.latitude}
      longitude={property.longitude}
      type="food"
     />
     <Divider />
     <NearbyPlacesCarouselByType
      latitude={property.latitude}
      longitude={property.longitude}
      type="food"
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
      type="point_of_interest"
     />
     <Divider />
     <NearbyPlacesCarouselByType
      latitude={property.latitude}
      longitude={property.longitude}
      type="point_of_interest"
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
      type="natural_feature"
     />
     <Divider />
     <NearbyPlacesCarouselByType
      latitude={property.latitude}
      longitude={property.longitude}
      type="natural_feature"
     />
    </div>
   ),
  },
  {
   key: '7',
   icon: <i className="fa-light fa-grid-2"></i>,
   tab: 'Tous',
   content: (
    <div>
     <MapNearbyPlaces
      latitude={property.latitude}
      longitude={property.longitude}
     />
     <Divider />
     <NearbyPlacesCarouselByType
      latitude={property.latitude}
      longitude={property.longitude}
     />
    </div>
   ),
  },
  {
   key: '8',
   icon: <i className="fa-light fa-print"></i>,
   tab: 'Imprimer',
   content: <div>{/* Content for "Départ" */}</div>,
  },
 ];

 const outerTabs = [
  {
   key: '1',
   icon: <UnorderedListOutlined />,
   tab: 'List',
   content: (
    <Col xs={24} md={24}>
     <Tabs
      tabPosition={screens.md ? 'left' : 'top'}
      items={innerTabs.map((tab) => ({
       label: tab.tab,
       icon: tab.icon,
       key: tab.key,
       children: tab.content,
      }))}
     />
    </Col>
   ),
  },
  {
   key: '2',
   icon: <EnvironmentOutlined />,
   tab: 'Map',
   content: (
    <Col xd={24} md={24}>
     <p>Map</p>
    </Col>
   ),
  },
 ];

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
     <Row gutter={[0, 16]}>
      <Tabs
       defaultActiveKey="1"
       centered
       tabPosition="bottom"
       className="bottom-tabs"
       size="large"
       tabBarStyle={{
        width: '100%',
        backgroundColor: '#fbfbfb', // Grey background
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontWeight: 600,
       }}
       tabBarGutter={96}
       items={outerTabs.map((tab) => ({
        label: tab.tab,
        icon: tab.icon,
        key: tab.key,
        children: tab.content,
       }))}
      />
     </Row>
    </Content>
   </Layout>
   <Foot />
  </Layout>
 );
};

export default DigitalGuidebook;
