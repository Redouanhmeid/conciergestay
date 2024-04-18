import React, { useState, useEffect } from 'react';
import {
 Layout,
 Row,
 Col,
 Typography,
 Form,
 Button,
 Collapse,
 Alert,
 message,
} from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import Head from '../../../components/common/header';
import Foot from '../../../components/common/footer';
import SideMenu from '../../../components/sidemenu';
import NameAdrress from './nameaddresse';
import { CheckInForm, CheckOutForm } from './CheckInCheckOut';
import Equipments from './Equipements';
import Photos from './Photos';
import HouseManual from './HouseManual';
import dayjs from 'dayjs';
import useCreateProperty from '../../../hooks/useCreateProperty';
import useUploadPhotos from '../../../hooks/useUploadPhotos';
import { Link, useLocation } from 'react-router-dom';

const { Title } = Typography;
const { Content } = Layout;
const format = 'HH:mm';

const PropertyPost = () => {
 const location = useLocation();
 const { userData } = location.state;
 const [form] = Form.useForm();
 const [propertyData, setPropertyData] = useState(null);
 const { createProperty, loading, error, success } =
  useCreateProperty(propertyData);
 const [photos, setPhotos] = useState({});
 const { uploadPhotos, uploading } = useUploadPhotos();
 const handleNameAddressSubmit = (data) => {
  setPropertyData({ ...propertyData, ...data });
 };
 const handlePhotosChange = (newFileList) => {
  setPhotos(newFileList);
 };
 /* if (form.getFieldValue('checkInTime')) {
  console.log(form.getFieldValue('checkInTime'));
 } */
 const onFinish = async (formValues) => {
  try {
   const photoUrls = await uploadPhotos(photos);
   // You can send the form values and photoUrls to your backend API for further processing
   const mergedValues = {
    ...formValues,
    ...propertyData,
    photos: photoUrls,
    propertyManagerId: userData.id,
   };

   setPropertyData(mergedValues);
   if (propertyData) {
    createProperty(propertyData);
   }
  } catch (error) {
   console.error('Error uploading photos:', error);
  }
 };

 useEffect(() => {
  if (success) {
   message.success('Property created successfully');
   form.resetFields();
   setPropertyData(null);
  }
  if (error) {
   message.error('Failed to create property');
  }
 }, [success, error, form]);

 return (
  <Layout className="contentStyle">
   <Head />
   <Layout>
    <SideMenu width="25%" className="siderStyle" />
    <Content className="container-fluid">
     <Link to="/">
      <ArrowLeftOutlined /> Retour
     </Link>
     <Title level={2}>Enregistrez les informations de votre propriété</Title>
     <Form
      name="property_form"
      layout="vertical"
      onFinish={onFinish}
      size="large"
      form={form}
      autoComplete="on"
      initialValues={{
       ['checkInTime']: dayjs('12:00', format),
       ['checkOutTime']: dayjs('12:00', format),
      }}
     >
      <Collapse
       forceRender
       items={[
        {
         key: '1',
         label: 'Nom et Adresse de votre logement',
         children: <NameAdrress onSubmit={handleNameAddressSubmit} />,
        },
       ]}
      />
      <br />
      <Collapse
       forceRender
       items={[
        {
         key: '2',
         label: 'Arrivée et départ',
         children: (
          <>
           <CheckInForm form={form} />
           <CheckOutForm form={form} />
          </>
         ),
        },
       ]}
      />
      <br />
      <Collapse
       forceRender
       items={[
        {
         key: '3',
         label: 'Équipements de votre logement',
         children: <Equipments />,
        },
       ]}
      />
      <br />
      <Collapse
       forceRender
       items={[
        {
         key: '4',
         label: 'Photos',
         children: (
          <Photos onPhotosChange={handlePhotosChange} photos={photos} />
         ),
        },
       ]}
      />
      <br />
      <Collapse
       forceRender
       items={[
        {
         key: '5',
         label: 'Manuel de la maison',
         children: <HouseManual />,
        },
       ]}
      />
      <br />
      <Row gutter={[24, 0]}>
       <Col xs={24} md={{ span: 6, offset: 18 }}>
        <Form.Item>
         <Button
          type="primary"
          htmlType="submit"
          style={{ width: '100%' }}
          loading={loading}
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

export default PropertyPost;
