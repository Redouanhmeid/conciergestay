import React from 'react';
import { Form, Checkbox, Row, Col } from 'antd';

const Equipments = () => {
 return (
  <>
   <Row gutter={[24, 0]}>
    <h2 style={{ margin: 0 }}>
     Indiquez aux voyageurs quels sont les équipements de votre logement:
    </h2>

    <Col xs={24} md={12}>
     <Form.Item label="Commodités de base:" name="basicAmenities">
      <Checkbox.Group>
       <Row>
        <Col span={24}>
         <Checkbox value="wifi">Wifi</Checkbox>
        </Col>
        <Col span={24}>
         <Checkbox value="television">Télévision</Checkbox>
        </Col>
        <Col span={24}>
         <Checkbox value="kitchen">Cuisine</Checkbox>
        </Col>
        <Col span={24}>
         <Checkbox value="washingMachine">Lave-linge</Checkbox>
        </Col>
        <Col span={24}>
         <Checkbox value="freeParking">Parking gratuit sur place</Checkbox>
        </Col>
        <Col span={24}>
         <Checkbox value="airConditioning">Climatisation</Checkbox>
        </Col>
        <Col span={24}>
         <Checkbox value="dedicatedWorkspace">Espace de travail dédié</Checkbox>
        </Col>
       </Row>
      </Checkbox.Group>
     </Form.Item>
    </Col>
    <Col xs={24} md={12}>
     <Form.Item
      label="Possédez-vous des équipements hors du commun ?"
      name="uncommonAmenities"
     >
      <Checkbox.Group>
       <Row>
        <Col span={24}>
         <Checkbox value="pool">Piscine</Checkbox>
        </Col>
        <Col span={24}>
         <Checkbox value="jacuzzi">Jacuzzi</Checkbox>
        </Col>
        <Col span={24}>
         <Checkbox value="patio">Patio</Checkbox>
        </Col>
        <Col span={24}>
         <Checkbox value="barbecue">Barbecue</Checkbox>
        </Col>
        <Col span={24}>
         <Checkbox value="outdoorDining">Espace repas en plein air</Checkbox>
        </Col>
        <Col span={24}>
         <Checkbox value="firePit">Brasero</Checkbox>
        </Col>
        <Col span={24}>
         <Checkbox value="billiards">Billard</Checkbox>
        </Col>
        <Col span={24}>
         <Checkbox value="fireplace">Cheminée</Checkbox>
        </Col>
        <Col span={24}>
         <Checkbox value="piano">Piano</Checkbox>
        </Col>
        <Col span={24}>
         <Checkbox value="fitnessEquipment">Appareils de fitness</Checkbox>
        </Col>
        <Col span={24}>
         <Checkbox value="lakeAccess">Accès au lac</Checkbox>
        </Col>
        <Col span={24}>
         <Checkbox value="beachAccess">Accès à la plage</Checkbox>
        </Col>
        <Col span={24}>
         <Checkbox value="skiAccess">Accessible à skis</Checkbox>
        </Col>
        <Col span={24}>
         <Checkbox value="outdoorShower">Douche extérieure</Checkbox>
        </Col>
       </Row>
      </Checkbox.Group>
     </Form.Item>
    </Col>
    <Col xs={24} md={12}>
     <Form.Item
      label="Possédez-vous ces équipements de sécurité ?"
      name="safetyFeatures"
     >
      <Checkbox.Group>
       <Row>
        <Col span={24}>
         <Checkbox value="smokeDetector">Détecteur de fumée</Checkbox>
        </Col>
        <Col span={24}>
         <Checkbox value="firstAidKit">Kit de premiers secours</Checkbox>
        </Col>
        <Col span={24}>
         <Checkbox value="fireExtinguisher">Extincteur</Checkbox>
        </Col>
        <Col span={24}>
         <Checkbox value="carbonMonoxideDetector">
          Détecteur de monoxyde de carbone
         </Checkbox>
        </Col>
       </Row>
      </Checkbox.Group>
     </Form.Item>
    </Col>
   </Row>
  </>
 );
};

export default Equipments;
