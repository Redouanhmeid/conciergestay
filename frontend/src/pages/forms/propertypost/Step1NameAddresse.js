import React, { useState } from 'react';
import { Layout, Form, Typography, Row, Col, Input, Button, Radio } from 'antd';
import Head from '../../../components/common/header';
import Foot from '../../../components/common/footer';
import { ArrowRightOutlined } from '@ant-design/icons';
import MapPicker from './MapPicker';
import airbnb from '../../../assets/airbnb.png';
import booking from '../../../assets/booking.png';

const { Content } = Layout;
const { Title } = Typography;

const Step1NameAddresse = ({ next, handleFormData, values }) => {
 const [checkedType, setCheckedType] = useState(null);

 const propertyTypes = [
  {
   label: 'Maison',
   value: 'house',
   icon: <i className="Radioicon fa-light fa-house"></i>,
  },
  {
   label: 'Appartement',
   value: 'apartment',
   icon: <i className="Radioicon fa-light fa-building"></i>,
  },
  {
   label: "Maison d'hôtes",
   value: 'guesthouse',
   icon: <i className="Radioicon fa-light fa-house-user"></i>,
  },
 ];

 const handleRadioChange = (e) => {
  setCheckedType(e.target.value);
 };

 const handlePlaceSelected = ({ latitude, longitude, placeName }) => {
  // Update values object with the new values
  values.latitude = latitude;
  values.longitude = longitude;
  values.placeName = placeName;
 };

 const submitFormData = () => {
  values.type = checkedType;
  handleFormData({
   name: values.name,
   description: values.description,
   type: values.type,
   airbnbUrl: values.airbnbUrl,
   bookingUrl: values.bookingUrl,
  });
  next();
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
         label="Type de propriété"
         name="type"
         rules={[
          {
           required: true,
           message: 'Veuillez sélectionner un type de propriété!',
          },
         ]}
        >
         <Radio.Group value={checkedType} onChange={handleRadioChange}>
          <div className="customRadioGroup">
           {propertyTypes.map((PropertyType) => (
            <div className="customRadioContainer" key={PropertyType.value}>
             <Radio value={PropertyType.value}>
              <div
               className={
                checkedType === PropertyType.value
                 ? 'customRadioButton customRadioChecked'
                 : 'customRadioButton'
               }
              >
               {PropertyType.icon}
               <div>{PropertyType.label}</div>
              </div>
             </Radio>
            </div>
           ))}
          </div>
         </Radio.Group>
        </Form.Item>
       </Col>

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

       <Col xs={24} md={12}>
        <Form.Item
         label="Airbnb URL (facultatif)"
         name="airbnbUrl"
         rules={[
          {
           type: 'url',
           message: 'Veuillez saisir une URL valide!',
          },
         ]}
        >
         <Input
          onChange={handleFormData('airbnbUrl')}
          prefix={
           <img src={airbnb} alt="prefix" style={{ width: 24, height: 24 }} />
          }
         />
        </Form.Item>
       </Col>

       <Col xs={24} md={12}>
        <Form.Item
         label="Booking URL (facultatif)"
         name="bookingUrl"
         rules={[
          {
           type: 'url',
           message: 'Veuillez saisir une URL valide!',
          },
         ]}
        >
         <Input
          onChange={handleFormData('bookingUrl')}
          prefix={
           <img src={booking} alt="prefix" style={{ width: 24, height: 24 }} />
          }
         />
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
