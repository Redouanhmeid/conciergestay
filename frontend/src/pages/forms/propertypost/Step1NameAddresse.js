import React from 'react';
import { Layout, Form, Typography, Row, Col, Input, Button } from 'antd';
import Head from '../../../components/common/header';
import Foot from '../../../components/common/footer';
import { ArrowRightOutlined } from '@ant-design/icons';
import MapPicker from './MapPicker';

const { Content } = Layout;
const { Title } = Typography;

const Step1NameAddresse = ({ next, handleFormData, values }) => {
 const submitFormData = () => {
  const { name, description } = values;
  handleFormData({
   name,
   description,
  });
  next();
 };

 const handlePlaceSelected = ({ latitude, longitude, placeName }) => {
  // Update values object with the new values
  values.latitude = latitude;
  values.longitude = longitude;
  values.placeName = placeName;
 };
 return (
  <Layout className="contentStyle">
   <Head />
   <Layout>
    <Content className="container">
     <Form
      name="step1"
      layout="vertical"
      onFinish={submitFormData}
      size="large"
     >
      <Title level={2}>Enregistrez les informations de votre propriété</Title>
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
         <Input onChange={handleFormData('name')} />
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
         <Input.TextArea onChange={handleFormData('description')} />
        </Form.Item>
       </Col>

       <Col xs={24} md={24}>
        <MapPicker onPlaceSelected={handlePlaceSelected} />
       </Col>
      </Row>
      <br />
      <Row justify="end">
       <Col xs={{ span: 12, offset: 12 }} md={{ span: 4, offset: 20 }}>
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

export default Step1NameAddresse;
