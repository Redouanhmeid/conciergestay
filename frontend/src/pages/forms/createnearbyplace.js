import React, { useState, useEffect } from 'react';
import {
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
 Flex,
 Select,
} from 'antd';
import {
 ArrowLeftOutlined,
 UploadOutlined,
 PlusOutlined,
} from '@ant-design/icons';
import Head from '../../components/common/header';
import Foot from '../../components/common/footer';
import SideMenu from '../../components/sidemenu';
import MapPicker from './propertypost/MapPicker';
import { Link } from 'react-router-dom';
import useCreateNearbyPlace from '../../hooks/useCreateNearbyPlace';
import useUploadPhotos from '../../hooks/useUploadPhotos';

const { Title, Text } = Typography;
const { Content } = Layout;

const getBase64 = (file) =>
 new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result);
  reader.onerror = (error) => reject(error);
 });

const CreateNearbyPlace = () => {
 const { loading, error, success, createNearbyPlace } = useCreateNearbyPlace();
 const { uploadPhoto, uploading } = useUploadPhotos();
 const [form] = Form.useForm();
 const [Latitude, setLatitude] = useState(null);
 const [Longitude, setLongitude] = useState(null);
 const [placeName, setPlaceName] = useState('');
 const [placeURL, setPlaceURL] = useState('');
 const [placeAddress, setPlaceAddress] = useState('');
 const [placeRating, setPlaceRating] = useState(0);
 const [placePhoto, setPlacePhoto] = useState('');
 const [placeTypes, setPlaceTypes] = useState([]);
 const [Photo, setPhoto] = useState({});
 const [previewOpen, setPreviewOpen] = useState(false);
 const [previewImage, setPreviewImage] = useState('');
 const [fileList, setFileList] = useState([]);
 const [disabled, setDisabled] = useState(false);
 const [selectedItems, setSelectedItems] = useState([]);
 const [OPTIONS, setOPTIONS] = useState([
  'Restaurant',
  'Bar',
  'Centre commercial',
  'Magasin',
  'Parc',
 ]);
 const filteredOptions = OPTIONS.filter((o) => !selectedItems.includes(o));

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
  setPlaceName(placeName);
  setPlaceURL(placeURL);
  setPlaceAddress(placeAddress);
  setPlaceRating(placeRating);
  setPlacePhoto(placePhoto);
  setPlaceTypes(placeTypes);

  setDisabled(placeName || placeAddress || placeURL);
  setFileList([]);
  if (placeRating) {
   setPlaceRating(placeRating);
  } else {
   setPlaceRating(0);
  }

  if (placeTypes) {
   setOPTIONS(placeTypes);
   form.setFieldsValue({
    types: placeTypes,
   });
  } else {
   setOPTIONS(['Restaurant', 'Bar', 'Centre commercial', 'Magasin', 'Parc']);
   form.setFieldsValue({
    types: null,
   });
  }

  // Update form fields with the new place values
  form.setFieldsValue({
   name: placeName,
   address: placeAddress,
   photo: placePhoto,
   url: placeURL,
   rating: placeRating || 0,
  });
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
  setPhoto(newFileList);
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
   <div
    style={{
     marginTop: 8,
    }}
   >
    Charger
   </div>
  </button>
 );

 const onFinish = async (values) => {
  const photoUrls = await uploadPhoto(Photo);
  values.photo = photoUrls;
  const mergedValues = {
   ...values,
   latitude: Latitude,
   longitude: Longitude,
  };
  console.log(mergedValues);
  try {
   await createNearbyPlace(mergedValues);
   if (success) {
    message.success('Lieu à proximité créé avec succès');
    form.resetFields();
    setFileList([]);
   }
  } catch (error) {
   console.error('Failed to create nearby place', error);
   message.error('Échec de la création du lieu à proximité');
  }
 };

 const handleOpenImage = () => {
  window.open(placePhoto, '_blank');
 };

 return (
  <Layout className="contentStyle">
   <Head />
   <Layout>
    <SideMenu width="25%" className="siderStyle" />
    <Content className="container-fluid">
     <Link to="/">
      <ArrowLeftOutlined /> Retour
     </Link>
     <Row gutter={[24, 0]}>
      <Title level={2}>Ajouter un lieu à proximité</Title>
      <Col xs={24} md={24}>
       <Form form={form} layout="vertical" onFinish={onFinish}>
        <Row gutter={[24, 0]}>
         <Col xs={24} md={24}>
          <Form.Item>
           <MapPicker onPlaceSelected={handlePlaceSelected} />
          </Form.Item>
         </Col>
         <Col xs={24} md={8}>
          <Form.Item
           name="name"
           label="Nom"
           initialValue={placeName}
           rules={[{ required: true, message: 'Veuillez entrer le nom' }]}
          >
           <Input disabled={disabled} />
          </Form.Item>
         </Col>
         <Col xs={24} md={8}>
          <Form.Item
           name="address"
           label="Adress"
           initialValue={placeAddress}
           rules={[{ required: true, message: "Veuillez entrer l'adresse" }]}
          >
           <Input disabled={disabled} />
          </Form.Item>
         </Col>
         <Col xs={24} md={8}>
          <Form.Item
           name="url"
           label="URL de la place dans Google"
           initialValue={placeURL}
          >
           <Input disabled={disabled} />
          </Form.Item>
         </Col>
         <Col xs={24} md={4}>
          <Form.Item name="rating" label="Note">
           <Flex gap="middle">
            <Rate
             allowHalf
             disabled
             value={placeRating}
             style={{ color: '#aa7e42' }}
            />
           </Flex>
          </Form.Item>

          {placeRating > 0 && (
           <span style={{ fontSize: 16 }}>{placeRating}</span>
          )}
         </Col>
         <Col xs={24} md={16}>
          <Form.Item name="types" label="Types">
           <Select
            mode="multiple"
            disabled={disabled}
            value={selectedItems}
            onChange={setSelectedItems}
            style={{
             width: '100%',
            }}
            options={filteredOptions.map((item) => ({
             value: item,
             label: item,
            }))}
           />
          </Form.Item>
         </Col>
         <Col xs={24} md={4}>
          <Form.Item name="photo" label="Photo">
           <Upload
            action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
            listType="picture-card"
            fileList={fileList}
            onPreview={handlePreview}
            onChange={handleChange}
           >
            {fileList.length >= 1 ? null : uploadButton}
           </Upload>

           {previewImage && (
            <Image
             style={{
              width: '100%', // Ensure the image fills the circular area
              height: '100%', // Ensure the image fills the circular area
              objectFit: 'cover', // Crop the image to fit within the circular area
             }}
             wrapperStyle={{
              display: 'none',
             }}
             preview={{
              visible: previewOpen,
              onVisibleChange: (visible) => setPreviewOpen(visible),
              afterOpenChange: (visible) => !visible && setPreviewImage(''),
             }}
             src={previewImage}
            />
           )}
          </Form.Item>
         </Col>

         {placePhoto && (
          <Col xs={24} md={24}>
           <Title level={5}>
            C'est la photo de couverture définie par Google{' '}
           </Title>
           <Row gutter={[24, 0]}>
            <Col
             xs={24}
             md={10}
             style={{
              marginBottom: 12,
              textAlign: 'center',
             }}
            >
             <Image style={{ maxHeight: 360 }} src={placePhoto} />
            </Col>
            <Col xs={24} md={14}>
             <Flex gap="middle" vertical>
              <Text>
               Si vous souhaitez télécharger cette photo comme couverture pour
               votre lieu à proximité, veuillez la télécharger sur votre
               appareil, puis la télécharger dans la section Photo.
              </Text>
              <Button type="dashed" onClick={handleOpenImage}>
               Ouvrir l'image dans un nouvel onglet
              </Button>
             </Flex>
            </Col>
           </Row>
          </Col>
         )}
        </Row>

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
