import React, { useState, useEffect } from 'react';
import useGetProperties from '../../hooks/useGetProperties';
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
} from 'antd';
import { useNavigate } from 'react-router-dom';
import { filterProperties } from '../../utils/filterProperties';

const { Text } = Typography;

const PropertyList = ({
 city,
 checkedTypes,
 range,
 roomValue,
 paxValue,
 checkedbasicAmenities,
}) => {
 const navigate = useNavigate();
 const { properties, fetchAllProperties, loading, error } = useGetProperties();
 const [filteredProperties, setFilteredProperties] = useState([]);

 // Effect to filter properties when properties or filter criteria change
 useEffect(() => {
  if (properties) {
   setFilteredProperties(
    filterProperties(
     properties,
     city,
     checkedTypes,
     range,
     roomValue,
     paxValue,
     checkedbasicAmenities
    )
   );
  }
 }, [
  properties,
  city,
  checkedTypes,
  range,
  roomValue,
  paxValue,
  checkedbasicAmenities,
 ]);

 useEffect(() => {
  fetchAllProperties();
 }, [loading]);

 const display = (id) => {
  navigate(`/propertydetails?id=${id}`);
 };

 if (loading)
  return (
   <div className="loading">
    <Spin size="large" />
   </div>
  );

 return (
  <Row gutter={[32, 32]}>
   {filteredProperties.map((property) => (
    <Col xs={24} md={6} key={property.id}>
     <Card
      key={property.id}
      style={{ textAlign: 'center', cursor: 'pointer' }}
      cover={
       <Carousel autoplay effect="fade" key={property.id}>
        {typeof property.photos === 'string'
         ? JSON.parse(property.photos).map((photo) => (
            <img key={photo} alt={property.name} src={photo} />
           ))
         : property.photos.map((photo, index) => (
            <img key={index} alt={property.name} src={photo} />
           ))}
       </Carousel>
      }
     >
      <Card.Meta
       onClick={() => display(property.id)}
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
