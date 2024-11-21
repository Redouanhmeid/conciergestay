import React, { useState, useEffect } from 'react';
import {
 Spin,
 Layout,
 Form,
 Typography,
 Row,
 Col,
 Checkbox,
 Button,
} from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import queryString from 'query-string';
import useUpdateProperty from '../../../hooks/useUpdateProperty';
import useProperty from '../../../hooks/useProperty';
import Head from '../../../components/common/header';
import Foot from '../../../components/common/footer';

const { Content } = Layout;
const { Title, Text } = Typography;

const EditEquipement = () => {
 const location = useLocation();
 const { id } = queryString.parse(location.search);
 const navigate = useNavigate();
 const [form] = Form.useForm();
 const { updatePropertyAmenities, isLoading, success } = useUpdateProperty(id);
 const { property, loading, fetchProperty } = useProperty();

 const handleSubmit = async (values) => {
  try {
   await updatePropertyAmenities(values);
   navigate(-1);
  } catch (error) {
   console.error('Error:', error);
  }
 };

 useEffect(() => {
  fetchProperty(id);
 }, [loading]);

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
      Retour
     </Button>
     <Title level={3}>Modifier le manuel de la maison</Title>
     <Form
      name="editEquipement"
      form={form}
      onFinish={handleSubmit}
      initialValues={property}
      layout="vertical"
     >
      <Row gutter={[16, 8]}>
       <Col xs={24} md={24}>
        <Form.Item name="basicAmenities">
         <Checkbox.Group>
          <Row gutter={[24, 0]}>
           <Col xs={24}>
            {/* Salle de bain */}
            <Row>
             <Col xs={24}>
              <Text strong>
               <br />
               Salle de bain
              </Text>
             </Col>
             <Col xs={12} md={8}>
              <Checkbox value="shower">
               <i className="fa-light fa-shower fa-xl" /> Douche
              </Checkbox>
             </Col>
             <Col xs={12} md={8}>
              <Checkbox value="jacuzzi">
               <i className="fa-light fa-hot-tub-person fa-xl" /> Jacuzzi
              </Checkbox>
             </Col>
             <Col xs={12} md={8}>
              <Checkbox value="bathtub">
               <i className="fa-light fa-bath fa-xl" /> Baignoire
              </Checkbox>
             </Col>
            </Row>
            {/* Chambre et linge */}
            <Row>
             <Col xs={24}>
              <Text strong>
               <br />
               Chambre et linge
              </Text>
             </Col>
             <Col xs={12} md={8}>
              <Checkbox value="washingMachine">
               <i className="fa-light fa-washing-machine fa-xl" /> Machine à
               laver
              </Checkbox>
             </Col>
             <Col xs={12} md={8}>
              <Checkbox value="dryerheat">
               <i className="fa-light fa-dryer-heat fa-xl" /> Sèche-linge
              </Checkbox>
             </Col>
             <Col xs={12} md={8}>
              <Checkbox value="vacuum">
               <i className="fa-light fa-vacuum fa-xl" /> Aspirateur
              </Checkbox>
             </Col>
             <Col xs={12} md={8}>
              <Checkbox value="vault">
               <i className="fa-light fa-vault fa-xl" /> Coffre-fort
              </Checkbox>
             </Col>
             <Col xs={12} md={8}>
              <Checkbox value="babybed">
               <i className="fa-light fa-baby fa-xl" /> Lit bébé
              </Checkbox>
             </Col>
            </Row>
            {/* Divertissement */}
            <Row>
             <Col xs={24}>
              <Text strong>
               <br />
               Divertissement
              </Text>
             </Col>
             <Col xs={12} md={8}>
              <Checkbox value="television">
               <i className="fa-light fa-tv fa-xl" /> Télévision
              </Checkbox>
             </Col>
             <Col xs={12} md={8}>
              <Checkbox value="speaker">
               <i className="fa-light fa-speaker fa-xl" /> Système audio
              </Checkbox>
             </Col>
             <Col xs={12} md={8}>
              <Checkbox value="gameconsole">
               <i className="fa-light fa-gamepad-modern fa-xl" /> Console de
               jeux
              </Checkbox>
             </Col>
            </Row>
            {/* Cuisine et salle à manger */}
            <Row>
             <Col xs={24}>
              <Text strong>
               <br />
               Cuisine
              </Text>
             </Col>
             <Col xs={12} md={8}>
              <Checkbox value="oven">
               <i className="fa-light fa-oven fa-xl" /> Four
              </Checkbox>
             </Col>
             <Col xs={12} md={8}>
              <Checkbox value="microwave">
               <i className="fa-light fa-microwave fa-xl" /> Micro-ondes
              </Checkbox>
             </Col>
             <Col xs={12} md={8}>
              <Checkbox value="coffeemaker">
               <i className="fa-light fa-coffee-pot fa-xl" /> cafétière
              </Checkbox>
             </Col>
             <Col xs={12} md={8}>
              <Checkbox value="fridge">
               <i className="fa-light fa-refrigerator fa-xl" /> Réfrigérateur
              </Checkbox>
             </Col>
             <Col xs={12} md={8}>
              <Checkbox value="fireburner">
               <i className="fa-light fa-fire-burner fa-xl" /> Cuisinière
              </Checkbox>
             </Col>
            </Row>
            {/* Chauffage et climatisation */}
            <Row>
             <Col xs={24}>
              <Text strong>
               <br />
               Chauffage et climatisation
              </Text>
             </Col>
             <Col xs={10} md={8}>
              <Checkbox value="heating">
               <i className="fa-light fa-temperature-arrow-up fa-xl" />{' '}
               Chauffage
              </Checkbox>
             </Col>
             <Col xs={14} md={8}>
              <Checkbox value="airConditioning">
               <i className="fa-light fa-snowflake fa-xl" /> Climatisation
              </Checkbox>
             </Col>
             <Col xs={10} md={8}>
              <Checkbox value="fireplace">
               <i className="fa-light fa-fireplace fa-xl" /> Cheminée
              </Checkbox>
             </Col>
             <Col xs={14} md={8}>
              <Checkbox value="ceilingfan">
               <i className="fa-light fa-fan fa-xl" /> Ventilateur de plafond
              </Checkbox>
             </Col>
             <Col xs={14} md={8}>
              <Checkbox value="tablefan">
               <i className="fa-light fa-fan-table fa-xl" /> Ventilateur de
               table
              </Checkbox>
             </Col>
            </Row>
            {/* Sécurité à la maison */}
            <Row>
             <Col xs={24}>
              <Text strong>
               <br />
               Sécurité à la maison
              </Text>
             </Col>
             <Col xs={24} md={8}>
              <Checkbox value="fingerprint">
               <i className="fa-light fa-fingerprint fa-xl" /> Serrure
               biometrique à empreinte digitale
              </Checkbox>
             </Col>
             <Col xs={12} md={8}>
              <Checkbox value="lockbox">
               <i className="fa-light fa-lock-hashtag fa-xl" /> Boite à serrure
              </Checkbox>
             </Col>
             <Col xs={12} md={8}>
              <Checkbox value="parkingaccess">
               <i className="fa-light fa-square-parking fa-xl" /> Accès parking
              </Checkbox>
             </Col>
            </Row>
            {/* Internet et bureau  */}
            <Row>
             <Col xs={24}>
              <Text strong>
               <br />
               Internet et bureau
              </Text>
             </Col>
             <Col xs={24} md={8}>
              <Checkbox value="wifi">
               <i className="fa-light fa-wifi fa-xl" /> Wifi
              </Checkbox>
             </Col>
             <Col xs={24} md={8}>
              <Checkbox value="dedicatedworkspace">
               <i className="fa-light fa-chair-office fa-xl" /> Espace dédié de
               travail
              </Checkbox>
             </Col>
            </Row>
            {/* Parking et installations */}
            <Row>
             <Col xs={24}>
              <Text strong>
               <br />
               Parking et installations
              </Text>
             </Col>
             <Col xs={12} md={8}>
              <Checkbox value="freeParking">
               <i className="fa-light fa-circle-parking fa-xl" /> Parking
               gratuit
              </Checkbox>
             </Col>
             <Col xs={12} md={8}>
              <Checkbox value="paidParking">
               <i className="fa-light fa-square-parking fa-xl" /> Stationnement
               payant
              </Checkbox>
             </Col>
             <Col xs={12} md={8}>
              <Checkbox value="pool">
               <i className="fa-light fa-water-ladder fa-xl" /> Piscine
              </Checkbox>
             </Col>
             <Col xs={12} md={8}>
              <Checkbox value="garbageCan">
               <i className="fa-light fa-trash-can fa-xl" /> Benne à ordures
              </Checkbox>
             </Col>
            </Row>
           </Col>
          </Row>
         </Checkbox.Group>
        </Form.Item>
        <Button type="primary" htmlType="submit" loading={isLoading}>
         {success ? 'Mis à jour!' : 'Enregistrer les équipements'}
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

export default EditEquipement;
