import React, { useState } from 'react';
import { Layout, Form, Typography, Row, Col, Checkbox, Button } from 'antd';
import Head from '../../../components/common/header';
import Foot from '../../../components/common/footer';
import { ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons';

const { Content } = Layout;
const { Title } = Typography;

const Step3Equipements = ({ next, prev, values }) => {
 const [BasicAmenities, setBasicAmenities] = useState([]);
 const [UncommonAmenities, setUncommonAmenities] = useState([]);
 const [SafetyFeatures, setSafetyFeatures] = useState([]);
 const submitFormData = () => {
  values.basicAmenities = BasicAmenities;
  values.uncommonAmenities = UncommonAmenities;
  values.safetyFeatures = SafetyFeatures;
  next();
 };
 const onChangeBasicAmenities = (checkedvalues) => {
  setBasicAmenities(checkedvalues);
 };
 const onChangeUncommonAmenities = (checkedvalues) => {
  setUncommonAmenities(checkedvalues);
 };
 const onChangeSafetyFeatures = (checkedvalues) => {
  setSafetyFeatures(checkedvalues);
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
      <Title level={2}>
       Indiquez aux voyageurs quels sont les équipements de votre logement:
      </Title>
      <Row gutter={[24, 0]}>
       <Col xs={24} md={12}>
        <Form.Item label="Commodités de base:" name="basicAmenities">
         <Checkbox.Group onChange={onChangeBasicAmenities}>
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
            <Checkbox value="dedicatedWorkspace">
             Espace de travail dédié
            </Checkbox>
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
         <Checkbox.Group onChange={onChangeUncommonAmenities}>
          <Row>
           <Col span={24}>
            <Checkbox value="pool">Piscine</Checkbox>
           </Col>
           <Col span={24}>
            <Checkbox value="outdoorDining">Espace repas en plein air</Checkbox>
           </Col>
           <Col span={24}>
            <Checkbox value="fireplace">Cheminée</Checkbox>
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
          </Row>
         </Checkbox.Group>
        </Form.Item>
       </Col>
       <Col xs={24} md={12}>
        <Form.Item
         label="Possédez-vous ces équipements de sécurité ?"
         name="safetyFeatures"
        >
         <Checkbox.Group onChange={onChangeSafetyFeatures}>
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
      <Row justify="end">
       <Col xs={8} md={1}>
        <Form.Item>
         <Button
          htmlType="submit"
          shape="circle"
          onClick={prev}
          icon={<ArrowLeftOutlined />}
         />
        </Form.Item>
       </Col>
       <Col xs={16} md={3}>
        <Form.Item>
         <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
          Continue {<ArrowRightOutlined />}
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

export default Step3Equipements;
