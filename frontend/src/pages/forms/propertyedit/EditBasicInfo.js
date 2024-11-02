import React, { useState, useEffect } from 'react';
import {
 Layout,
 Row,
 Col,
 Spin,
 Form,
 Input,
 Button,
 Typography,
 Radio,
} from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import queryString from 'query-string';
import useUpdateProperty from '../../../hooks/useUpdateProperty';
import useGetProperty from '../../../hooks/useGetProperty';
import Head from '../../../components/common/header';
import Foot from '../../../components/common/footer';

const { Content } = Layout;
const { Title } = Typography;

const EditBasicInfo = () => {
 const location = useLocation();
 const { id } = queryString.parse(location.search);
 const navigate = useNavigate();
 const [form] = Form.useForm();
 const { updatePropertyBasicInfo, isLoading, success } = useUpdateProperty(id);
 const { property, loading } = useGetProperty(id);
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

 useEffect(() => {
  if (!loading && property) {
   if (property.type == 'house') {
    setCheckedType('house');
   } else if (property.type == 'apartment') {
    setCheckedType('apartment');
   } else if (property.type == 'guesthouse') {
    setCheckedType('guesthouse');
   }
   form.setFieldsValue({
    name: property.name,
    description: property.description,
    airbnbUrl: property.airbnbUrl,
    bookingUrl: property.bookingUrl,
   });
  }
 }, [loading, property, form]);

 const handleSubmit = (values) => {
  updatePropertyBasicInfo(values);
 };
 const handleRadioChange = (e) => {
  setCheckedType(e.target.value);
 };

 if (loading) {
  return (
   <div className="loading">
    <Spin size="large" />
   </div>
  );
 }
 return (
  <Layout className="contentStyle">
   <Head />
   <Layout>
    <Content className="container-fluid">
     <Button
      type="default"
      shape="round"
      icon={<ArrowLeftOutlined />}
      onClick={() => navigate(-1)}
     >
      Retour
     </Button>
     <Title level={3}>
      Modifier les informations de base de votre propriété
     </Title>
     <Form
      name="editBasicInfo"
      form={form}
      onFinish={handleSubmit}
      initialValues={property}
      layout="vertical"
     >
      <Row gutter={[16, 8]}>
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
       <Col xs={24}>
        <Form.Item
         name="name"
         label="Nom"
         rules={[{ required: true, message: 'Veuillez saisir un nom!' }]}
        >
         <Input />
        </Form.Item>
       </Col>
       <Col xs={24}>
        <Form.Item
         name="description"
         label="Description"
         rules={[
          { required: true, message: 'Veuillez saisir une description!' },
         ]}
        >
         <Input.TextArea showCount maxLength={255} />
        </Form.Item>
       </Col>
       <Col xs={24} md={12}>
        <Form.Item name="airbnbUrl" label="Airbnb URL">
         <Input />
        </Form.Item>
       </Col>
       <Col xs={24} md={12}>
        <Form.Item name="bookingUrl" label="Booking URL">
         <Input />
        </Form.Item>
       </Col>
       <Col xs={24}>
        <Button type="primary" htmlType="submit" loading={isLoading}>
         {success ? 'Mis à jour!' : 'Enregistrer les informations de base'}
        </Button>
       </Col>
      </Row>
     </Form>
    </Content>
   </Layout>
   <Foot />
  </Layout>
 );
};

export default EditBasicInfo;
