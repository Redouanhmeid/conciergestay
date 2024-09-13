import React, { useRef, useEffect, useState } from 'react';
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
 message,
} from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import useNearbyPlace from '../../hooks/useNearbyPlace';

const { Title } = Typography;
const { useBreakpoint } = Grid;

const NearbyPlacesCarousel = ({ latitude, longitude }) => {
 const slider1 = useRef(null);
 const slider2 = useRef(null);
 const slider3 = useRef(null);
 const slider4 = useRef(null);

 const [data, setData] = useState(null);

 const { loading, error, getNearbyPlacesByLatLon } = useNearbyPlace();

 useEffect(() => {
  if (latitude && longitude) {
   getNearbyPlacesByLatLon(latitude, longitude)
    .then((data) => {
     setData(data);
    })
    .catch((err) => {
     message.error('Échec du chargement des détails des lieux à proximité.');
    });
  }
 }, [latitude, longitude]);

 const dataArray = data ? Object.values(data) : [];
 const screens = useBreakpoint();

 if (loading) {
  return (
   <div className="loading">
    <Spin size="large" />
   </div>
  );
 }
 if (error) return <div></div>;

 const PlacesToEat = dataArray.filter((place) =>
  place.types.includes('Restaurant & Café')
 );
 const Activities = dataArray.filter((place) =>
  place.types.includes('Activité')
 );
 const Attractions = dataArray.filter((place) =>
  place.types.includes('Attraction')
 );
 const Malls = dataArray.filter((place) =>
  place.types.includes('Centre commercial')
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
   {PlacesToEat.length > 0 && (
    <>
     <Title level={3}>
      <i className="fa-light fa-plate-utensils"></i> Restaurants & Cafés
     </Title>
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
    </>
   )}

   {Activities.length > 0 && (
    <>
     <Title level={3}>
      <i className="fa-light fa-sun-cloud"></i> Activités
     </Title>
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
    </>
   )}

   {Attractions.length > 0 && (
    <>
     <Title level={3}>
      <i className="fa-light fa-camera"></i> Attractions
     </Title>
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
     <br />
    </>
   )}

   {Malls.length > 0 && (
    <>
     <Title level={3}>
      <i className="fa-light fa-store"></i> Centres commerciaux
     </Title>
     <div style={{ position: 'relative' }}>
      <div className="nearbyplacescarouselarrow left">
       <LeftOutlined onClick={() => slider4.current.prev()} />
      </div>
      <Carousel
       ref={slider4}
       slidesToShow={getSlidesToShow(Malls)}
       dots={false}
       autoplay
       style={{ padding: '0 28px' }}
      >
       {Malls.map((place, index) => (
        <div key={index} style={{ margin: '0 12px' }}>
         <Place place={place} />
        </div>
       ))}
      </Carousel>
      <div className="nearbyplacescarouselarrow right">
       <RightOutlined onClick={() => slider4.current.next()} />
      </div>
     </div>
    </>
   )}
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
