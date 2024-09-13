import React, { useState, useEffect } from 'react';
import {
 Alert,
 Row,
 Col,
 Layout,
 Form,
 Input,
 Button,
 message,
 Typography,
 Upload,
 Image,
 Rate,
 Select,
} from 'antd';
import { ArrowLeftOutlined, PlusOutlined } from '@ant-design/icons';
import Head from '../../components/common/header';
import Foot from '../../components/common/footer';
import MapPicker from './propertypost/MapPicker';
import { useNavigate } from 'react-router-dom';
import useNearbyPlace from '../../hooks/useNearbyPlace';
import useUploadPhotos from '../../hooks/useUploadPhotos';
import ImgCrop from 'antd-img-crop';

const { Title, Text } = Typography;
const { Content } = Layout;

const getBase64 = (file) =>
 new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result);
  reader.onerror = (error) => reject(error);
 });
const OPTIONS = [
 'Restaurant & Café',
 'Activité',
 'Attraction',
 'Centre commercial',
];
const CreateNearbyPlace = () => {
 const { loading, error, createNearbyPlace } = useNearbyPlace();
 const { uploadPlace } = useUploadPhotos();
 const navigate = useNavigate();
 const [form] = Form.useForm();
 const [Latitude, setLatitude] = useState(null);
 const [Longitude, setLongitude] = useState(null);
 const [placePhoto, setPlacePhoto] = useState('');
 const [filelist, setFileList] = useState([]);
 const [previewOpen, setPreviewOpen] = useState(false);
 const [previewImage, setPreviewImage] = useState('');
 const [selectedItems, setSelectedItems] = useState([]);
 const [placeExists, setPlaceExists] = useState(false);

 const handlePlaceSelected = ({
  latitude,
  longitude,
  placeName,
  placeURL,
  placeAddress,
  placeRating,
  placePhoto,
  placeTypes,
 }) => {
  form.resetFields();
  setLatitude(latitude);
  setLongitude(longitude);
  setPlacePhoto(placePhoto);

  form.setFieldsValue({
   name: placeName,
   address: placeAddress,
   url: placeURL,
   rating: placeRating,
  });

  // If placePhoto exists, don't allow file upload
  if (placePhoto) {
   setFileList([]);
  } else {
   setFileList([]);
  }
 };

 const handlePreview = async (file) => {
  if (!file.url && !file.preview) {
   file.preview = await getBase64(file.originFileObj);
  }
  setPreviewImage(file.url || file.preview);
  setPreviewOpen(true);
 };

 const handleChange = ({ fileList: newFileList }) => {
  setFileList(newFileList);
 };

 const uploadButton = (
  <div>
   <PlusOutlined />
   <div style={{ marginTop: 8 }}>Charger</div>
  </div>
 );

 const onFinish = async (values) => {
  if (placePhoto) {
   values.photo = placePhoto;
  } else {
   const photoUrls =
    filelist.length > 0 ? await uploadPlace(filelist) : [placePhoto];
   values.photo = photoUrls;
  }
  const mergedValues = {
   ...values,
   latitude: Latitude,
   longitude: Longitude,
  };
  try {
   await createNearbyPlace(mergedValues);
   message.success('Lieu à proximité créé avec succès');
   form.resetFields();
   setFileList([]);
   setLatitude(null);
   setLongitude(null);
   setPlacePhoto('');
  } catch (error) {
   if (error.message === 'Le lieu existe déjà') {
    setPlaceExists(true);
   } else {
    message.error('Échec de la création du lieu à proximité');
   }
  }
 };

 useEffect(() => {
  if (placeExists) {
   setTimeout(() => setPlaceExists(false), 3000);
  }
 }, [placeExists]);

 const goBack = () => {
  navigate(-1);
 };

 return (
  <Layout className="contentStyle">
   <Head />
   <Layout>
    <Content className="container">
     <Button
      type="default"
      shape="round"
      icon={<ArrowLeftOutlined />}
      onClick={goBack}
     >
      Retour
     </Button>
     <Row gutter={[24, 0]}>
      <Title level={2}>Ajouter un lieu à proximité</Title>
      <Col xs={24} md={24}>
       <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        onFinishFailed={() => {
         message.error('Veuillez remplir tous les champs requis!');
        }}
       >
        <Row gutter={[24, 0]}>
         <Col xs={24} md={24}>
          <Form.Item>
           <MapPicker onPlaceSelected={handlePlaceSelected} />
          </Form.Item>
         </Col>
         <Col xs={24} md={8}>
          <Form.Item name="name" label="Nom">
           <Input />
          </Form.Item>
         </Col>
         <Col xs={24} md={8}>
          <Form.Item name="address" label="Adresse">
           <Input />
          </Form.Item>
         </Col>
         <Col xs={24} md={8}>
          <Form.Item name="url" label="URL de la place dans Google">
           <Input />
          </Form.Item>
         </Col>
         <Col xs={24} md={4}>
          <Form.Item name="rating" label="Note">
           <Rate allowHalf style={{ color: '#aa7e42' }} />
          </Form.Item>
         </Col>
         <Col xs={24} md={14}>
          <Form.Item name="types" label="Types">
           <Select
            mode="multiple"
            value={selectedItems}
            onChange={setSelectedItems}
            style={{ width: '100%' }}
            options={OPTIONS.map((item) => ({
             value: item,
             label: item,
            }))}
           />
          </Form.Item>
         </Col>
         <Col xs={24} md={6}>
          <Form.Item
           name="photo"
           label="Photo"
           valuePropName="filelist"
           getValueFromEvent={(e) => e.filelist}
          >
           {placePhoto ? (
            <Image src={placePhoto} alt="Place" style={{ width: '100%' }} />
           ) : (
            <ImgCrop rotationSlider>
             <Upload
              listType="picture-card"
              fileList={filelist}
              onPreview={handlePreview}
              onChange={handleChange}
             >
              {filelist.length >= 1 ? null : uploadButton}
             </Upload>
            </ImgCrop>
           )}
          </Form.Item>
         </Col>
        </Row>

        {placeExists && (
         <Row justify="center">
          <Col xs={24} md={6}>
           <Alert
            message="Le lieu existe déjà"
            type="warning"
            showIcon
            closable
            onClose={() => setPlaceExists(false)}
           />
          </Col>
         </Row>
        )}

        <Row justify="center">
         <Col xs={24} md={6}>
          <Form.Item>
           <Button
            style={{ width: '100%' }}
            type="primary"
            htmlType="submit"
            loading={loading}
           >
            Ajouter un lieu à proximité
           </Button>
          </Form.Item>
         </Col>
        </Row>
       </Form>
      </Col>
     </Row>
    </Content>
   </Layout>
   <Foot />
  </Layout>
 );
};

export default CreateNearbyPlace;
