import React, { useState } from 'react';
import { Layout, Form, Typography, Row, Col, Input, Button, Radio } from 'antd';
import Head from '../../../components/common/header';
import Foot from '../../../components/common/footer';
import { ArrowRightOutlined } from '@ant-design/icons';
import MapPicker from './MapPicker';

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
 const submitFormData = () => {
  const { name, description } = values;
  handleFormData({
   name,
   description,
  });
  values.type = checkedType;
  console.log(values);
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
        <Title level={4}>Type de propriété</Title>
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
