import React, { useState } from 'react';
import { Layout, Form, Typography, Row, Col, Checkbox, Button } from 'antd';
import Head from '../../../components/common/header';
import Foot from '../../../components/common/footer';
import { ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons';

const { Content } = Layout;
const { Title, Text } = Typography;

const Step3Equipements = ({ next, prev, values }) => {
 const [BasicAmenities, setBasicAmenities] = useState([]);

 const submitFormData = () => {
  values.basicAmenities = BasicAmenities;
  next();
 };
 const onChangeBasicAmenities = (checkedvalues) => {
  setBasicAmenities(checkedvalues);
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
      <Row gutter={[16, 8]}>
       <Col xs={24} md={24}>
        <Form.Item name="basicAmenities">
         <Checkbox.Group onChange={onChangeBasicAmenities}>
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
              <Checkbox value="soap">
               <i className="fa-light fa-soap fa-xl" /> Savon
              </Checkbox>
             </Col>
             <Col xs={12} md={8}>
              <Checkbox value="hairdryer">
               <i className="fa-light fa-gun-squirt fa-xl" /> Sèche-cheveux
              </Checkbox>
             </Col>
             <Col xs={12} md={8}>
              <Checkbox value="shampoo">
               <i className="fa-light fa-bottle-water fa-xl" /> Shampooing
              </Checkbox>
             </Col>
             <Col xs={12} md={8}>
              <Checkbox value="hotwater">
               <i className="fa-light fa-tank-water fa-xl" /> Eau chaude
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
              <Checkbox value="basicequipement" style={{ lineHeight: 1 }}>
               <i className="fa-light fa-toilet-paper-blank fa-xl" />{' '}
               Équipements de base
               <br />
               <Text type="secondary">
                Serviettes, draps, savon et papier toilette
               </Text>
              </Checkbox>
             </Col>
             <Col xs={12} md={8}>
              <Checkbox value="cabinetfiling">
               <i className="fa-light fa-cabinet-filing fa-xl" /> Classeur
               d'armoire
              </Checkbox>
             </Col>
             <Col xs={12} md={8}>
              <Checkbox value="blankets">
               <i className="fa-light fa-blanket fa-xl" /> Couvertures
              </Checkbox>
             </Col>
             <Col xs={12} md={8}>
              <Checkbox value="vault">
               <i className="fa-light fa-vault fa-xl" /> Coffre-fort
              </Checkbox>
             </Col>
             <Col xs={12} md={8}>
              <Checkbox value="vacuum">
               <i className="fa-light fa-vacuum fa-xl" /> Aspirateur
              </Checkbox>
             </Col>
             <Col xs={12} md={8}>
              <Checkbox value="mattresspillow">
               <i className="fa-light fa-mattress-pillow fa-xl" /> Matelas
               oreiller
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
              <Checkbox value="ethernet">
               <i className="fa-light fa-ethernet fa-xl" /> Connexion Ethernet
              </Checkbox>
             </Col>
             <Col xs={12} md={8}>
              <Checkbox value="speaker">
               <i className="fa-light fa-speaker fa-xl" /> Système audio
               Bluetooth
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
             <Col xs={12} md={8}>
              <Checkbox value="heating">
               <i className="fa-light fa-temperature-arrow-up fa-xl" />{' '}
               Chauffage
              </Checkbox>
             </Col>
             <Col xs={12} md={8}>
              <Checkbox value="airConditioning">
               <i className="fa-light fa-snowflake fa-xl" /> Climatisation
              </Checkbox>
             </Col>
             <Col xs={12} md={8}>
              <Checkbox value="fireplace">
               <i className="fa-light fa-fireplace fa-xl" /> Cheminée
              </Checkbox>
             </Col>
             <Col xs={12} md={8}>
              <Checkbox value="ceilingfan">
               <i className="fa-light fa-fan fa-xl" /> Ventilateur de plafond
              </Checkbox>
             </Col>
             <Col xs={12} md={8}>
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
             <Col xs={12} md={8}>
              <Checkbox value="fingerprint">
               <i className="fa-light fa-fingerprint fa-xl" /> Serrure
               biometrique à empreinte digitale
              </Checkbox>
             </Col>
             <Col xs={12} md={8}>
              <Checkbox value="cameras">
               <i className="fa-light fa-camera-cctv fa-xl" /> Caméras de
               surveillance extérieures
              </Checkbox>
             </Col>
             <Col xs={12} md={8}>
              <Checkbox value="extinguisher">
               <i className="fa-light fa-fire-extinguisher fa-xl" /> Extincteur
              </Checkbox>
             </Col>
             <Col xs={12} md={8}>
              <Checkbox value="sensor">
               <i className="fa-light fa-sensor fa-xl" /> Détecteur de fumée
              </Checkbox>
             </Col>
             <Col xs={12} md={8}>
              <Checkbox value="kitmedical">
               <i className="fa-light fa-kit-medical fa-xl" /> Kit de premiers
               secours
              </Checkbox>
             </Col>
            </Row>
            {/* Cuisine et salle à manger */}
            <Row>
             <Col xs={24}>
              <Text strong>
               <br />
               Cuisine et salle à manger
              </Text>
             </Col>
             <Col xs={12} md={8}>
              <Checkbox value="kitchen" style={{ lineHeight: 1 }}>
               <i className="fa-light fa-utensils fa-xl" /> Cuisine
               <br />
               <Text type="secondary">
                Espace où les voyageurs peuvent cuisiner
               </Text>
              </Checkbox>
             </Col>
             <Col xs={12} md={8}>
              <Checkbox value="fridge">
               <i className="fa-light fa-refrigerator fa-xl" /> Réfrigérateur
              </Checkbox>
             </Col>
             <Col xs={12} md={8}>
              <Checkbox value="microwave">
               <i className="fa-light fa-microwave fa-xl" /> Microwave
              </Checkbox>
             </Col>
             <Col xs={12} md={8}>
              <Checkbox value="oven">
               <i className="fa-light fa-oven fa-xl" /> Four à micro-ondes
              </Checkbox>
             </Col>
             <Col xs={12} md={8}>
              <Checkbox value="kitchenset" style={{ lineHeight: 1 }}>
               <i className="fa-light fa-kitchen-set fa-xl" /> Équipements de
               cuisine de base
               <br />
               <Text type="secondary">
                Casseroles et poêles, Bols, tasses, etc
               </Text>
              </Checkbox>
             </Col>
             <Col xs={12} md={8}>
              <Checkbox value="blender">
               <i className="fa-light fa-blender fa-xl" /> Mixeur
              </Checkbox>
             </Col>
             <Col xs={12} md={8}>
              <Checkbox value="fireburner">
               <i className="fa-light fa-fire-burner fa-xl" /> Cuisinière à gaz
              </Checkbox>
             </Col>
             <Col xs={12} md={8}>
              <Checkbox value="coffeepot">
               <i className="fa-light fa-coffee-pot fa-xl" /> Café
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
             <Col xs={12} md={8}>
              <Checkbox value="wifi">
               <i className="fa-light fa-wifi fa-xl" /> Wifi
              </Checkbox>
             </Col>
             <Col xs={12} md={8}>
              <Checkbox value="dedicatedworkspace">
               <i className="fa-light fa-chair-office fa-xl" /> Espace de
               travail dédié
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
               payant dans la rue
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
