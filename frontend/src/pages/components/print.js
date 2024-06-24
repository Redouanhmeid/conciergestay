import React, { useEffect, useState, useMemo, useCallback } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import {
 Layout,
 Row,
 Col,
 Card,
 Typography,
 Flex,
 Image,
 QRCode,
 Divider,
 Avatar,
 Button,
} from 'antd';
import Logo from '../../assets/logo.png';
import ClientConfig from '../../ClientConfig';
import MapConfig from '../../mapconfig';
import { useUserData } from '../../hooks/useUserData';
import MapMarker from '../components/MapMarker';
import {
 formatTimeFromDatetime,
 getAdditionalRules,
 getStaticMapUrl,
 loadImage,
 getVideoThumbnail,
} from '../../utils/utils';
import {
 getHouseRuleDetails,
 getElementsDetails,
 getSafetyFeaturesDetails,
 getEarlyCheckInDetails,
 getAccessToPropertyDetails,
 getLateCheckOutPolicyDetails,
 getBeforeCheckOutDetails,
} from '../../utils/iconMappings';
import ReactPlayer from 'react-player';
import ReactToPrint from 'react-to-print';
import useNearbyPlaces from '../../hooks/useNearbyPlaces';

const { Header, Content, Footer } = Layout;
const { Title, Text, Paragraph } = Typography;
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

const getProxiedImageUrl = (url) => {
 const youtubeThumbnailUrl =
  url.replace(
   'https://www.youtube.com/watch?v=',
   'https://img.youtube.com/vi/'
  ) + '/hqdefault.jpg';
 return `${ClientConfig.URI}/proxy?url=${encodeURIComponent(
  youtubeThumbnailUrl
 )}`;
};

const Print = ({ property, amenities }) => {
 const [isLoaded, setIsLoaded] = useState(false);
 const { userData, getUserDataById } = useUserData();
 const [staticMapUrl, setStaticMapUrl] = useState('');
 const { loading, error, data } = useNearbyPlaces(
  property.latitude,
  property.longitude
 );

 const apiKey = MapConfig.REACT_APP_GOOGLE_MAP_API_KEY;

 useEffect(() => {
  if (property.propertyManagerId) {
   getUserDataById(property.propertyManagerId);
  }
 }, [property.propertyManagerId]);

 useEffect(() => {
  if (property.latitude && property.longitude) {
   const url = getStaticMapUrl(property.latitude, property.longitude, apiKey);
   setStaticMapUrl(url);
  }
  setTimeout(() => {
   setIsLoaded(true);
  }, 1000);
 }, [property.latitude, property.longitude]);

 const preloadThumbnails = async (urls) => {
  const promises = urls.map((url) => loadImage(getVideoThumbnail(url)));
  try {
   await Promise.all(promises);
  } catch (error) {
   console.error('Failed to preload thumbnails:', error);
  }
 };

 const generatePdf = async () => {
  const element = document.getElementById('content');
  const images = Array.from(element.getElementsByTagName('img'));
  const videoElements = Array.from(element.querySelectorAll('video'));
  const videoUrls = Array.from(element.querySelectorAll('video')).map((video) =>
   video.getAttribute('src')
  );

  // Preload images and video thumbnails
  const imagePromises = images.map((img) => loadImage(img.src));
  await preloadThumbnails(videoUrls);

  try {
   await Promise.all(imagePromises);

   const options = {
    scale: 2,
    useCORS: true,
    allowTaint: true,
    logging: true,
    windowWidth: element.scrollWidth,
    windowHeight: element.scrollHeight,
   };

   html2canvas(element, options).then((canvas) => {
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgProps = pdf.getImageProperties(imgData);
    const canvasHeight = (imgProps.height * pdfWidth) / imgProps.width;

    let heightLeft = canvasHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, canvasHeight);
    heightLeft -= pdfHeight;

    while (heightLeft > 0) {
     position = heightLeft - canvasHeight;
     pdf.addPage();
     pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, canvasHeight);
     heightLeft -= pdfHeight;
    }

    pdf.save(`${property.name}.pdf`);
   });
  } catch (error) {
   console.error('Failed to load images:', error);
  }
 };

 return (
  <div>
   <Flex justify="flex-end">
    <Button
     onClick={generatePdf}
     disabled={!isLoaded}
     icon={<i class="fa-light fa-download"></i>}
     type="primary"
    >
     Télécharger PDF
    </Button>
   </Flex>
   <Layout id="content" className="layout">
    <Content
     style={{ padding: window.innerWidth <= 768 ? '0 10px' : '0 50px' }}
    >
     <Welcome
      property={property}
      setIsLoaded={setIsLoaded}
      staticMapUrl={staticMapUrl}
     />
     <GettingHere property={property} amenities={amenities} />
     <CheckIn property={property} />
     <AccessWifi property={property} amenities={amenities} />
     <CheckOut property={property} />
     <HouseManual property={property} amenities={amenities} />
     <RestaurantsCafes nearbyPlaces={data} />
     <Activities nearbyPlaces={data} />
     <Attractions nearbyPlaces={data} />
    </Content>
    <br />
    <Footer style={{ textAlign: 'center' }}>
     {property.name} ©2024 Created by ConciergeStay
    </Footer>
   </Layout>
   <br />
  </div>
 );
};
export default Print;

