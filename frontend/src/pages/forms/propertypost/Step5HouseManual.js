import React, { useState, useEffect } from 'react';
import {
 Layout,
 Form,
 Row,
 Col,
 Button,
 Typography,
 InputNumber,
 Checkbox,
 Input,
 Alert,
 message,
} from 'antd';
import { ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons';
import Head from '../../../components/common/header';
import Foot from '../../../components/common/footer';
import { useNavigate } from 'react-router-dom';
import useUpdatePropertyCapacity from '../../../hooks/useUpdateProperty';
import useUpdatePropertyRules from '../../../hooks/useUpdateProperty';

const { Content } = Layout;
const { Title } = Typography;

const Step5HouseManual = ({ prev, values }) => {
 const {
  updatePropertyCapacity,
  isLoading: capacityLoading,
  success: capacitySuccess,
  error: capacityError,
 } = useUpdatePropertyCapacity(values.propertyId);
 const {
  updatePropertyRules,
  isLoading: rulesLoading,
  success: rulesSuccess,
  error: rulesError,
 } = useUpdatePropertyRules(values.propertyId);

 const navigate = useNavigate();

 const [showAdditionalRules, setShowAdditionalRules] = useState(false);
 const [Price, setPrice] = useState(values.price || null);
 const [Capacity, setCapacity] = useState(values.capacity || null);
 const [Rooms, setRooms] = useState(values.rooms || null);
 const [Beds, setBeds] = useState(values.beds || null);
 const [Elements, setElements] = useState(values.elements || []);
 const [HouseRules, setHouseRules] = useState(values.houseRules || []);
 const [AdditionalRules, setAdditionalRules] = useState(
  values.additionalRules || ''
 );

 const submitFormData = async () => {
  const capacityData = {
   price: Price,
   capacity: Capacity,
   rooms: Rooms,
   beds: Beds,
  };
  const rulesData = {
   houseRules: HouseRules,
  };

  if (showAdditionalRules) {
   const additionalRule = `additionalRules: ${AdditionalRules}`;
   rulesData.houseRules = rulesData.houseRules.filter(
    (rule) => rule !== 'additionalRules'
   );
   const index = rulesData.houseRules.findIndex((rule) =>
    rule.startsWith('additionalRules:')
   );

   if (index !== -1) {
    // Replace the existing additionalRules entry
    rulesData.houseRules[index] = additionalRule;
   } else {
    // Add a new additionalRules entry
    rulesData.houseRules.push(additionalRule);
   }
  }

  let hasErrors = false;
  try {
   await updatePropertyCapacity(capacityData);
   await updatePropertyRules(rulesData);
  } catch (error) {
   hasErrors = true;
   message.error('Une erreur est survenue');
  }

  if (!hasErrors) {
   // Update values object with all the new data
   Object.assign(values, { ...capacityData, ...rulesData });
   navigate('/dashboard');
  }
 };

 const onChangeElements = (checkedvalues) => {
  setElements(checkedvalues);
 };
 const onChangehouseRules = (checkedvalues) => {
  setHouseRules(checkedvalues);
 };
 const handleCheckboxChange = (checkedValues) => {
  setShowAdditionalRules(checkedValues.includes('additionalRules'));
 };

 return (
  <Layout className="contentStyle">
   <Head />
   <Layout>
    <Content className="container">
     <Form
      name="step5"
      layout="vertical"
      onFinish={submitFormData}
      size="large"
      initialValues={{
       price: Price,
       capacity: Capacity,
       rooms: Rooms,
       beds: Beds,
       houseRules: HouseRules,
       additionalRules: AdditionalRules,
      }}
     >
      <Title level={2}>Manuel de la maison</Title>
      <Row gutter={[24, 0]}>
       <Col xs={24} md={9}>
        <Form.Item label="À présent, fixez votre prix" name="price">
         <InputNumber
          min={0}
          addonAfter="Dh"
          value={Price}
          onChange={(value) => setPrice(value)}
         />
        </Form.Item>
       </Col>
       <Col xs={9} md={5}>
        <Form.Item label="Max Personnes" name="capacity">
         <InputNumber
          min={0}
          value={Capacity}
          onChange={(value) => setCapacity(value)}
         />
        </Form.Item>
       </Col>
       <Col xs={8} md={5}>
        <Form.Item label="Chambres" name="rooms">
         <InputNumber
          min={0}
          value={Rooms}
          onChange={(value) => setRooms(value)}
         />
        </Form.Item>
       </Col>
       <Col xs={7} md={5}>
        <Form.Item label="Lits" name="beds">
         <InputNumber
          min={0}
          value={Beds}
          onChange={(value) => setBeds(value)}
         />
        </Form.Item>
       </Col>

       <Col xs={24} md={24}>
        <Form.Item label="Règles de la maison:" name="houseRules">
         <Checkbox.Group value={HouseRules} onChange={onChangehouseRules}>
          <Row gutter={[24, 0]}>
           <Col xs={24}>
            <Checkbox value="noNoise">
             <i className="fa-light fa-volume-slash fa-xl" /> Pas de bruit après
             23h
            </Checkbox>
           </Col>
           <Col xs={24}>
            <Checkbox value="noFoodDrinks">
             <i className="fa-light fa-utensils-slash fa-xl" /> Pas de
             nourriture ni de boissons dans les chambres à coucher
            </Checkbox>
           </Col>
           <Col xs={24}>
            <Checkbox value="noParties">
             <i className="fa-light fa-champagne-glasses fa-xl" /> Pas de fêtes
             ni d'événements
            </Checkbox>
           </Col>
           <Col xs={24}>
            <Checkbox value="noSmoking">
             <i className="fa-light fa-ban-smoking fa-xl" /> Défense de fumer
            </Checkbox>
           </Col>
           <Col xs={24}>
            <Checkbox value="noPets">
             <i className="fa-light fa-paw-simple fa-xl" /> Pas d'animaux de
             compagnie
            </Checkbox>
           </Col>
           <Col xs={24}>
            <Checkbox value="noUnmarriedCouple">
             <i className="fa-light fa-ban fa-xl" /> Pas de couple non marié
            </Checkbox>
           </Col>
           <Col xs={24}>
            <Checkbox
             value="additionalRules"
             checked={showAdditionalRules}
             onChange={(e) => setShowAdditionalRules(e.target.checked)}
            >
             <i className="fa-light fa-circle-info fa-xl" /> Règles
             supplémentaires
            </Checkbox>
           </Col>
          </Row>
         </Checkbox.Group>
        </Form.Item>
       </Col>
       {showAdditionalRules && (
        <Col xs={24} md={24}>
         <Form.Item label="Règles supplémentaires" value="AdditionalRules">
          <Input.TextArea
           rows={4}
           value={AdditionalRules} // Use value instead of onChange
           onChange={(e) => setAdditionalRules(e.target.value)}
          />
         </Form.Item>
        </Col>
       )}
      </Row>
      <br />

      {capacitySuccess && !capacityError && rulesSuccess && !rulesError && (
       <Col xs={24}>
        <Alert message="Propriété créée avec succès" type="success" closable />
        <br />
       </Col>
      )}
      {capacityError ||
       (rulesError && (
        <Col xs={24}>
         <Alert
          message="Échec de la création de la propriété"
          type="error"
          closable
         />
         <br />
        </Col>
       ))}
      <Row justify="end">
       <Col xs={8} md={1}>
        <Form.Item>
         <Button
          htmlType="submit"
          shape="circle"
          onClick={prev}
          disabled={capacityLoading || rulesLoading}
          icon={<ArrowLeftOutlined />}
         />
        </Form.Item>
       </Col>
       <Col xs={16} md={3}>
        <Form.Item>
         <Button
          type="primary"
          htmlType="submit"
          style={{ width: '100%' }}
          loading={capacityLoading || rulesLoading}
          disabled={capacitySuccess || rulesSuccess}
         >
          Enregistrer
         </Button>
        </Form.Item>
       </Col>
      </Row>
     </Form>
    </Content>
   </Layout>
   <Foot />
  </Layout>
 );
};

export default Step5HouseManual;
