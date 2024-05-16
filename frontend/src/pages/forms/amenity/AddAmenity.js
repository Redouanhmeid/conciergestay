import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
 Layout,
 Row,
 Col,
 Typography,
 Button,
 Form,
 Input,
 Flex,
 Radio,
 Upload,
 Image,
} from 'antd';
import { ArrowLeftOutlined, PlusOutlined } from '@ant-design/icons';
import Head from '../../../components/common/header';
import Foot from '../../../components/common/footer';
import ImgCrop from 'antd-img-crop';
import useUploadPhotos from '../../../hooks/useUploadPhotos';
import ReactPlayer from 'react-player';
import useAmenity from '../../../hooks/useAmenity';

const { Title, Text } = Typography;
const { Content } = Layout;

const getBase64 = (file) =>
 new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result);
  reader.onerror = (error) => reject(error);
 });

const AddAmenity = () => {
 const location = useLocation();
 const { amenity, id } = location.state;
 const navigate = useNavigate();
 const { uploadPhoto } = useUploadPhotos();
 const { loading, error, postAmenity } = useAmenity();
 const [form] = Form.useForm();
 const [name, setName] = useState('');
 const [mediaType, setMediaType] = useState('Photo');
 const [videoUrl, setVideoUrl] = useState('');
 const [previewOpen, setPreviewOpen] = useState(false);
 const [previewImage, setPreviewImage] = useState('');
 const [fileList, setFileList] = useState([]);

 useEffect(() => {
  switch (amenity) {
   case 'wifi':
    setName('WIFI');
    break;
   case 'television':
    setName('Télévision');
    break;
   case 'kitchen':
    setName('Cuisine');
    break;
   case 'washingMachine':
    setName('Machine à laver');
    break;
   case 'freeParking':
    setName('Parking gratuit');
    break;
   case 'airConditioning':
    setName('Climatisation');
    break;
   case 'dedicatedWorkspace':
    setName('Espace de travail');
    break;
   default:
    setName('');
    break;
  }
 }, [amenity]);

 const goBack = () => {
  navigate(-1); // This will navigate back to the previous page
 };

 const onChangeMediaType = (e) => {
  setMediaType(e.target.value);
  form.setFieldsValue({ media: '' });
  setVideoUrl('');
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
  values.name = amenity;
  values.propertyId = id;
  values.media = videoUrl;
  if (mediaType === 'Photo' && fileList.length > 0) {
   const photoUrl = await uploadPhoto(fileList);
   values.media = photoUrl;
  }
  try {
   await postAmenity(values);
   if (!error) {
    setTimeout(() => {
     // Navigate to the dashboard
     navigate(-1);
    }, 1000);
   }
  } catch (error) {
   console.error('Error:', error);
  }
  console.log('Received values:', values);
 };
 return (
  <Layout className="contentStyle">
   <Head />
   <Content className="container">
    <Button
     type="default"
     shape="round"
     icon={<ArrowLeftOutlined />}
     onClick={goBack}
    >
     Retour
    </Button>
    <Row gutter={[16, 16]}>
     <Col xs={24}>
      <Title level={2}>Ajouter une carte pour {name}</Title>
      <Form
       name="amenity_form"
       initialValues={{ remember: true }}
       onFinish={onFinish}
       layout="vertical"
       size="large"
       form={form}
      >
       <Row gutter={[32, 16]}>
        <Col xs={24} md={12}>
         <Flex
          horizontal="true"
          gap="middle"
          justify="center"
          onChange={onChangeMediaType}
         >
          <Radio.Group defaultValue="Photo" buttonStyle="solid" size="large">
           <Radio.Button value="Photo">Photo</Radio.Button>
           <Radio.Button value="Video">Video</Radio.Button>
          </Radio.Group>
         </Flex>
         <br />
         {mediaType === 'Photo' ? (
          <Form.Item label="Media URL" name="media">
           <div>
            <ImgCrop rotationSlider>
             <Upload
              action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
              listType="picture-card"
              fileList={fileList}
              onPreview={handlePreview}
              onChange={handleChange}
             >
              {fileList.length >= 1 ? null : uploadButton}
             </Upload>
            </ImgCrop>
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
           </div>
          </Form.Item>
         ) : (
          <Form.Item
           label={
            <>
             <Text>
              Video URL:
              <br />
              <Text type="secondary">
               Hébergez vos vidéos sur Vimeo ou Youtube avant
              </Text>
             </Text>
            </>
           }
           name="media"
          >
           <Input
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
           />
          </Form.Item>
         )}
        </Col>
        {mediaType === 'Video' &&
         form.getFieldValue(['media']) &&
         form.getFieldValue(['media']).trim() !== '' && (
          <ReactPlayer url={form.getFieldValue(['media'])} controls />
         )}
        <Col xs={24} md={12}>
         <Form.Item
          label="Que souhaitez-vous dire à vos invités sur ce sujet ?"
          name="description"
          rules={[
           {
            required: true,
            message: 'Veuillez saisir une description!',
           },
          ]}
         >
          <Input.TextArea rows={6} />
         </Form.Item>
        </Col>
        {amenity === 'wifi' && (
         <Col xs={24} md={12}>
          <Row gutter={[16, 32]}>
           <Col xs={24} md={12}>
            <Form.Item label="WiFi Name" name="wifiName">
             <Input />
            </Form.Item>
           </Col>
           <Col xs={24} md={12}>
            <Form.Item label="WiFi Password" name="wifiPassword">
             <Input />
            </Form.Item>
           </Col>
          </Row>
         </Col>
        )}
       </Row>
       <Form.Item>
        <br />
        <Row justify="end">
         <Col xs={24} md={6}>
          <Form.Item>
           <Button
            style={{ width: '100%' }}
            type="primary"
            htmlType="submit"
            loading={loading}
           >
            Enregistrer
           </Button>
          </Form.Item>
         </Col>
        </Row>
       </Form.Item>
      </Form>
     </Col>
    </Row>
   </Content>
   <Foot />
  </Layout>
 );
};

export default AddAmenity;