const Welcome = React.memo(({ property, setIsLoaded, staticMapUrl }) => {
 const { userData, getUserDataById } = useUserData();
 useEffect(() => {
  if (property.propertyManagerId) {
   getUserDataById(property.propertyManagerId);
  }
 }, [property.propertyManagerId]);

 return (
  <Col xs={{ span: 20, offset: 2 }}>
   <Row gutter={[16, 16]}>
    <Col xs={24}>
     <Flex gap="middle" align="center" justify="space-between">
      <Image className="logoStyle" src={Logo} preview={false} width={140} />
      <Image
       className="dgImg"
       src={property.photos[0]}
       preview={false}
       width={300}
       onLoad={() => setIsLoaded(true)}
      />
      <Flex gap="middle" align="start" vertical>
       <QRCode
        errorLevel="H"
        color="#2b2c32"
        size={180}
        iconSize={64}
        value={`${ClientConfig.URL}/propertydetails?id=${property.id}`}
        icon={Logo}
        onLoad={() => setIsLoaded(true)}
       />
       <Text>
        {property.name}
        <br />
        {userData.email}
       </Text>
      </Flex>
     </Flex>
    </Col>
    <Col xs={12}>
     {staticMapUrl && (
      <Image
       src={staticMapUrl}
       preview={false}
       alt="Map"
       style={{
        width: '100%',
        height: 'auto',
        maxHeight: '600px',
        borderRadius: '12px',
        overflow: 'hidden',
       }}
      />
     )}
    </Col>
    <Col
     xs={12}
     style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-end', // Aligns content to the bottom
     }}
    >
     <Divider>
      <Title level={3}>{property.name}</Title>
     </Divider>
     <Title level={4}>Bonjour</Title>
     <Paragraph>{property.description}</Paragraph>
     <Card bordered={false}>
      <Meta
       avatar={<Avatar size={56} src={userData.avatar} />}
       title={`${userData.firstname} ${userData.lastname}`}
       description={
        <>
         <i className="fa-light fa-envelope"></i> {userData.email}
        </>
       }
      />
     </Card>
    </Col>
   </Row>
  </Col>
 );
});

const GettingHere = React.memo(({ property, amenities }) => {
 const parkingAmenity = useMemo(
  () => amenities?.find((amenity) => amenity.name === 'freeParking'),
  [amenities]
 );
 return (
  <Col xs={24} md={{ span: 20, offset: 2 }}>
   <Row gutter={[16, 16]}>
    <Col xs={24}>
     <Divider>
      <Title level={2}>
       <i className="fa-light fa-map-location-dot"></i> Arriver ici
      </Title>
     </Divider>
     <Title level={4}>Adresse</Title>
     <Paragraph>{property.description}</Paragraph>
     <Title level={4}>Parking</Title>
     {parkingAmenity && (
      <Row gutter={[16, 16]}>
       <Col xs={8}>
        {ReactPlayer.canPlay(parkingAmenity.media) ? (
         <Image src={getVideoThumbnail(parkingAmenity.media)} preview={false} />
        ) : (
         <Image src={parkingAmenity.media} preview={false} />
        )}
       </Col>
       <Col xs={16}>
        <Paragraph>{parkingAmenity.description}</Paragraph>
       </Col>
      </Row>
     )}
    </Col>
   </Row>
  </Col>
 );
});

