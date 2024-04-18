import React, { useState } from 'react';
import { Form, Row, Col, Divider, InputNumber, Checkbox, Input } from 'antd';

const HouseManual = () => {
 const [showAdditionalRules, setShowAdditionalRules] = useState(false);

 const handleCheckboxChange = (checkedValues) => {
  setShowAdditionalRules(checkedValues.includes('additionalRules'));
 };
 return (
  <Row gutter={[24, 0]}>
   <Col xs={12} md={9}>
    <Form.Item label="À présent, fixez votre prix" name="price">
     <InputNumber min={0} addonAfter="Dh" />
    </Form.Item>
   </Col>
   <Col xs={12} md={5}>
    <Form.Item label="Max Personnes" name="capacity">
     <InputNumber min={0} />
    </Form.Item>
   </Col>
   <Col xs={12} md={5}>
    <Form.Item label="Chambres" name="rooms">
     <InputNumber min={0} />
    </Form.Item>
   </Col>
   <Col xs={12} md={5}>
    <Form.Item label="Lits" name="beds">
     <InputNumber min={0} />
    </Form.Item>
   </Col>
   <Col xs={24} md={12}>
    <Form.Item
     label="Votre logement possède-t-il ces éléments ?"
     name="elements"
    >
     <Checkbox.Group>
      <Row>
       <Col span={24}>
        <Checkbox value="cameras">Caméras de surveillance extérieures</Checkbox>
       </Col>
       <Col span={24}>
        <Checkbox value="sonometers">Sonomètres</Checkbox>
       </Col>
       <Col span={24}>
        <Checkbox value="weapons">Armes</Checkbox>
       </Col>
      </Row>
     </Checkbox.Group>
    </Form.Item>
   </Col>
   <Col xs={24} md={12}>
    <Form.Item label="Règles de la maison:" name="houseRules">
     <Checkbox.Group>
      <Row>
       <Col span={24}>
        <Checkbox value="noNoise">Pas de bruit après 23h</Checkbox>
       </Col>
       <Col span={24}>
        <Checkbox value="noFoodDrinks">
         Pas de nourriture ni de boissons dans les chambres à coucher
        </Checkbox>
       </Col>
       <Col span={24}>
        <Checkbox value="noParties">Pas de fêtes ni d'événements</Checkbox>
       </Col>
       <Col span={24}>
        <Checkbox value="noSmoking">Défense de fumer</Checkbox>
       </Col>
       <Col span={24}>
        <Checkbox value="petsAllowed">Pas d'animaux de compagnie</Checkbox>
       </Col>
       <Col span={24}>
        <Checkbox
         value="additionalRules"
         checked={showAdditionalRules}
         onChange={(e) => setShowAdditionalRules(e.target.checked)}
        >
         Règles supplémentaires
        </Checkbox>
       </Col>
      </Row>
     </Checkbox.Group>
    </Form.Item>
   </Col>
   {showAdditionalRules && (
    <Col xs={24} md={24}>
     <Form.Item label="Règles supplémentaires">
      <Input.TextArea rows={4} />
     </Form.Item>
    </Col>
   )}
  </Row>
 );
};

export default HouseManual;
