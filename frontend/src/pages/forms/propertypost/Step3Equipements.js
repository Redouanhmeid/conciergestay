import React, { useState } from 'react';
import {
 Layout,
 Form,
 Typography,
 Row,
 Col,
 Checkbox,
 Button,
 message,
} from 'antd';
import Head from '../../../components/common/header';
import Foot from '../../../components/common/footer';
import { ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons';
import useUpdateProperty from '../../../hooks/useUpdateProperty';

const { Content } = Layout;
const { Title, Text } = Typography;

const Step3Equipements = ({ next, prev, values }) => {
 const {
  updatePropertyAmenities,
  isLoading: amenitiesLoading,
  error: amenitiesError,
  success,
 } = useUpdateProperty(values.propertyId);

 const [loading, setLoading] = useState(false);
 const [BasicAmenities, setBasicAmenities] = useState([]);

 const onChangeBasicAmenities = (checkedvalues) => {
  setBasicAmenities(checkedvalues);
 };

 const submitFormData = async () => {
  if (loading || amenitiesLoading) {
   return; // Prevent multiple submissions while loading
  }

  try {
   setLoading(true);

   const amenitiesData = {
    basicAmenities: BasicAmenities,
   };

   try {
    await updatePropertyAmenities(amenitiesData);
    // If update successful, update values and proceed
    values.basicAmenities = BasicAmenities;
    next();
   } catch (error) {
    message.error(
     'Une erreur est survenue lors de la mise à jour des équipements'
    );
   }
  } catch (error) {
   console.error('Error submitting form:', error);
   message.error(
    error.message ||
     'Impossible de mettre à jour les informations sur la propriété'
   );
  } finally {
   setLoading(false);
  }
 };

 const isSubmitting = loading || amenitiesLoading;

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
      initialValues={{
       basicAmenities: values.basicAmenities || [],
      }}
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
          disabled={isSubmitting}
         />
        </Form.Item>
       </Col>
       <Col xs={16} md={3}>
        <Form.Item>
         <Button
          type="primary"
          htmlType="submit"
          style={{ width: '100%' }}
          loading={isSubmitting}
          disabled={isSubmitting}
         >
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
