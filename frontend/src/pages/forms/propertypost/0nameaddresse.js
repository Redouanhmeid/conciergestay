import React, { useState } from 'react';
import { Row, Col, Form, Input } from 'antd';
import MapPicker from './MapPicker';

const NameAdrress = ({ onSubmit }) => {
 const [Latitude, setLatitude] = useState(null);
 const [Longitude, setLongitude] = useState(null);
 const [PlaceName, setPlaceName] = useState(null);

 const handlePlaceSelected = ({ latitude, longitude, placeName }) => {
  setLatitude(latitude);
  setLongitude(longitude);
  setPlaceName(placeName);
  // Automatically submit the form when latitude is selected
  onSubmit({ latitude, longitude, placeName });
 };

 return (
  <Row gutter={[24, 0]}>
   <Col xs={24} md={24}>
    <Form.Item
     label="Nom"
     name="name"
     rules={[
      {
       required: true,
       message: 'Veuillez saisir votre nom!',
      },
     ]}
    >
     <Input />
    </Form.Item>
   </Col>
   <Col xs={24} md={24}>
    <Form.Item
     label="Description"
     name="description"
     rules={[
      {
       required: true,
       message: 'Veuillez saisir une description!',
      },
     ]}
    >
     <Input.TextArea />
    </Form.Item>
   </Col>

   <Col xs={24} md={24}>
    <MapPicker onPlaceSelected={handlePlaceSelected} />
   </Col>
  </Row>
 );
};

export default NameAdrress;
