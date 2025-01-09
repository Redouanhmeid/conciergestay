import React, { useState, useEffect } from 'react';
import {
 Spin,
 Layout,
 Form,
 Input,
 Row,
 Col,
 TimePicker,
 Typography,
 Button,
 Checkbox,
 message,
} from 'antd';
import dayjs from 'dayjs';
import { ArrowLeftOutlined, PlusOutlined } from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import queryString from 'query-string';
import useUpdateProperty from '../../../hooks/useUpdateProperty';
import useProperty from '../../../hooks/useProperty';
import Head from '../../../components/common/header';
import Foot from '../../../components/common/footer';
import { useTranslation } from '../../../context/TranslationContext';

const { Content } = Layout;
const { Title } = Typography;
const { TextArea } = Input;
const format = 'HH:mm';

// Default check-out times that make more business sense
const DEFAULT_CHECK_OUT_TIME = dayjs().hour(12).minute(0); // 12:00 AM

const TimePickerWithDefault = ({ value, onChange, name, label }) => {
 const { t } = useTranslation();
 // Internal state to track if user has made a selection
 const [hasUserSelected, setHasUserSelected] = useState(
  value && value.format('HH:mm') !== '00:00'
 );

 const handleTimeChange = (time) => {
  setHasUserSelected(true);
  onChange?.(time);
 };

 const handleClear = () => {
  setHasUserSelected(false);
  // When cleared, reset to the appropriate default time
  onChange?.(DEFAULT_CHECK_OUT_TIME);
 };

 return (
  <Form.Item label={label} name={name}>
   <TimePicker
    format="HH:mm"
    showNow={false}
    size="large"
    onChange={handleTimeChange}
    onClear={handleClear}
    allowClear={false}
    value={value}
    placeholder={t('timePicker.selectCheckOut')}
   />
  </Form.Item>
 );
};

const EditCheckOut = () => {
 const { t } = useTranslation();
 const location = useLocation();
 const { id } = queryString.parse(location.search);
 const navigate = useNavigate();
 const [form] = Form.useForm();
 const { updatePropertyCheckOut, isLoading, success, error } =
  useUpdateProperty(id);
 const { property, loading, fetchProperty } = useProperty();

 const [checkOutTime, setCheckOutTime] = useState(null);

 useEffect(() => {
  fetchProperty(id);
 }, [loading]);

 // Same time handling logic as in EditProperty
 useEffect(() => {
  if (!loading && property) {
   form.setFieldsValue({
    ...property,
    checkOutTime: dayjs(property.checkOutTime),
   });
  }
 }, [loading, property]);

 const handleSubmit = async (values) => {
  try {
   await updatePropertyCheckOut(values);
  } catch (err) {
   console.error('Form submission error:', err);
  }
 };

 useEffect(() => {
  if (success) {
   message.success(t('messages.updateSuccess'));
   navigate(-1);
  }
  if (error) {
   message.error(error || t('messages.updateError'));
  }
 }, [success, error, navigate, t]);

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
     <Title level={3}>
      {t('checkOut.editTitle', 'Modifier les informations de départ')}
     </Title>
     <Form
      name="editCheckOut"
      form={form}
      onFinish={handleSubmit}
      layout="vertical"
     >
      <Row gutter={[16, 8]}>
       <Col xs={24} md={24}>
        <TimePickerWithDefault
         value={checkOutTime}
         onChange={setCheckOutTime}
         name="checkOutTime"
         label={t('checkOut.departureTime')}
         isCheckIn={true}
        />
       </Col>

       <Col xs={24}>
        <Form.Item
         label={t('property.checkOut.policyTitle')}
         name="lateCheckOutPolicy"
        >
         <Checkbox.Group>
          <Row>
           <Col xs={24}>
            <Checkbox value="heureNonFlexible">
             {t('checkOut.policyNotFlexible')}
            </Checkbox>
           </Col>
           <Col xs={24}>
            <Checkbox value="heureDepartAlternative">
             {t('checkOut.policyAlternateTime')}
            </Checkbox>
           </Col>
           <Col xs={24}>
            <Checkbox value="contactezNous">
             {t('checkOut.policyContactUs')}
            </Checkbox>
           </Col>
           <Col xs={24}>
            <Checkbox value="optionDepartTardif">
             {t('checkOut.policyLateOption')}
            </Checkbox>
           </Col>
          </Row>
         </Checkbox.Group>
        </Form.Item>
       </Col>

       <Col xs={24}>
        <Form.Item label={t('checkOut.tasksTitle')} name="beforeCheckOut">
         <Checkbox.Group>
          <Row>
           <Col xs={24}>
            <Checkbox value="laissezBagages">
             {t('checkOut.tasksStoreBags')}
            </Checkbox>
           </Col>
           <Col xs={24}>
            <Checkbox value="signezLivreOr">
             {t('checkOut.tasksGuestBook')}
            </Checkbox>
           </Col>
           <Col xs={24}>
            <Checkbox value="litsNonFaits">
             {t('checkOut.tasksUnmadeBeds')}
            </Checkbox>
           </Col>
           <Col xs={24}>
            <Checkbox value="laverVaisselle">
             {t('checkOut.tasksCleanDishes')}
            </Checkbox>
           </Col>
           <Col xs={24}>
            <Checkbox value="vaisselleLaveVaisselle">
             {t('checkOut.tasksFinalDishes')}
            </Checkbox>
           </Col>
           <Col xs={24}>
            <Checkbox value="eteindreAppareilsElectriques">
             {t('checkOut.tasksTurnOffAppliances')}
            </Checkbox>
           </Col>
           <Col xs={24}>
            <Checkbox value="replacezMeubles">
             {t('checkOut.tasksReplaceFurniture')}
            </Checkbox>
           </Col>
           <Col xs={24}>
            <Checkbox value="deposePoubelles">
             {t('checkOut.tasksGarbage')}
            </Checkbox>
           </Col>
           <Col xs={24}>
            <Checkbox value="serviettesDansBaignoire">
             {t('checkOut.tasksTowelsInBath')}
            </Checkbox>
           </Col>
           <Col xs={24}>
            <Checkbox value="serviettesParTerre">
             {t('checkOut.tasksTowelsOnFloor')}
            </Checkbox>
           </Col>
           <Col xs={24}>
            <Checkbox value="portesVerrouillees">
             {t('checkOut.tasksDoorUnlocked')}
            </Checkbox>
           </Col>
           <Col xs={24}>
            <Checkbox value="porteNonVerrouillee">
             {t('checkOut.tasksDoorLocked')}
            </Checkbox>
           </Col>
           <Col xs={24}>
            <Checkbox value="laissezCleMaison">
             {t('checkOut.tasksKeyInHouse')}
            </Checkbox>
           </Col>
           <Col xs={24}>
            <Checkbox value="laissezCleBoiteCle">
             {t('checkOut.tasksKeyInBox')}
            </Checkbox>
           </Col>
          </Row>
         </Checkbox.Group>
        </Form.Item>
       </Col>

       <Col xs={24}>
        <Form.Item
         label={t('checkOut.additionalInfo')}
         name="additionalCheckOutInfo"
        >
         <TextArea showCount maxLength={500} />
        </Form.Item>
       </Col>
      </Row>

      <Button type="primary" htmlType="submit" loading={isLoading}>
       {success ? t('messages.updateSuccess') : t('button.save')}
      </Button>
     </Form>
    </Content>
   </Layout>
   <Foot />
  </Layout>
 );
};

export default EditCheckOut;
