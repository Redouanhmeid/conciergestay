import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
 Spin,
 Layout,
 Row,
 Col,
 Form,
 Input,
 Typography,
 Checkbox,
 Button,
} from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import queryString from 'query-string';
import useGetProperty from '../../../hooks/useGetProperty';
import useUpdateProperty from '../../../hooks/useUpdateProperty';
import Head from '../../../components/common/header';
import Foot from '../../../components/common/footer';

const { Content } = Layout;
const { Title, Text } = Typography;
const { TextArea } = Input;

const EditHouseRules = () => {
 const location = useLocation();
 const { id } = queryString.parse(location.search);
 const { property, loading } = useGetProperty(id);
 const navigate = useNavigate();
 const [form] = Form.useForm();
 const { updatePropertyRules, isLoading, success } = useUpdateProperty(id);

 const [showAdditionalRules, setShowAdditionalRules] = useState(false);
 const [additionalRules, setAdditionalRules] = useState('');

 const handleSubmit = (values) => {
  if (showAdditionalRules) {
   values.houseRules.push(`additionalRules: ${additionalRules}`);
  }
  updatePropertyRules(values);
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
     <Title level={3}>Modifier les règles de la maison:</Title>
     <Form
      name="editHouseRules"
      form={form}
      onFinish={handleSubmit}
      initialValues={property}
      layout="vertical"
     >
      <Form.Item name="houseRules">
       <Checkbox.Group>
        <Row gutter={[24, 0]}>
         <Col xs={24}>
          <Checkbox value="noNoise">
           <i className="fa-light fa-volume-slash fa-xl" /> Pas de bruit après
           23h
          </Checkbox>
         </Col>
         <Col xs={24}>
          <Checkbox value="noFoodDrinks">
           <i className="fa-light fa-utensils-slash fa-xl" /> Pas de nourriture
           ni de boissons dans les chambres à coucher
          </Checkbox>
         </Col>
         <Col xs={24}>
          <Checkbox value="noParties">
           <i className="fa-light fa-champagne-glasses fa-xl" /> Pas de fêtes ni
           d'événements
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
      {showAdditionalRules && (
       <Col xs={24} md={24}>
        <Form.Item label="Règles supplémentaires" value="AdditionalRules">
         <TextArea
          rows={4}
          value={additionalRules}
          onChange={(e) => setAdditionalRules(e.target.value)}
         />
        </Form.Item>
       </Col>
      )}
      <Button type="primary" htmlType="submit" loading={isLoading}>
       {success ? 'Mis à jour!' : 'Enregistrer les règles de la maison'}
      </Button>
     </Form>
    </Content>
   </Layout>
   <Foot />
  </Layout>
 );
};

export default EditHouseRules;
