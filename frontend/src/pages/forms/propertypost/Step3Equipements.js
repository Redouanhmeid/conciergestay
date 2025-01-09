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
import { useTranslation } from '../../../context/TranslationContext';

const { Content } = Layout;
const { Title, Text } = Typography;

const Step3Equipements = ({ next, prev, values }) => {
 const { t } = useTranslation();
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
    message.error(t('amenity.updateError'));
   }
  } catch (error) {
   console.error('Error submitting form:', error);
   message.error(error.message || t('property.updateError'));
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
      <Title level={2}>{t('property.amenities.title')}</Title>
      <Row gutter={[16, 8]}>
       <Col xs={24} md={24}>
        <Form.Item name="basicAmenities">
         <Checkbox.Group onChange={onChangeBasicAmenities}>
          <Row gutter={[24, 0]}>
           <Col xs={24}>
            {/* Bathroom */}
            <Row>
             <Col xs={24}>
              <Text strong>
               <br />
               {t('amenity.categories.bathroom')}
              </Text>
             </Col>
             <Col xs={12} md={8}>
              <Checkbox value="shower">
               <i className="fa-light fa-shower fa-xl" /> {t('amenity.shower')}
              </Checkbox>
             </Col>
             <Col xs={12} md={8}>
              <Checkbox value="jacuzzi">
               <i className="fa-light fa-hot-tub-person fa-xl" />{' '}
               {t('amenity.jacuzzi')}
              </Checkbox>
             </Col>
             <Col xs={12} md={8}>
              <Checkbox value="bathtub">
               <i className="fa-light fa-bath fa-xl" /> {t('amenity.bathtub')}
              </Checkbox>
             </Col>
            </Row>
            {/* Bedroom and Linen */}
            <Row>
             <Col xs={24}>
              <Text strong>
               <br />
               {t('amenity.categories.bedroomLinen')}
              </Text>
             </Col>
             <Col xs={12} md={8}>
              <Checkbox value="washingMachine">
               <i className="fa-light fa-washing-machine fa-xl" />{' '}
               {t('amenity.washingMachine')}
              </Checkbox>
             </Col>
             <Col xs={12} md={8}>
              <Checkbox value="dryerheat">
               <i className="fa-light fa-dryer-heat fa-xl" />{' '}
               {t('amenity.dryerheat')}
              </Checkbox>
             </Col>
             <Col xs={12} md={8}>
              <Checkbox value="vacuum">
               <i className="fa-light fa-vacuum fa-xl" /> {t('amenity.vacuum')}
              </Checkbox>
             </Col>
             <Col xs={12} md={8}>
              <Checkbox value="vault">
               <i className="fa-light fa-vault fa-xl" /> {t('amenity.vault')}
              </Checkbox>
             </Col>
             <Col xs={12} md={8}>
              <Checkbox value="babybed">
               <i className="fa-light fa-baby fa-xl" /> {t('amenity.babybed')}
              </Checkbox>
             </Col>
            </Row>
            {/* Entertainment */}
            <Row>
             <Col xs={24}>
              <Text strong>
               <br />
               {t('amenity.categories.entertainment')}
              </Text>
             </Col>
             <Col xs={12} md={8}>
              <Checkbox value="television">
               <i className="fa-light fa-tv fa-xl" /> {t('amenity.television')}
              </Checkbox>
             </Col>
             <Col xs={12} md={8}>
              <Checkbox value="speaker">
               <i className="fa-light fa-speaker fa-xl" />{' '}
               {t('amenity.speaker')}
              </Checkbox>
             </Col>
             <Col xs={12} md={8}>
              <Checkbox value="gameconsole">
               <i className="fa-light fa-gamepad-modern fa-xl" />{' '}
               {t('amenity.gameconsole')}
              </Checkbox>
             </Col>
            </Row>
            {/* Kitchen */}
            <Row>
             <Col xs={24}>
              <Text strong>
               <br />
               {t('amenity.categories.kitchen')}
              </Text>
             </Col>
             <Col xs={12} md={8}>
              <Checkbox value="oven">
               <i className="fa-light fa-oven fa-xl" /> {t('amenity.oven')}
              </Checkbox>
             </Col>
             <Col xs={12} md={8}>
              <Checkbox value="microwave">
               <i className="fa-light fa-microwave fa-xl" />{' '}
               {t('amenity.microwave')}
              </Checkbox>
             </Col>
             <Col xs={12} md={8}>
              <Checkbox value="coffeemaker">
               <i className="fa-light fa-coffee-pot fa-xl" />{' '}
               {t('amenity.coffeemaker')}
              </Checkbox>
             </Col>
             <Col xs={12} md={8}>
              <Checkbox value="fridge">
               <i className="fa-light fa-refrigerator fa-xl" />{' '}
               {t('amenity.fridge')}
              </Checkbox>
             </Col>
             <Col xs={12} md={8}>
              <Checkbox value="fireburner">
               <i className="fa-light fa-fire-burner fa-xl" />{' '}
               {t('amenity.fireburner')}
              </Checkbox>
             </Col>
            </Row>
            {/*  Heating and Cooling */}
            <Row>
             <Col xs={24}>
              <Text strong>
               <br />
               {t('amenity.categories.heatingCooling')}
              </Text>
             </Col>
             <Col xs={10} md={8}>
              <Checkbox value="heating">
               <i className="fa-light fa-temperature-arrow-up fa-xl" />{' '}
               {t('amenity.heating')}
              </Checkbox>
             </Col>
             <Col xs={14} md={8}>
              <Checkbox value="airConditioning">
               <i className="fa-light fa-snowflake fa-xl" />{' '}
               {t('amenity.airConditioning')}
              </Checkbox>
             </Col>
             <Col xs={10} md={8}>
              <Checkbox value="fireplace">
               <i className="fa-light fa-fireplace fa-xl" />{' '}
               {t('amenity.fireplace')}
              </Checkbox>
             </Col>
             <Col xs={14} md={8}>
              <Checkbox value="ceilingfan">
               <i className="fa-light fa-fan fa-xl" />
               {t('amenity.ceilingfan')}
              </Checkbox>
             </Col>
             <Col xs={14} md={8}>
              <Checkbox value="tablefan">
               <i className="fa-light fa-fan-table fa-xl" />{' '}
               {t('amenity.tablefan')}
              </Checkbox>
             </Col>
            </Row>
            {/* Home Security */}
            <Row>
             <Col xs={24}>
              <Text strong>
               <br />
               {t('amenity.categories.homeSecurity')}
              </Text>
             </Col>
             <Col xs={24} md={8}>
              <Checkbox value="fingerprint">
               <i className="fa-light fa-fingerprint fa-xl" />{' '}
               {t('amenity.fingerprint')}
              </Checkbox>
             </Col>
             <Col xs={12} md={8}>
              <Checkbox value="lockbox">
               <i className="fa-light fa-lock-hashtag fa-xl" />{' '}
               {t('amenity.lockbox')}
              </Checkbox>
             </Col>
             <Col xs={12} md={8}>
              <Checkbox value="parkingaccess">
               <i className="fa-light fa-square-parking fa-xl" />{' '}
               {t('amenity.parkingaccess')}
              </Checkbox>
             </Col>
            </Row>
            {/* Internet and Office */}
            <Row>
             <Col xs={24}>
              <Text strong>
               <br />
               {t('amenity.categories.internetOffice')}
              </Text>
             </Col>
             <Col xs={24} md={8}>
              <Checkbox value="wifi">
               <i className="fa-light fa-wifi fa-xl" /> {t('amenity.wifi')}
              </Checkbox>
             </Col>
             <Col xs={24} md={8}>
              <Checkbox value="dedicatedworkspace">
               <i className="fa-light fa-chair-office fa-xl" />{' '}
               {t('amenity.dedicatedworkspace')}
              </Checkbox>
             </Col>
            </Row>
            {/* Parking and Facilities */}
            <Row>
             <Col xs={24}>
              <Text strong>
               <br />
               {t('amenity.categories.parkingFacilities')}
              </Text>
             </Col>
             <Col xs={12} md={8}>
              <Checkbox value="freeParking">
               <i className="fa-light fa-circle-parking fa-xl" />{' '}
               {t('amenity.freeParking')}
              </Checkbox>
             </Col>
             <Col xs={12} md={8}>
              <Checkbox value="paidParking">
               <i className="fa-light fa-square-parking fa-xl" />{' '}
               {t('amenity.paidParking')}
              </Checkbox>
             </Col>
             <Col xs={12} md={8}>
              <Checkbox value="pool">
               <i className="fa-light fa-water-ladder fa-xl" />{' '}
               {t('amenity.pool')}
              </Checkbox>
             </Col>
             <Col xs={12} md={8}>
              <Checkbox value="garbageCan">
               <i className="fa-light fa-trash-can fa-xl" />{' '}
               {t('amenity.garbageCan')}
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
          {t('button.continue')} {<ArrowRightOutlined />}
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
