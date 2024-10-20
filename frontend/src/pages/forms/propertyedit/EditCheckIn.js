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
} from 'antd';
import dayjs from 'dayjs';
import ImgCrop from 'antd-img-crop';
import ReactPlayer from 'react-player';
import { ArrowLeftOutlined, PlusOutlined } from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import queryString from 'query-string';
import useUploadPhotos from '../../../hooks/useUploadPhotos';
import useUpdateProperty from '../../../hooks/useUpdateProperty';
import useGetProperty from '../../../hooks/useGetProperty';
import Head from '../../../components/common/header';
import Foot from '../../../components/common/footer';

const { Content } = Layout;
const { Title } = Typography;
const format = 'HH:mm';
const { TextArea } = Input;

const getBase64 = (file) =>
 new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result);
  reader.onerror = (error) => reject(error);
 });

const EditCheckIn = () => {
 const location = useLocation();
 const { id } = queryString.parse(location.search);
 const navigate = useNavigate();
 const [form] = Form.useForm();
 const { updatePropertyCheckIn, isLoading, success } = useUpdateProperty(id);
 const { uploadFrontPhoto } = useUploadPhotos();
 const { property, loading } = useGetProperty(id);

 const [checkInTime, setCheckInTime] = useState(null);
 const [videoURL, setVideoURL] = useState('');
 const [fileList2, setFileList2] = useState([]);
 const [previewImage2, setPreviewImage2] = useState('');
 const [previewOpen2, setPreviewOpen2] = useState(false);

 // Same time handling logic as in EditProperty
 useEffect(() => {
  if (!loading && property) {
   form.setFieldsValue({
    ...property,
    checkInTime: dayjs(property.checkInTime),
   });
   setFileList2([
    {
     uid: 1,
     name: property.frontPhoto,
     status: 'done',
     url: property.frontPhoto,
    },
   ]);
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
   <div
    style={{
     marginTop: 8,
    }}
   >
    Charger
   </div>
  </button>
 );

 const handleSubmit = async (values) => {
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
  updatePropertyCheckIn(values);
 };

 if (loading) {
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
      Retour
     </Button>
     <Title level={3}>Modifier les informations d'arrivée</Title>
     <Form
      name="editCheckIn"
      form={form}
      onFinish={handleSubmit}
      layout="vertical"
     >
      <Row gutter={[16, 8]}>
       <Col xs={24} md={24}>
        <Form.Item
         label="Quand est l'heure la plus tôt à laquelle les invités peuvent s'enregistrer?"
         name="checkInTime"
        >
         <TimePicker
          format={format} // Using the same format as in EditProperty
          showNow={false}
          size="large"
          value={checkInTime} // Ensure the value is set from state
          onChange={setCheckInTime} // Update state on change
         />
        </Form.Item>
       </Col>

       <Col xs={24}>
        <Form.Item
         label="Sélectionnez les déclarations qui décrivent le mieux votre politique en matière de check-in anticipé."
         name="earlyCheckIn"
        >
         <Checkbox.Group>
          <Row>
           <Col xs={24}>
            <Checkbox value="heureNonFlexible">
             Malheureusement l'heure d'arrivée n'est pas flexible.
            </Checkbox>
           </Col>
           <Col xs={24}>
            <Checkbox value="ajustementHeure">
             À l'occasion il est possible d'ajuster votre heure d'arrivée si
             vous nous contactez.
            </Checkbox>
           </Col>
           <Col xs={24}>
            <Checkbox value="autreHeureArrivee">
             Lorsque que cela est possible, nous pouvons vous arranger en vous
             proposant une autre heure d’arrivée qui vous conviendrait mieux.
             Contactez nous à l’avance si vous souhaitez modifier votre heure
             d’arrivée.
            </Checkbox>
           </Col>
           <Col xs={24}>
            <Checkbox value="laissezBagages">
             Vous pouvez laissez vos bagages pendant la journée.
            </Checkbox>
           </Col>
          </Row>
         </Checkbox.Group>
        </Form.Item>
       </Col>

       <Col xs={24}>
        <Form.Item
         label="Sélectionnez les déclarations qui décrivent le mieux la manière dont vos invités accéderont à la propriété."
         name="accessToProperty"
        >
         <Checkbox.Group>
          <Row>
           <Col xs={24}>
            <Checkbox value="cleDansBoite">
             La clé de la maison se trouve dans la boîte à clé
            </Checkbox>
           </Col>
           <Col xs={24}>
            <Checkbox value="acceuilContactezMoi">
             On sera là pour vous accueillir, sinon, contactez moi quand vous
             arrivez.
            </Checkbox>
           </Col>
           <Col xs={24}>
            <Checkbox value="codesAccesCourriel">
             Nous vous enverrons vos codes d’accès par courriel avant votre
             arrivée.
            </Checkbox>
           </Col>
           <Col xs={24}>
            <Checkbox value="verifiezCourriel">
             Vérifiez votre courriel pour les instructions relatives à votre
             arrivée.
            </Checkbox>
           </Col>
           <Col xs={24}>
            <Checkbox value="serrureNumero">
             Nous avons une serrure à numéro.
            </Checkbox>
           </Col>
          </Row>
         </Checkbox.Group>
        </Form.Item>
       </Col>

       <Col xs={24}>
        <Form.Item
         label="Quelles informations vos invités doivent-ils connaître pour accéder à la propriété ?"
         name="guestAccessInfo"
        >
         <TextArea />
        </Form.Item>
       </Col>

       {/* Fron image Input */}
       <Col xs={24} md={24}>
        <Form.Item
         label="Photo de la façade de la résidence ou de la maison."
         name="frontPhoto"
        >
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
        <Form.Item
         label="Lien vidéo pour les instructions d'enregistrement"
         name="videoCheckIn"
        >
         <Input
          placeholder={
           !property.videoCheckIn
            ? "Entrez l'URL de la vidéo (Hébergez vos vidéos sur Vimeo ou Youtube avant)"
            : ''
          }
          value={videoURL}
          onChange={(e) => setVideoURL(e.target.value)} // Handle change
         />
        </Form.Item>

        {/* Show the video if videoURL exists */}
        {videoURL && (
         <div style={{ marginTop: '16px' }}>
          <ReactPlayer url={videoURL} controls={true} width="100%" />
         </div>
        )}
       </Col>
      </Row>

      <Button type="primary" htmlType="submit" loading={isLoading}>
       {success ? 'Mis à jour!' : "Enregistrer les informations d'arrivée"}
      </Button>
     </Form>
    </Content>
   </Layout>
   <Foot />
  </Layout>
 );
};

export default EditCheckIn;
