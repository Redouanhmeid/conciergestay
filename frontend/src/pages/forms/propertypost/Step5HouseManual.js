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
} from 'antd';
import { ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons';
import Head from '../../../components/common/header';
import Foot from '../../../components/common/footer';
import { useAuthContext } from '../../../hooks/useAuthContext';
import { useUserData } from '../../../hooks/useUserData';
import useCreateProperty from '../../../hooks/useCreateProperty';
import { useNavigate } from 'react-router-dom';

const { Content } = Layout;
const { Title } = Typography;

const Step5HouseManual = ({ prev, values }) => {
 const { user } = useAuthContext();
 const User = user || JSON.parse(localStorage.getItem('user'));
 const { userData, getUserData } = useUserData();
 const { createProperty, loading, error, success } = useCreateProperty();

 const navigate = useNavigate();

 const [showAdditionalRules, setShowAdditionalRules] = useState(false);
 const [Price, setPrice] = useState([]);
 const [Capacity, setCapacity] = useState([]);
 const [Rooms, setRooms] = useState([]);
 const [Beds, setBeds] = useState([]);
 const [Elements, setElements] = useState([]);
 const [HouseRules, setHouseRules] = useState([]);
 const [AdditionalRules, setAdditionalRules] = useState('');

 useEffect(() => {
  if (User) {
   getUserData(User.email);
  }
 }, [User]);

 const submitFormData = () => {
  values.price = Price;
  values.capacity = Capacity;
  values.rooms = Rooms;
  values.beds = Beds;
  values.elements = Elements;
  values.houseRules = HouseRules;
  if (showAdditionalRules) {
   values.houseRules.push(`additionalRules: ${AdditionalRules}`);
  }
  values.propertyManagerId = userData.id;
  onFinish(values);
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
 const onFinish = async (values) => {
  try {
   await createProperty(values);
   setTimeout(() => {
    console.log(values);
    // Navigate to the dashboard
    navigate('/dashboard');
   }, 1000);
  } catch (error) {
   console.error('Error:', error);
  }
 };

 return (
  <Layout className="contentStyle">
   <Head />
   <Layout>
    <Content className="container">
     <Form
      name="step3"
      layout="vertical"
      onFinish={submitFormData}
      size="large"
     >
      <Title level={2}>Manuel de la maison</Title>
      <Row gutter={[24, 0]}>
       <Col xs={24} md={9}>
        <Form.Item label="À présent, fixez votre prix" name="price">
         <InputNumber
          min={0}
          addonAfter="Dh"
          onChange={(value) => setPrice(value)}
         />
        </Form.Item>
       </Col>
       <Col xs={9} md={5}>
        <Form.Item label="Max Personnes" name="capacity">
         <InputNumber min={0} onChange={(value) => setCapacity(value)} />
        </Form.Item>
       </Col>
       <Col xs={8} md={5}>
        <Form.Item label="Chambres" name="rooms">
         <InputNumber min={0} onChange={(value) => setRooms(value)} />
        </Form.Item>
       </Col>
       <Col xs={7} md={5}>
        <Form.Item label="Lits" name="beds">
         <InputNumber min={0} onChange={(value) => setBeds(value)} />
        </Form.Item>
       </Col>

       <Col xs={24} md={24}>
        <Form.Item label="Règles de la maison:" name="houseRules">
         <Checkbox.Group onChange={onChangehouseRules}>
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

      {success && !error && (
       <Col xs={24}>
        <Alert message="Propriété créée avec succès" type="success" closable />
        <br />
       </Col>
      )}
      {error && (
       <Col xs={24}>
        <Alert
         message="Échec de la création de la propriété"
         type="error"
         closable
        />
        <br />
       </Col>
      )}
      <Row justify="end">
       <Col xs={8} md={1}>
        <Form.Item>
         <Button
          htmlType="submit"
          shape="circle"
          onClick={prev}
          disabled={loading}
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
          loading={loading}
          disabled={success}
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
