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

const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

const NearbyPlacesCarousel = ({ latitude, longitude }) => {
 const slider1 = useRef(null);
 const slider2 = useRef(null);
 const slider3 = useRef(null);
 const { loading, error, data } = useNearbyPlaces(latitude, longitude);
 const dataArray = data ? Object.values(data) : [];
 const screens = useBreakpoint();

 if (loading) {
  return (
   <div className="loading">
    <Spin size="large" />
   </div>
  );
 }
 if (error) return <div>Error: {error.message}</div>;

 const PlacesToEat = dataArray.filter(
  (place) => place.types.includes('restaurant') || place.types.includes('food')
 );
 const Activities = dataArray.filter((place) =>
  place.types.includes('natural_feature')
 );
 const pointsOfInterest = dataArray.filter((place) =>
  place.types.includes('point_of_interest')
 );

 const getSlidesToShow = (dataArray) => {
  if (!dataArray || !Array.isArray(dataArray)) {
   return 0; // Return 0 if data is undefined or not an array
  }
  const totalSlides = dataArray.length;
  if (screens.xs) {
   return Math.min(1, totalSlides);
  } else {
   return Math.min(4, totalSlides);
  }
 };

 return (
  <>
   <div style={{ position: 'relative' }}>
    <div className="nearbyplacescarouselarrow left">
     <LeftOutlined onClick={() => slider1.current.prev()} />
    </div>

    <Carousel
     ref={slider1}
     slidesToShow={4}
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
     <RightOutlined onClick={() => slider1.current.next()} />
    </div>
   </div>

   <Title level={2}>Endroits où manger</Title>
   <div style={{ position: 'relative' }}>
    <div className="nearbyplacescarouselarrow left">
     <LeftOutlined onClick={() => slider2.current.prev()} />
    </div>
    <Carousel
     ref={slider2}
     slidesToShow={getSlidesToShow(PlacesToEat)}
     dots={false}
     autoplay
     style={{ padding: '0 28px' }}
    >
     {PlacesToEat.map((place, index) => (
      <div key={index} style={{ margin: '0 12px' }}>
       <Place place={place} />
      </div>
     ))}
    </Carousel>
    <div className="nearbyplacescarouselarrow right">
     <RightOutlined onClick={() => slider2.current.next()} />
    </div>
   </div>
   <br />
   <Title level={2}>Activités</Title>
   <div style={{ position: 'relative' }}>
    <div className="nearbyplacescarouselarrow left">
     <LeftOutlined onClick={() => slider3.current.prev()} />
    </div>
    <Carousel
     ref={slider3}
     slidesToShow={getSlidesToShow(Activities)}
     dots={false}
     autoplay
     style={{ padding: '0 28px' }}
    >
     {Activities.map((place, index) => (
      <div key={index} style={{ margin: '0 12px' }}>
       <Place place={place} />
      </div>
     ))}
    </Carousel>
    <div className="nearbyplacescarouselarrow right">
     <RightOutlined onClick={() => slider3.current.next()} />
    </div>
   </div>
  </>
 );
};

export default NearbyPlacesCarousel;

const Place = ({ place }) => {
 return (
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
      <Text size={14}>Note</Text>{' '}
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
 );
};
