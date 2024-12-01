import React, { useState, useEffect } from 'react';
import {
 Layout,
 Form,
 Typography,
 Row,
 Col,
 Input,
 Button,
 Radio,
 message,
} from 'antd';
import Head from '../../../components/common/header';
import Foot from '../../../components/common/footer';
import { ArrowRightOutlined } from '@ant-design/icons';
import { useAuthContext } from '../../../hooks/useAuthContext';
import { useUserData } from '../../../hooks/useUserData';
import useCreateProperty from '../../../hooks/useCreateProperty';
import MapPicker from './MapPicker';
import airbnb from '../../../assets/airbnb.png';
import booking from '../../../assets/booking.png';

const { Content } = Layout;
const { Title } = Typography;

const Step1NameAddresse = ({ next, handleFormData, values }) => {
 const { user } = useAuthContext();
 const User = user || JSON.parse(localStorage.getItem('user'));
 const { userData, getUserData } = useUserData();
 const { loading, error, success, propertyId, createProperty } =
  useCreateProperty();
 const [form] = Form.useForm();
 const [checkedType, setCheckedType] = useState(null);
 const [mapValues, setMapValues] = useState({
  latitude: null,
  longitude: null,
  placeName: null,
 });

 useEffect(() => {
  if (User) {
   getUserData(User.email);
  }
 }, [User]);

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
  console.log(latitude, longitude);
  setMapValues({
   latitude,
   longitude,
   placeName,
  });
  // Update form data
  handleFormData('latitude')({ target: { value: latitude } });
  handleFormData('longitude')({ target: { value: longitude } });
  handleFormData('placeName')({ target: { value: placeName } });
 };

 const submitFormData = async () => {
  // Check if map values are present
  if (!mapValues.latitude || !mapValues.longitude || !mapValues.placeName) {
   message.error('Veuillez sélectionner un emplacement sur la carte');
   return;
  }

  try {
   await form.validateFields();

   const completeFormData = {
    name: values.name,
    description: values.description,
    type: checkedType,
    airbnbUrl: values.airbnbUrl?.trim() ? values.airbnbUrl : '',
    bookingUrl: values.bookingUrl?.trim() ? values.bookingUrl : '',
    latitude: mapValues.latitude,
    longitude: mapValues.longitude,
    placeName: mapValues.placeName,
    propertyManagerId: userData.id,
   };

   // Create the property
   const newProperty = await createProperty(completeFormData);

   if (newProperty) {
    // Update form data as before
    Object.entries(completeFormData).forEach(([key, value]) => {
     handleFormData(key)({ target: { value } });
    });
    // Store the property ID for later use
    handleFormData('propertyId')({ target: { value: newProperty.id } });
    next();
   } else {
    message.error('Impossible de créer la propriété');
   }
  } catch (info) {
   console.log('Validate Failed:', info);
  }
 };

 return (
  <Layout className="contentStyle">
   <Head />
   <Layout>
    <Content className="container">
     <Form
      form={form}
      name="step1"
      layout="vertical"
      onFinish={submitFormData}
      size="large"
     >
      <Title level={3}>Enregistrez les informations de votre propriété</Title>
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
         <Input.TextArea
          rows={6}
          onChange={handleFormData('description')}
          showCount
          maxLength={500}
         />
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
        <Form.Item
         label="Emplacement"
         required
         rules={[
          {
           validator: (_, value) => {
            if (
             !mapValues.latitude ||
             !mapValues.longitude ||
             !mapValues.placeName
            ) {
             return Promise.reject(
              'Veuillez sélectionner un emplacement sur la carte'
             );
            }
            return Promise.resolve();
           },
          },
         ]}
        >
         <MapPicker onPlaceSelected={handlePlaceSelected} />
        </Form.Item>
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
