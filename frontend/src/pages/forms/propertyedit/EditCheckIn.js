import React, { useState, useEffect } from 'react';
import {
 Spin,
 Layout,
 Form,
 Input,
 Row,
 Col,
 Typography,
 Button,
 TimePicker,
 Upload,
 Image,
 Checkbox,
 message,
} from 'antd';
import dayjs from 'dayjs';
import ImgCrop from 'antd-img-crop';
import ReactPlayer from 'react-player';
import { ArrowLeftOutlined, PlusOutlined } from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import queryString from 'query-string';
import useUploadPhotos from '../../../hooks/useUploadPhotos';
import useUpdateProperty from '../../../hooks/useUpdateProperty';
import useProperty from '../../../hooks/useProperty';
import Head from '../../../components/common/header';
import Foot from '../../../components/common/footer';
import { useTranslation } from '../../../context/TranslationContext';

const { Content } = Layout;
const { Title } = Typography;
const format = 'HH:mm';
const { TextArea } = Input;

// Default check-in times that make more business sense
const DEFAULT_CHECK_IN_TIME = dayjs().hour(11).minute(0); // 11:00 AM

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
  onChange?.(DEFAULT_CHECK_IN_TIME);
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
    placeholder={t('timePicker.selectCheckIn')}
   />
  </Form.Item>
 );
};

const getBase64 = (file) =>
 new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result);
  reader.onerror = (error) => reject(error);
 });

