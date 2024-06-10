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
 Card,
} from 'antd';
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

const { Content } = Layout;
const { Text, Paragraph } = Typography;
const { useBreakpoint } = Grid;
const { Meta } = Card;

const DigitalGuidebook = () => {
 const screens = useBreakpoint();
 const location = useLocation();
 const { id } = queryString.parse(location.search);
 const { property, loading } = useGetProperty(id);
 const { getAllAmenities } = useAmenity();
 const [amenities, setAmenities] = useState([]);
 const rows = 4;

 useEffect(() => {
  const fetchData = async (ID) => {
   const data = await getAllAmenities(ID);
   if (data) {
    setAmenities(data);
   }
  };
  if (id) {
   fetchData(id);
  }
 }, [id, loading]);

 const wifiAmenity = useMemo(
  () => amenities?.find((amenity) => amenity.name === 'wifi'),
  [amenities]
 );
 const parkingAmenity = useMemo(
  () => amenities?.find((amenity) => amenity.name === 'freeParking'),
  [amenities]
 );
 const tvAmenity = useMemo(
  () => amenities?.find((amenity) => amenity.name === 'television'),
  [amenities]
 );
 const kitchenAmenity = useMemo(
  () => amenities?.find((amenity) => amenity.name === 'kitchen'),
  [amenities]
 );
 const airConditioningAmenity = useMemo(
  () => amenities?.find((amenity) => amenity.name === 'airConditioning'),
  [amenities]
 );
 const washingMachineAmenity = useMemo(
  () => amenities?.find((amenity) => amenity.name === 'washingMachine'),
  [amenities]
 );
 const poolAmenity = useMemo(
  () => amenities?.find((amenity) => amenity.name === 'pool'),
  [amenities]
 );

 const additionalRules = getAdditionalRules(property?.houseRules);
 const earlyCheckInParagraphs = useMemo(
  () =>
   Array.isArray(property?.earlyCheckIn)
    ? property.earlyCheckIn.map(getEarlyCheckInDetails)
    : [],
  [property]
 );
 const accessToPropertyParagraphs = useMemo(
  () =>
   Array.isArray(property?.accessToProperty)
    ? property.accessToProperty.map(getAccessToPropertyDetails)
    : [],
  [property]
 );
 const lateCheckOutPolicyParagraphs = useMemo(
  () =>
   Array.isArray(property?.lateCheckOutPolicy)
    ? property.lateCheckOutPolicy.map(getLateCheckOutPolicyDetails)
    : [],
  [property]
 );
 const beforeCheckOutParagraphs = useMemo(
  () =>
   Array.isArray(property?.beforeCheckOut)
    ? property.beforeCheckOut.map(getBeforeCheckOutDetails)
    : [],
  [property]
 );

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
       <Paragraph>
        L'heure d'enregistrement s'effectue à tout moment après{' '}
        {formatTimeFromDatetime(property.checkInTime)}
       </Paragraph>
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
      <Col xs={24} md={8}>
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
      <Col xs={24} md={8}>
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
         title="Machine à laver"
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

     {poolAmenity && (
      <Col xs={24} md={8}>
       <Divider>
        <i className="fa-light fa-water-ladder"></i>
        <Text strong> Piscine</Text>
       </Divider>
       <Card
        hoverable={false}
        style={{
         width: '100%',
        }}
        cover={
         ReactPlayer.canPlay(poolAmenity.media) ? (
          <ReactPlayer
           url={poolAmenity.media}
           controls
           width={'100%'}
           height={240}
          />
         ) : (
          <Image src={poolAmenity.media} />
         )
        }
       >
        <Meta
         title="Piscine"
         description={
          <Paragraph
           ellipsis={{
            rows,
            expandable: true,
            symbol: 'lire plus',
           }}
          >
           {poolAmenity.description}
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
        <Text strong> Départ</Text>
       </Divider>
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
   icon: <i className="fa-light fa-print"></i>,
   tab: 'Imprimer',
   content: <Print property={property} amenities={amenities} />,
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
         children: tab.content,
        }))}
       />
      </Col>
     </Row>
    </Content>
   </Layout>
   <Foot />
  </Layout>
 );
};

export default DigitalGuidebook;
