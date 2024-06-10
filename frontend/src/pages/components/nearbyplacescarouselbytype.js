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
} from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import useNearbyPlaces from '../../hooks/useNearbyPlaces';

const { Title } = Typography;
const { useBreakpoint } = Grid;

const NearbyPlacesCarouselByType = ({ latitude, longitude, type }) => {
 const slider = useRef(null);
 const { loading, error, data } = useNearbyPlaces(latitude, longitude);
 const screens = useBreakpoint();
 const [filteredPlaces, setFilteredPlaces] = useState([]);

 const filterPlaces = useCallback(() => {
  if (Array.isArray(data) && data.length > 0) {
   if (type && type !== 'Tous') {
    if (type === 'food') {
     setFilteredPlaces(
      data.filter(
       (place) =>
        place.types.includes('restaurant') || place.types.includes('food')
      )
     );
    } else {
     setFilteredPlaces(data.filter((place) => place.types.includes(type)));
    }
   } else {
    setFilteredPlaces(data);
   }
  } else {
   setFilteredPlaces([]); // Ensure it is always an array
  }
 }, [data, type]);

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
  return screens.xs ? Math.min(1, totalSlides) : Math.min(5, totalSlides);
 };

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
    style={{ padding: '0 28px' }}
   >
    {filteredPlaces.map((place, index) => (
     <div key={index} style={{ margin: '0 12px' }}>
      <Place place={place} />
     </div>
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
 return (
  <Card
   cover={
    <div
     className="nearbyplacescarousel"
     style={{ borderTopLeftRadius: '12px', borderTopRightRadius: '12px' }}
    >
     <Image
      alt={place.name}
      src={place.photo}
      style={{
       objectFit: 'cover',
       width: '100%',
       height: '100%',
      }}
     />
    </div>
   }
   style={{ width: 'calc(100% - 16px)' }}
  >
   <Card.Meta
    title={place.name}
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
        style={{ color: '#cfaf83', fontSize: 12 }}
       />{' '}
       {place.rating}
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
