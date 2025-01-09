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
import useProperty from '../../../hooks/useProperty';
import Head from '../../../components/common/header';
import Foot from '../../../components/common/footer';
import { useTranslation } from '../../../context/TranslationContext';

const { Content } = Layout;
const { Title } = Typography;

const EditBasicInfo = () => {
 const { t } = useTranslation();
 const location = useLocation();
 const { id } = queryString.parse(location.search);
 const navigate = useNavigate();
 const [form] = Form.useForm();
 const { updatePropertyBasicInfo, isLoading, success } = useUpdateProperty(id);
 const { property, loading, fetchProperty } = useProperty();
 const [checkedType, setCheckedType] = useState(null);

 const propertyTypes = [
  {
   label: t('type.house'),
   value: 'house',
   icon: <i className="Radioicon fa-light fa-house"></i>,
  },
  {
   label: t('type.apartment'),
   value: 'apartment',
   icon: <i className="Radioicon fa-light fa-building"></i>,
  },
  {
   label: t('type.guesthouse'),
   value: 'guesthouse',
   icon: <i className="Radioicon fa-light fa-house-user"></i>,
  },
 ];

 useEffect(() => {
  fetchProperty(id);
 }, [loading]);

 useEffect(() => {
  if (!loading && property) {
   setCheckedType(property.type);
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

 if (loading || property.length === 0) {
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
      {t('button.back')}
     </Button>
     <Title level={3}>{t('property.edit.title')}</Title>
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
         label={t('property.basic.type')}
         name="type"
         rules={[
          {
           required: true,
           message: t('validation.selectType'),
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
         label={t('property.basic.name')}
         rules={[{ required: true, message: t('validation.enterName') }]}
        >
         <Input />
        </Form.Item>
       </Col>
       <Col xs={24}>
        <Form.Item
         name="description"
         label={t('property.basic.description')}
         rules={[{ required: true, message: t('validation.enterDescription') }]}
        >
         <Input.TextArea showCount maxLength={500} rows={6} />
        </Form.Item>
       </Col>
       <Col xs={24} md={12}>
        <Form.Item name="airbnbUrl" label={t('property.basic.airbnbUrl')}>
         <Input />
        </Form.Item>
       </Col>
       <Col xs={24} md={12}>
        <Form.Item name="bookingUrl" label={t('property.basic.bookingUrl')}>
         <Input />
        </Form.Item>
       </Col>
       <Col xs={24}>
        <Button type="primary" htmlType="submit" loading={isLoading}>
         {success ? t('messages.updateSuccess') : t('button.save')}
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
