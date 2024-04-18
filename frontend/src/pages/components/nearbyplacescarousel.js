import React, { useRef } from 'react';
import { Carousel, Card, Image, Button } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';

const images = [
 'https://via.placeholder.com/600',
 'https://via.placeholder.com/150',
 'https://via.placeholder.com/600',
 'https://via.placeholder.com/150',
 'https://via.placeholder.com/600',
 'https://via.placeholder.com/150',
 'https://via.placeholder.com/600',
];

const NearbyPlacesCarousel = () => {
 const slider = useRef(null);

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
    slidesToShow={4}
    dots={false}
    autoplay
    style={{ padding: '0 24px' }}
   >
    {images.map((imageUrl, index) => (
     <div key={index} style={{ margin: '0 8px' }}>
      <Card
       cover={<Image alt="example" src={imageUrl} />}
       style={{ width: 'calc(100% - 16px)' }}
      >
       <Card.Meta title="Card title" description="This is the description" />
       <Button type="primary">Button</Button>
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
