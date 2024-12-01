import React, { useState, useEffect } from 'react';
import {
 Row,
 Col,
 Card,
 Spin,
 Image,
 Flex,
 Tag,
 Typography,
 Carousel,
 message,
} from 'antd';
import { useNavigate } from 'react-router-dom';
import { filterProperties } from '../../utils/filterProperties';
import { getLocationForCityOrUser } from '../../utils/utils';
import fallback from '../../assets/fallback.png';
import useProperty from '../../hooks/useProperty';
import useGetPropertiesByLatLon from '../../hooks/useGetPropertiesByLatLon';
import useDebounce from '../../hooks/useDebounce';

const { Text } = Typography;

const PropertyList = ({
 city,
 mapCenter,
 checkedTypes,
 range,
 roomValue,
 paxValue,
 checkedbasicAmenities,
}) => {
 const navigate = useNavigate();

 const debouncedCenter = useDebounce(mapCenter, 300);
 const { loading, data } = useGetPropertiesByLatLon(
  debouncedCenter.lat,
  debouncedCenter.lng
 );
 const [filteredProperties, setFilteredProperties] = useState([]);
 const [imageAspectRatios, setImageAspectRatios] = useState({});

 // Effect to filter properties when properties or filter criteria change
 useEffect(() => {
  if (data) {
   setFilteredProperties(
    filterProperties(
     data,
     checkedTypes,
     range,
     roomValue,
     paxValue,
     checkedbasicAmenities
    )
   );
  }
 }, [
  data,
  city,
  checkedTypes,
  range,
  roomValue,
  paxValue,
  checkedbasicAmenities,
 ]);

 const display = (id) => {
  navigate(`/propertydetails?id=${id}`);
 };

 const handleImageLoad = (e, index) => {
  const { naturalWidth, naturalHeight } = e.target;
  const aspectRatio = naturalHeight > naturalWidth ? 'portrait' : 'landscape';

  setImageAspectRatios((prevState) => {
   const newState = {
    ...prevState,
    [index]: aspectRatio,
   };
   return newState;
  });
 };

 if (!mapCenter)
  return (
   <div className="loading">
    <Spin size="large" />
   </div>
  );

 return (
  <Row gutter={[32, 32]}>
   {filteredProperties &&
    filteredProperties.map((property) => (
     <Col xs={24} md={6} key={property.id}>
      <Card
       onClick={() => display(property.id)}
       key={property.id}
       style={{ textAlign: 'center', cursor: 'pointer' }}
       cover={
        <Carousel
         className="propertycarousel"
         autoplay
         effect="fade"
         key={property.id}
        >
         {property.photos.map((photo, index) => (
          <div key={index} className="image-container">
           <Image
            key={index}
            alt={property.name}
            src={photo}
            preview={false}
            fallback={fallback}
            placeholder={<div className="image-placeholder">Chargement...</div>}
            className={`card-image ${imageAspectRatios[index]}`}
            onLoad={(e) => handleImageLoad(e, index)}
           />
          </div>
         ))}
        </Carousel>
       }
      >
       <Card.Meta
        title={
         <Flex gap="small" vertical>
          <Text strong>{property.name}</Text>
          <Flex gap="small" justify="space-between" wrap>
           <Tag
            bordered={false}
            icon={<i className="tag-icon-style fa-light fa-location-dot"></i>}
           >
            {property.placeName}
           </Tag>
           <Tag bordered={false}>
            <Text strong>{property.price} Dh</Text>
           </Tag>
          </Flex>
         </Flex>
        }
        description={
         <Flex gap="small" justify="space-around">
          <Tag
           className="custom-tag"
           bordered={false}
           icon={<i className="tag-icon-style fa-light fa-bed"></i>}
          >
           {property.beds} Lit
          </Tag>
          <Tag
           className="custom-tag"
           bordered={false}
           icon={<i className="tag-icon-style fa-light fa-bed-front"></i>}
          >
           {property.rooms} Chambre
          </Tag>
         </Flex>
        }
       />
      </Card>
     </Col>
    ))}
  </Row>
 );
};

export default PropertyList;
