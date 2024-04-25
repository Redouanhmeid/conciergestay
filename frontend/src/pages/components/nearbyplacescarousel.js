import React, { useRef } from 'react';
import {
 Carousel,
 Card,
 Spin,
 Image,
 Button,
 Space,
 Typography,
 Tag,
 Rate,
 Grid,
} from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import useNearbyPlaces from '../../hooks/useNearbyPlaces';

const { Text } = Typography;
const { useBreakpoint } = Grid;

const NearbyPlacesCarousel = ({ latitude, longitude }) => {
 const slider = useRef(null);
 const { loading, error, data } = useNearbyPlaces(latitude, longitude);
 const screens = useBreakpoint();

 if (loading) {
  return (
   <div className="loading">
    <Spin size="large" />
   </div>
  );
 }
 if (error) return <div>Error: {error.message}</div>;

 const getSlidesToShow = () => {
  console.log(screens);
  if (screens.xs) {
   return 1;
  } else {
   return 4;
  }
 };

 return (
  <div style={{ position: 'relative' }}>
   <div
    style={{
     position: 'absolute',
     fontSize: 20,
     top: '40%',
     left: 0,
     zIndex: 1,
     color: '#2b2c32',
    }}
   >
    <LeftOutlined onClick={() => slider.current.prev()} />
   </div>

   <Carousel
    ref={slider}
    slidesToShow={getSlidesToShow()}
    dots={false}
    autoplay
    style={{ padding: '0 28px' }}
   >
    {data.map((place, index) => (
     <div key={index} style={{ margin: '0 12px' }}>
      <Card
       cover={
        <div className="nearbyplacescarousel">
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
         <Space wrap>
          <Text size={14}>Avis</Text>{' '}
          <Rate
           allowHalf
           disabled
           defaultValue={place.rating}
           style={{ color: '#cfaf83', fontSize: 14 }}
          />{' '}
          {place.rating}{' '}
          <Button
           href={place.url}
           target="_blank"
           type="default"
           shape="round"
           size={36}
           icon={<i className="fa-lg fa-light fa-map-location-dot"></i>}
          />
         </Space>
        }
       />
      </Card>
     </div>
    ))}
   </Carousel>

   <div
    style={{
     position: 'absolute',
     fontSize: 20,
     top: '40%',
     right: 0,
     zIndex: 1,
     color: '#2b2c32',
    }}
   >
    <RightOutlined onClick={() => slider.current.next()} />
   </div>
  </div>
 );
};

export default NearbyPlacesCarousel;
