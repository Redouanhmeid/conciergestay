import React, { useState, useEffect, useRef } from 'react';
import {
 Carousel,
 Card,
 Spin,
 Image,
 Button,
 Flex,
 Typography,
 Tag,
 Rate,
 Grid,
} from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import useNearbyPlaces from '../../hooks/useNearbyPlaces';

const { Title } = Typography;
const { useBreakpoint } = Grid;

const NearbyPlacesCarouselByType = ({ latitude, longitude, type }) => {
 const slider = useRef(null);
 const slider3 = useRef(null);
 const { loading, error, data } = useNearbyPlaces(latitude, longitude);
 const dataArray = data ? Object.values(data) : [];
 const screens = useBreakpoint();
 const [filteredPlaces, setFilteredPlaces] = useState([]);

 useEffect(() => {
  if (dataArray && dataArray.length > 0 && type) {
   if (type === 'food') {
    setFilteredPlaces(
     dataArray.filter(
      (place) =>
       place.types.includes('restaurant') || place.types.includes('food')
     )
    );
   } else {
    setFilteredPlaces(dataArray.filter((place) => place.types.includes(type)));
   }
  }
  if (!type) {
   setFilteredPlaces(dataArray);
  }
 }, [dataArray, type]);

 if (loading) {
  return (
   <div className="loading">
    <Spin size="large" />
   </div>
  );
 }
 if (error) return <div>Error: {error.message}</div>;

 const Activities = dataArray.filter((place) =>
  place.types.includes('natural_feature')
 );

 const getSlidesToShow = (dataArray) => {
  if (!dataArray || !Array.isArray(dataArray)) {
   return 0; // Return 0 if data is undefined or not an array
  }
  const totalSlides = dataArray.length;
  if (screens.xs) {
   return Math.min(1, totalSlides);
  } else {
   return Math.min(5, totalSlides);
  }
 };

 return (
  <div style={{ position: 'relative' }}>
   <div className="nearbyplacescarouselarrow left">
    <LeftOutlined onClick={() => slider.current.prev()} />
   </div>

   <Carousel
    ref={slider}
    slidesToShow={getSlidesToShow(dataArray)}
    dots={false}
    autoplay
    style={{ padding: '0 28px' }}
   >
    {dataArray.map((place, index) => (
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

const Place = ({ place }) => {
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
     <Flex justify="space-between" align="center">
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
       size={40}
       icon={<i className="fa-lg fa-light fa-map-location-dot"></i>}
      />
     </Flex>
    }
   />
  </Card>
 );
};
