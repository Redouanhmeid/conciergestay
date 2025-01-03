import React, { useState, useEffect } from 'react';
import {
 Alert,
 Row,
 Col,
 Grid,
 Layout,
 Form,
 Flex,
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
import { useTranslation } from '../../context/TranslationContext';

const { useBreakpoint } = Grid;

const { Paragraph, Title, Text } = Typography;
const { Content } = Layout;

const getBase64 = (file) =>
 new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result);
  reader.onerror = (error) => reject(error);
 });

const CreateNearbyPlace = () => {
 const { loading, createNearbyPlace } = useNearbyPlace();
 const { uploadPlace } = useUploadPhotos();
 const navigate = useNavigate();
 const [form] = Form.useForm();
 const [Latitude, setLatitude] = useState(null);
 const [Longitude, setLongitude] = useState(null);
 const [placePhotos, setPlacePhotos] = useState([]);
 const [filelist, setFileList] = useState([]);
 const [selectedItems, setSelectedItems] = useState([]);
 const [placeExists, setPlaceExists] = useState(false);
 const { t } = useTranslation();
 const [translations, setTranslations] = useState({
  restaurantcafe: '',
  activite: '',
  attraction: '',
  centrecommercial: '',
  back: '',
  addPlace: '',
  name: '',
  address: '',
  googleUrl: '',
  rating: '',
  types: '',
  photo: '',
  upload: '',
  tip: '',
  tipStrong: '',
  tipText: '',
  customizeText: '',
  placeExists: '',
  fillRequired: '',
  createSuccess: '',
  createError: '',
  selectType: '',
  addPlaceButton: '',
 });

 useEffect(() => {
  async function loadTranslations() {
   setTranslations({
    restaurantcafe: await t('nearbyPlace.restaurantcafe', 'Restaurant et Café'),
    activite: await t('nearbyPlace.activite', 'Activité'),
    attraction: await t('nearbyPlace.attraction', 'Attraction'),
    mall: await t('nearbyPlace.mall', 'Centre commercial'),
    back: await t('common.back', 'Retour'),
    addPlace: await t('nearbyPlace.add', 'Ajouter un lieu à proximité'),
    name: await t('nearbyPlace.name', 'Nom'),
    address: await t('nearbyPlace.address', 'Adresse'),
    googleUrl: await t('nearbyPlace.googleUrl', 'URL de la place dans Google'),
    rating: await t('nearbyPlace.rating', 'Note'),
    types: await t('nearbyPlace.types', 'Types'),
    photo: await t('nearbyPlace.photo', 'Photo'),
    upload: await t('common.upload', 'Charger'),
    tip: await t('nearbyPlace.tip', 'Astuce:'),
    tipText: await t(
     'nearbyPlace.tipText',
     "Téléchargez l'une des photo sur votre appareil et téléchargez-la à nouveau pour personnaliser votre de lieu à proximité!"
    ),
    customizeText: await t(
     'nearbyPlace.customize',
     'Enregistrez-la sur votre appareil, puis utilisez la fonction Charger pour ajouter votre propre touche !'
    ),
    placeExists: await t('nearbyPlace.exists', 'Le lieu existe déjà'),
    fillRequired: await t(
     'validation.required',
     'Veuillez remplir tous les champs requis!'
    ),
    createSuccess: await t(
     'nearbyPlace.createSuccess',
     'Lieu à proximité créé avec succès'
    ),
    createError: await t(
     'nearbyPlace.createError',
     'Échec de la création du lieu à proximité'
    ),
    selectType: await t(
     'nearbyPlace.selectType',
     'Veuillez sélectionner au moins un type !'
    ),
    addPlaceButton: await t(
     'nearbyPlace.addButton',
     'Ajouter un lieu à proximité'
    ),
   });
  }
  loadTranslations();
 }, [t]);

 const OPTIONS = [
  translations.restaurantcafe,
  translations.activite,
  translations.attraction,
  translations.mall,
 ];

 const screens = useBreakpoint();
 const getImageSize = () => {
  if (screens.xs) {
   return { width: 100, height: 100 }; // Small size for mobile (xs)
  } else if (screens.md) {
   return { width: 240, height: 240 }; // Medium size for tablet and up (md and larger)
  }
  return { width: 240, height: 240 }; // Default size for larger screens
 };
 const imageSize = getImageSize();

 const handlePlaceSelected = ({
  latitude,
  longitude,
  placeName,
  placeURL,
  placeAddress,
  placeRating,
  placePhotos,
  placeTypes,
 }) => {
  form.resetFields();
  setPlacePhotos([]);
  setLatitude(latitude);
  setLongitude(longitude);
  setPlacePhotos(placePhotos || []);
  form.setFieldsValue({
   name: placeName,
   address: placeAddress,
   url: placeURL,
   rating: placeRating,
  });
  setFileList([]);
 };

 const handlePreview = async (file) => {
  if (!file.url && !file.preview) {
   file.preview = await getBase64(file.originFileObj);
  }
 };

 const handleChange = ({ fileList: newFileList }) => {
  setFileList(newFileList);
 };

 const uploadButton = (
  <div>
   <PlusOutlined />
   <div style={{ marginTop: 8 }}>{translations.upload}</div>
  </div>
 );

 const onFinish = async (values) => {
  if (filelist.length > 0) {
   const photoUrls = await uploadPlace(filelist);
   values.photo = photoUrls;
  }
  const mergedValues = {
   ...values,
   latitude: Latitude,
   longitude: Longitude,
  };
  try {
   await createNearbyPlace(mergedValues);
   message.success(translations.createSuccess);
   form.resetFields();
   setFileList([]);
   setLatitude(null);
   setLongitude(null);
   setPlacePhotos([]);
  } catch (error) {
   if (error.response.data.error === 'Place already exists') {
    setPlaceExists(true);
   } else {
    message.error(translations.createError);
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
      {translations.back}
     </Button>
     <Row gutter={[24, 0]}>
      <Title level={2}>{translations.addPlace}</Title>
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
          <Form.Item name="name" label={translations.name}>
           <Input />
          </Form.Item>
         </Col>
         <Col xs={24} md={8}>
          <Form.Item name="address" label={translations.address}>
           <Input />
          </Form.Item>
         </Col>
         <Col xs={24} md={8}>
          <Form.Item name="url" label={translations.googleUrl}>
           <Input />
          </Form.Item>
         </Col>
         <Col xs={24} md={4}>
          <Form.Item name="rating" label={translations.rating}>
           <Rate allowHalf style={{ color: '#aa7e42' }} />
          </Form.Item>
         </Col>
         <Col xs={24} md={14}>
          <Form.Item
           name="types"
           label="Types"
           rules={[
            {
             required: true,
             message: translations.selectType,
            },
           ]}
          >
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
           label={translations.photo}
           valuePropName="filelist"
           getValueFromEvent={(e) => e.filelist}
          >
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
          </Form.Item>
         </Col>
        </Row>

        {placePhotos && placePhotos.length > 0 && (
         <Row gutter={[1, 16]}>
          <Col xs={24}>
           <Paragraph>
            <Text>
             <Text strong>{translations.tip}</Text> {translations.tipText}
            </Text>
            <br />
            <Text>{translations.customizeText}</Text>
           </Paragraph>
          </Col>
          {placePhotos.map((photo, index) => (
           <Col key={index} xs={8} md={6}>
            <Flex gap="small" align="center" vertical>
             <Image
              src={photo}
              width={imageSize.width}
              height={imageSize.height}
              objectfit="cover"
             />
            </Flex>
           </Col>
          ))}
         </Row>
        )}

        {placeExists && (
         <Row justify="center">
          <Col xs={24} md={6}>
           <br />
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
        <br />
        <Row justify="center">
         <Col xs={24} md={6}>
          <Form.Item>
           <Button
            style={{ width: '100%' }}
            type="primary"
            htmlType="submit"
            loading={!loading}
           >
            {translations.addPlaceButton}
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