const CheckIn = React.memo(({ property }) => {
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
 return (
  <Col xs={24} md={{ span: 20, offset: 2 }}>
   <Row gutter={[16, 16]}>
    <Col xs={24}>
     <Divider>
      <Title level={2}>
       <i className="fa-light fa-key"></i> Arrivée
      </Title>
     </Divider>
     <Paragraph>
      L'heure d'enregistrement s'effectue à tout moment après{' '}
      {formatTimeFromDatetime(property.checkInTime)}
     </Paragraph>
     {earlyCheckInParagraphs.map((paragraph, index) => (
      <Paragraph key={index}>{paragraph}</Paragraph>
     ))}
     {accessToPropertyParagraphs.length > 0 && (
      <div>
       <Title level={4}>
        <i className="fa-light fa-lock-keyhole-open"></i> Obtenir l'accès
       </Title>
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
    </Col>
   </Row>
  </Col>
 );
});

const AccessWifi = React.memo(({ property, amenities }) => {
 const wifiAmenity = useMemo(
  () => amenities?.find((amenity) => amenity.name === 'wifi'),
  [amenities]
 );
 return (
  <Col xs={24} md={{ span: 20, offset: 2 }}>
   <Row gutter={[16, 16]}>
    <Col xs={24}>
     {wifiAmenity && (
      <div>
       <Divider>
        <Title level={2}>
         <i className="fa-light fa-wifi"></i> Accéder au Wi-Fi
        </Title>
       </Divider>
       <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
         {ReactPlayer.canPlay(wifiAmenity.media) ? (
          <Image src={getVideoThumbnail(wifiAmenity.media)} preview={false} />
         ) : (
          <Image src={wifiAmenity.media} preview={false} />
         )}
        </Col>
        <Col xs={24} md={16}>
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
      </div>
     )}
    </Col>
   </Row>
  </Col>
 );
});

const CheckOut = React.memo(({ property }) => {
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
 return (
  <Col xs={24} md={{ span: 20, offset: 2 }}>
   <Row gutter={[16, 16]}>
    <Col xs={24}>
     {lateCheckOutPolicyParagraphs.length > 0 && (
      <div>
       <Divider>
        <Title level={2}>
         <i className="fa-light fa-lock-keyhole"></i> Départ
        </Title>
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
       <Title level={4}>
        <i className="fa-light fa-house-person-leave"></i> Avant de quitter
       </Title>
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
    </Col>
   </Row>
  </Col>
 );
});

const HouseManual = React.memo(({ property, amenities }) => {
 const rows = 4;
 const wifiAmenity = useMemo(
  () => amenities?.find((amenity) => amenity.name === 'wifi'),
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
 return (
  <Col xs={24} md={{ span: 20, offset: 2 }}>
   <Row gutter={[16, 16]}>
    <Col xs={24}>
     <Divider>
      <Title level={2}>
       <i className="fa-light fa-door-open"></i> Manuel de la maison
      </Title>
     </Divider>
     <Row gutter={[16, 16]}>
      {wifiAmenity && (
       <Col xs={8}>
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
           <Image
            src={getVideoThumbnail(wifiAmenity.media)}
            width={'100%'}
            height={300}
            preview={false}
           />
          ) : (
           <Image src={wifiAmenity.media} preview={false} />
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
       <Col xs={8}>
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
           <Image
            src={getProxiedImageUrl(tvAmenity.media)}
            width={'100%'}
            height={300}
            preview={false}
           />
          ) : (
           <Image src={tvAmenity.media} preview={false} />
          )
         }
        >
         <Meta title="Télévision" description={tvAmenity.description} />
        </Card>
       </Col>
      )}

      {kitchenAmenity && (
       <Col xs={8}>
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
           <Image
            src={getVideoThumbnail(kitchenAmenity.media)}
            width={'100%'}
            height={300}
            preview={false}
           />
          ) : (
           <Image src={kitchenAmenity.media} preview={false} />
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
       <Col xs={8}>
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
           <Image
            src={getVideoThumbnail(airConditioningAmenity.media)}
            width={'100%'}
            height={300}
            preview={false}
           />
          ) : (
           <Image src={airConditioningAmenity.media} preview={false} />
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
       <Col xs={8}>
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
           <Image
            src={getVideoThumbnail(washingMachineAmenity.media)}
            width={'100%'}
            height={300}
            preview={false}
           />
          ) : (
           <Image src={washingMachineAmenity.media} preview={false} />
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
       <Col xs={8}>
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
           <Image
            src={getVideoThumbnail(poolAmenity.media)}
            width={'100%'}
            height={300}
            preview={false}
           />
          ) : (
           <Image src={poolAmenity.media} preview={false} />
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
       <Col xs={12}>
        <Divider>
         <i className="fa-light fa-ban"></i>
         <Text strong> Règles de la maison</Text>
        </Divider>
        <Flex gap="middle" vertical>
         {ensureArray(property.houseRules).map((rule, index) => {
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

      <Col xs={12}>
       {property.elements && (
        <Col xs={24}>
         <Divider>
          <i className="fa-light fa-bell-plus"></i>
          <Text strong> Équipement supplémentaire</Text>
         </Divider>
         <Flex gap="middle" vertical>
          {ensureArray(property.elements).map((element, index) => {
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
          {ensureArray(property.safetyFeatures).map((feature, index) => {
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
    </Col>
   </Row>
  </Col>
 );
});

const RestaurantsCafes = React.memo(({ nearbyPlaces }) => {
 const [filteredPlaces, setFilteredPlaces] = useState([]);
 const filterPlaces = useCallback(() => {
  if (Array.isArray(nearbyPlaces) && nearbyPlaces.length > 0) {
   setFilteredPlaces(
    nearbyPlaces.filter(
     (place) =>
      place.types.includes('restaurant') ||
      place.types.includes('food') ||
      place.types.includes('cafe')
    )
   );
  } else {
   setFilteredPlaces([]);
  }
 }, [nearbyPlaces]);

 useEffect(() => {
  filterPlaces();
 }, [filterPlaces]);

 return (
  <Col xs={{ span: 20, offset: 2 }}>
   <Row gutter={[16, 16]}>
    <Col xs={24}>
     <Divider>
      <Title level={2}>
       <i className="fa-light fa-plate-utensils"></i> Restaurants & Cafés
      </Title>
     </Divider>
     <Row gutter={[16, 16]}>
      {filteredPlaces.slice(0, 6).map((place, index) => (
       <Col xs={8}>
        <Card
         hoverable={false}
         style={{
          width: '100%',
         }}
         cover={<Image src={place.photo} preview={false} />}
        >
         <Meta
          title={
           <Flex justify="space-between">
            <Text strong>{place.name}</Text>
            <Text strong style={{ color: '#cfaf83' }}>
             {place.rating}
            </Text>
           </Flex>
          }
          description={place.address}
         />
        </Card>
       </Col>
      ))}
     </Row>
    </Col>
   </Row>
  </Col>
 );
});

const Activities = React.memo(({ nearbyPlaces }) => {
 const [filteredPlaces, setFilteredPlaces] = useState([]);
 const filterPlaces = useCallback(() => {
  if (Array.isArray(nearbyPlaces) && nearbyPlaces.length > 0) {
   setFilteredPlaces(
    nearbyPlaces.filter((place) => place.types.includes('point_of_interest'))
   );
  } else {
   setFilteredPlaces([]);
  }
 }, [nearbyPlaces]);

 useEffect(() => {
  filterPlaces();
 }, [filterPlaces]);

 return (
  <Col xs={{ span: 20, offset: 2 }}>
   <Row gutter={[16, 16]}>
    <Col xs={24}>
     <Divider>
      <Title level={2}>
       <i className="fa-light fa-sun-cloud"></i> Activités
      </Title>
     </Divider>
     <Row gutter={[16, 16]}>
      {filteredPlaces.slice(0, 6).map((place, index) => (
       <Col xs={8}>
        <Card
         hoverable={false}
         style={{
          width: '100%',
         }}
         cover={<Image src={place.photo} preview={false} />}
        >
         <Meta
          title={
           <Flex justify="space-between">
            <Text strong>{place.name}</Text>
            <Text strong style={{ color: '#cfaf83' }}>
             {place.rating}
            </Text>
           </Flex>
          }
          description={place.address}
         />
        </Card>
       </Col>
      ))}
     </Row>
    </Col>
   </Row>
  </Col>
 );
});

const Attractions = React.memo(({ nearbyPlaces }) => {
 const [filteredPlaces, setFilteredPlaces] = useState([]);
 const filterPlaces = useCallback(() => {
  if (Array.isArray(nearbyPlaces) && nearbyPlaces.length > 0) {
   setFilteredPlaces(
    nearbyPlaces.filter((place) => place.types.includes('natural_feature'))
   );
  } else {
   setFilteredPlaces([]);
  }
 }, [nearbyPlaces]);

 useEffect(() => {
  filterPlaces();
 }, [filterPlaces]);

 return (
  <Col xs={{ span: 20, offset: 2 }}>
   <Row gutter={[16, 16]}>
    <Col xs={24}>
     <Divider>
      <Title level={2}>
       <i className="fa-light fa-camera"></i> Attractions
      </Title>
     </Divider>
     <Row gutter={[16, 16]}>
      {filteredPlaces.slice(0, 6).map((place, index) => (
       <Col xs={8}>
        <Card
         hoverable={false}
         style={{
          width: '100%',
         }}
         cover={<Image src={place.photo} preview={false} />}
        >
         <Meta
          title={
           <Flex justify="space-between">
            <Text strong>{place.name}</Text>
            <Text strong style={{ color: '#cfaf83' }}>
             {place.rating}
            </Text>
           </Flex>
          }
          description={place.address}
         />
        </Card>
       </Col>
      ))}
     </Row>
    </Col>
   </Row>
  </Col>
 );
});