const EditCheckIn = () => {
 const { t } = useTranslation();
 const location = useLocation();
 const { id } = queryString.parse(location.search);
 const navigate = useNavigate();
 const [form] = Form.useForm();
 const { updatePropertyCheckIn, isLoading, success, error } =
  useUpdateProperty(id);
 const { uploadFrontPhoto } = useUploadPhotos();
 const { property, loading, fetchProperty } = useProperty();

 const [checkInTime, setCheckInTime] = useState(null);
 const [videoURL, setVideoURL] = useState('');
 const [fileList2, setFileList2] = useState([]);
 const [previewImage2, setPreviewImage2] = useState('');
 const [previewOpen2, setPreviewOpen2] = useState(false);

 useEffect(() => {
  fetchProperty(id);
 }, [loading]);

 // Same time handling logic as in EditProperty
 useEffect(() => {
  if (!loading && property) {
   form.setFieldsValue({
    ...property,
    checkInTime: dayjs(property.checkInTime),
   });
   if (property.frontPhoto) {
    setFileList2([
     {
      uid: 1,
      name: property.frontPhoto,
      status: 'done',
      url: property.frontPhoto,
     },
    ]);
   }
   setVideoURL(property.videoCheckIn || '');
  }
 }, [loading, property]);
 const handlePreview2 = async (file) => {
  if (!file.url && !file.preview) {
   file.preview = await getBase64(file.originFileObj);
  }
  setPreviewImage2(file.url || file.preview);
  setPreviewOpen2(true);
 };
 const handleChange2 = ({ fileList }) => {
  setFileList2(fileList);
 };
 const uploadButton = (
  <button
   style={{
    border: 0,
    background: 'none',
   }}
   type="button"
  >
   <PlusOutlined />
   <div style={{ marginTop: 8 }}>{t('photo.upload')}</div>
  </button>
 );

 const handleSubmit = async (values) => {
  try {
   if (fileList2.length > 0) {
    const currentFile = fileList2[0];
    if (currentFile.url && currentFile.url.startsWith('/frontphotos')) {
     // If it's an existing file, just use the URL
     values.frontPhoto = currentFile.url;
    } else if (currentFile.originFileObj) {
     // If it's a new file (i.e., has originFileObj), upload it
     const photoUrl = await uploadFrontPhoto([currentFile]);
     values.frontPhoto = photoUrl;
    }
   }
   await updatePropertyCheckIn(values);
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
     <Title level={3}>{t('checkIn.editTitle')}</Title>
     <Form
      name="editCheckIn"
      form={form}
      onFinish={handleSubmit}
      layout="vertical"
     >
      <Row gutter={[16, 8]}>
       <Col xs={24} md={24}>
        <TimePickerWithDefault
         value={checkInTime}
         onChange={setCheckInTime}
         name="checkInTime"
         label={t('checkIn.earliestTime')}
         isCheckIn={true}
        />
       </Col>

       <Col xs={24}>
        <Form.Item label={t('checkIn.policyTitle')} name="earlyCheckIn">
         <Checkbox.Group>
          <Row>
           <Col xs={24}>
            <Checkbox value="heureNonFlexible">
             {t('checkIn.policyNotFlexible')}
            </Checkbox>
           </Col>
           <Col xs={24}>
            <Checkbox value="ajustementHeure">
             {t('checkIn.policyAdjustTime')}
            </Checkbox>
           </Col>
           <Col xs={24}>
            <Checkbox value="autreHeureArrivee">
             {t('checkIn.policyAlternateTime')}
            </Checkbox>
           </Col>
           <Col xs={24}>
            <Checkbox value="laissezBagages">
             {t('checkIn.policyStoreBags')}
            </Checkbox>
           </Col>
          </Row>
         </Checkbox.Group>
        </Form.Item>
       </Col>

       <Col xs={24}>
        <Form.Item label={t('checkIn.accessTitle')} name="accessToProperty">
         <Checkbox.Group>
          <Row>
           <Col xs={24}>
            <Checkbox value="cleDansBoite">
             {t('checkIn.accessKeyInBox')}
            </Checkbox>
           </Col>
           <Col xs={24}>
            <Checkbox value="acceuilContactezMoi">
             {t('checkIn.accessWelcomeContact')}
            </Checkbox>
           </Col>
           <Col xs={24}>
            <Checkbox value="codesAccesCourriel">
             {t('checkIn.accessCodesByEmail')}
            </Checkbox>
           </Col>
           <Col xs={24}>
            <Checkbox value="verifiezCourriel">
             {t('checkIn.accessCheckEmail')}
            </Checkbox>
           </Col>
           <Col xs={24}>
            <Checkbox value="serrureNumero">
             {t('checkIn.accessNumberLock')}
            </Checkbox>
           </Col>
          </Row>
         </Checkbox.Group>
        </Form.Item>
       </Col>

       <Col xs={24}>
        <Form.Item label={t('checkIn.guestInfo')} name="guestAccessInfo">
         <TextArea showCount maxLength={500} />
        </Form.Item>
       </Col>

       {/* Fron image Input */}
       <Col xs={24} md={24}>
        <Form.Item label={t('checkIn.frontPhoto')} name="frontPhoto">
         <div>
          <ImgCrop rotationSlider>
           <Upload
            listType="picture-card"
            fileList={fileList2}
            onPreview={handlePreview2}
            onChange={handleChange2}
           >
            {fileList2.length >= 1 ? null : uploadButton}
           </Upload>
          </ImgCrop>
          {previewImage2 && (
           <Image
            style={{
             width: '100%',
             height: '100%',
             objectFit: 'cover',
            }}
            wrapperStyle={{
             display: 'none',
            }}
            preview={{
             visible: previewOpen2,
             onVisibleChange: (visible) => setPreviewOpen2(visible),
             afterOpenChange: (visible) => !visible && setPreviewImage2(''),
            }}
            src={previewImage2}
           />
          )}
         </div>
        </Form.Item>
       </Col>

       {/* Video URL Input */}
       <Col xs={24}>
        <Form.Item label={t('checkIn.videoInstructions')} name="videoCheckIn">
         <Input
          placeholder={!property.videoCheckIn ? t('checkIn.hostVideo') : ''}
          value={videoURL}
          onChange={(e) => setVideoURL(e.target.value)} // Handle change
         />
        </Form.Item>

        {/* Show the video if videoURL exists */}
        {videoURL && (
         <div style={{ marginTop: '16px' }}>
          <ReactPlayer url={videoURL} controls={true} width="100%" />
          <br />
         </div>
        )}
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

export default EditCheckIn;
