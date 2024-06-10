import React, { useRef } from 'react';
import {
 Carousel,
 Card,
 Spin,
 Image,
 Button,
 Flex,
 Typography,
 Rate,
 Grid,
} from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import useNearbyPlaces from '../../hooks/useNearbyPlaces';

const { Title } = Typography;
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
  place.types.includes('point_of_interest')
 );
 const Attractions = dataArray.filter((place) =>
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
  <>
   <Title level={3}>Endroits où manger</Title>
   <div style={{ position: 'relative' }}>
    <div className="nearbyplacescarouselarrow left">
     <LeftOutlined onClick={() => slider1.current.prev()} />
    </div>

    <Carousel
     ref={slider1}
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
     <RightOutlined onClick={() => slider1.current.next()} />
    </div>
   </div>
   <br />
   <Title level={3}>Activités</Title>
   <div style={{ position: 'relative' }}>
    <div className="nearbyplacescarouselarrow left">
     <LeftOutlined onClick={() => slider2.current.prev()} />
    </div>
    <Carousel
     ref={slider2}
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
     <RightOutlined onClick={() => slider2.current.next()} />
    </div>
   </div>
   <br />
   <Title level={3}>Attractions</Title>
   <div style={{ position: 'relative' }}>
    <div className="nearbyplacescarouselarrow left">
     <LeftOutlined onClick={() => slider3.current.prev()} />
    </div>
    <Carousel
     ref={slider3}
     slidesToShow={getSlidesToShow(Attractions)}
     dots={false}
     autoplay
     style={{ padding: '0 28px' }}
    >
     {Attractions.map((place, index) => (
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
