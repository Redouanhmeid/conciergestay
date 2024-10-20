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
import {
 ArrowLeftOutlined,
 PlusOutlined,
 DownloadOutlined,
} from '@ant-design/icons';
import Head from '../../components/common/header';
import Foot from '../../components/common/footer';
import MapPicker from './propertypost/MapPicker';
import { useNavigate } from 'react-router-dom';
import useNearbyPlace from '../../hooks/useNearbyPlace';
import useUploadPhotos from '../../hooks/useUploadPhotos';
import ImgCrop from 'antd-img-crop';
import MapConfig from '../../mapconfig';

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
 const [placePhotos, setPlacePhotos] = useState([]);
 const [placePhoto, setPlacePhoto] = useState('');
 const [filelist, setFileList] = useState([]);
 const [previewOpen, setPreviewOpen] = useState(false);
 const [previewImage, setPreviewImage] = useState('');
 const [selectedItems, setSelectedItems] = useState([]);
 const [placeExists, setPlaceExists] = useState(false);

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
  let photoUrl = '';
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
   message.success('Lieu à proximité créé avec succès');
   form.resetFields();
   setFileList([]);
   setLatitude(null);
   setLongitude(null);
   setPlacePhotos([]);
  } catch (error) {
   if (error.response.data.error === 'Place already exists') {
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
          <Form.Item
           name="types"
           label="Types"
           rules={[
            {
             required: true,
             message: 'Veuillez sélectionner au moins un type !',
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
           label="Photo"
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
             <Text strong>Astuce:</Text> Téléchargez l'une des photo sur votre
             appareil et téléchargez-la à nouveau pour personnaliser votre de
             lieu à proximité! 🎉
            </Text>
            <br />
            <Text>
             Enregistrez-la sur votre appareil, puis utilisez la fonction{' '}
             <Text strong>Charger</Text> pour ajouter votre propre touche !
            </Text>
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
