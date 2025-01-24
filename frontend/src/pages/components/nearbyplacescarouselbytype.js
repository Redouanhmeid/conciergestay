import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
 Carousel,
 Card,
 Spin,
 Image,
 Button,
 Typography,
 Rate,
 Grid,
 message,
} from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import useNearbyPlace from '../../hooks/useNearbyPlace';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../../context/TranslationContext';

const { Text } = Typography;
const { useBreakpoint } = Grid;

const NearbyPlacesCarouselByType = ({ latitude, longitude, type }) => {
 const { t } = useTranslation();
 const slider = useRef(null);
 const navigate = useNavigate();

 const { loading, error, getNearbyPlacesByLatLon } = useNearbyPlace();
 const screens = useBreakpoint();
 const [data, setData] = useState(null);
 const [filteredPlaces, setFilteredPlaces] = useState([]);

 const filterPlaces = useCallback(() => {
  if (Array.isArray(data) && data.length > 0) {
   if (type && type !== 'Tous') {
    setFilteredPlaces(data.filter((place) => place.types.includes(type)));
   } else {
    setFilteredPlaces(data);
   }
  } else {
   setFilteredPlaces([]); // Ensure it is always an array
  }
 }, [data, type]);

 useEffect(() => {
  if (latitude && longitude) {
   getNearbyPlacesByLatLon(latitude, longitude)
    .then((data) => {
     setData(data);
    })
    .catch((err) => {
     console.error(t('map.messageError'));
    });
  }
 }, []);

 useEffect(() => {
  filterPlaces();
 }, [filterPlaces]);

 if (loading) {
  return (
   <div className="loading">
    <Spin size="large" />
   </div>
  );
 }

 if (error) {
  return <div>Error: {error.message}</div>;
 }

 const getSlidesToShow = () => {
  if (!Array.isArray(filteredPlaces) || filteredPlaces.length === 0) {
   return 1;
  }
  const totalSlides = filteredPlaces.length;
  return screens.xs ? Math.min(2, totalSlides) : Math.min(5, totalSlides);
 };

 // Check if there are no places to display
 if (filteredPlaces.length === 0) {
  return (
   <div style={{ textAlign: 'center', padding: '50px' }}>
    <Button type="primary" onClick={() => navigate('/createnearbyplace')}>
     Enregistrer un lieu à proximité
    </Button>
   </div>
  );
 }

 return (
  <div style={{ position: 'relative' }}>
   <div className="nearbyplacescarouselarrow left">
    <LeftOutlined onClick={() => slider.current.prev()} />
   </div>

   <Carousel
    ref={slider}
    slidesToShow={getSlidesToShow()}
    dots={false}
    autoplay
   >
    {filteredPlaces.map((place, index) => (
     <Place place={place} key={index} style={{ margin: '0 12px' }} />
    ))}
   </Carousel>

   <div className="nearbyplacescarouselarrow right">
    <RightOutlined onClick={() => slider.current.next()} />
   </div>
  </div>
 );
};

export default NearbyPlacesCarouselByType;

const Place = React.memo(({ place }) => {
 const screens = useBreakpoint();
 return (
  <Card
   className="custom-card"
   cover={
    <div className="nearbyplacescarousel" hoverable="false">
     <Image
      alt={place.name}
      src={place.photo}
      style={{
       position: 'absolute',
       top: 0,
       left: 0,
       width: '100%',
       height: '100%',
       objectFit: 'cover',
       borderRadius: 'inherit',
      }}
     />
    </div>
   }
   style={{
    width: 'calc(100% - 16px)',
    margin: '0 8px',
    height: screens.xs ? '220px' : 'auto',
    position: 'relative',
   }}
  >
   <Card.Meta
    title={
     <Text
      style={{
       fontSize: '16px',
       display: '-webkit-box',
       WebkitLineClamp: 2, // Limit to two lines
       WebkitBoxOrient: 'vertical',
       overflow: 'hidden',
       textOverflow: 'ellipsis',
       whiteSpace: 'normal', // Allow text to wrap
      }}
     >
      {place.name}
     </Text>
    }
    description={
     <div
      style={{
       display: 'flex',
       justifyContent: 'space-between',
       alignItems: 'center',
      }}
     >
      <div>
       <Rate
        allowHalf
        disabled
        defaultValue={place.rating}
        style={{ color: '#FDB022', fontSize: 12 }}
       />{' '}
       {!screens.xs && place.rating}
      </div>
      <Button
       href={place.url}
       target="_blank"
       type="link"
       icon={<i className="fa-lg fa-light fa-map-location-dot"></i>}
      />
     </div>
    }
   />
  </Card>
 );
});
