import React, { useState, useEffect } from 'react';
import {
 Layout,
 Row,
 Col,
 Typography,
 Form,
 Input,
 InputNumber,
 Button,
 Divider,
 Upload,
 Modal,
 Flex,
 Space,
 Card,
 QRCode,
 Spin,
 message,
 Image,
} from 'antd';
import {
 DownloadOutlined,
 CopyOutlined,
 ShareAltOutlined,
 PhoneOutlined,
 PlusOutlined,
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import Head from '../../components/common/header';
import Foot from '../../components/common/footer';
import Changepassword from './changepassword';
import Logo from '../../assets/logo-icon.png';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useUserData } from '../../hooks/useUserData';
import ImgCrop from 'antd-img-crop';
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

const normFile = (e: any) => {
 if (Array.isArray(e)) {
  return e;
 }
 return e?.fileList;
};
const downloadQRCode = () => {
 const canvas = document.getElementById('qrcode')?.querySelector('canvas');
 if (canvas) {
  const url = canvas.toDataURL();
  const a = document.createElement('a');
  a.download = 'QRCode.png';
  a.href = url;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
 }
};

const Account = () => {
 const { user } = useAuthContext();
 const {
  isLoading,
  userData,
  getUserData,
  updatePropertyManager,
  updateAvatar,
  success,
  error,
 } = useUserData();
 const { uploadAvatar, uploading } = useUploadPhotos();
 const User = user || JSON.parse(localStorage.getItem('user'));
 const [isModalOpen, setIsModalOpen] = useState(false);
 const [firstname, setfirstname] = useState();
 const [lastname, setLastname] = useState();
 const [email, setEmail] = useState();
 const [phone, setPhone] = useState();
 const [avatar, setAvatar] = useState(null);
 const [previewOpen, setPreviewOpen] = useState(false);
 const [previewImage, setPreviewImage] = useState('');
 const [fileList, setFileList] = useState([]);

 const showModal = () => {
  setIsModalOpen(true);
 };
 const handleCancel = () => {
  setIsModalOpen(false);
 };
 const onFinish = (values) => {
  updatePropertyManager(
   userData.id,
   values.firstname,
   values.lastname,
   values.phone
  );
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
 const onAvatarChange = async () => {
  const AvatarUrl = await uploadAvatar(fileList);
  updateAvatar(userData.id, AvatarUrl);
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
 useEffect(() => {
  if (User.email) {
   getUserData(User.email);
   setfirstname(userData.firstname);
   setLastname(userData.lastname);
   setEmail(userData.email);
   setPhone(userData.phone);
  }
 }, []);

 useEffect(() => {
  if (success) {
   message.success('Détails mis à jour avec succès!');
  }
 }, [success]);
 useEffect(() => {
  if (error) {
   message.warning('Erreur lors de la mise à jour des détails!');
  }
 }, [error]);

 if (isLoading) {
  return (
   <div className="loading">
    <Spin size="large" />
   </div>
  );
 }
 return (
  <Layout className="contentStyle">
   <Head />
   <Content className="container">
    <Row gutter={[16, 16]}>
     <Col xs={24} sm={14}>
      <Title level={2}>Gérer mon compte</Title>
      <Text>
       Ces informations sont uniquement destinées à votre compte, les invités ne
       les verront pas.
      </Text>
      <br />
      <Text>
       Créez une carte d'hôte pour partager vos coordonnées avec les invités.
      </Text>
      <br />
      <Divider />
      <Form
       name="basic"
       labelCol={{ xs: 24, sm: 4 }}
       wrapperCol={{ xs: 24, sm: 20 }}
       onFinish={onFinish}
       autoComplete="off"
       labelAlign="left"
       size="large"
       initialValues={{
        lastname: userData.lastname,
        firstname: userData.firstname,
        phone: userData.phone,
       }}
      >
       <Form.Item name="lastname" label="Nom">
        <Input />
       </Form.Item>
       <Form.Item name="firstname" label="Prénom">
        <Input />
       </Form.Item>
       <Form.Item name="phone" label="Téléphone">
        <InputNumber
         type="number"
         addonBefore={<PhoneOutlined />}
         style={{ width: '100%' }}
         prefix="+"
         controls={false}
        />
       </Form.Item>
       <Form.Item>
        <Button type="primary" htmlType="submit">
         Mettre à jour du profil
        </Button>
       </Form.Item>
      </Form>
      <Divider />
      <Form name="avatar" onFinish={onAvatarChange} layout="vertical">
       <Row gutter={[24, 0]}>
        <Flex align="center">
         <Col xs={24} md={10}>
          <Form.Item name="avatar" label="Avatar">
           <div>
            <ImgCrop rotationSlider>
             <Upload
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
         </Col>
         <Col xs={24} md={14}>
          <Form.Item>
           <Button type="primary" htmlType="submit">
            Changer l'avatar
           </Button>
          </Form.Item>
         </Col>
        </Flex>
       </Row>
      </Form>
     </Col>

     <Col xs={24} sm={10}>
      <Flex justify="center" align="center" style={{ height: 'auto' }}>
       <Card
        title="Liens rapides"
        style={{ width: '80%', textAlign: 'center' }}
       >
        <Space size="small" direction="vertical">
         {/* <p>
          <Link to="/">Gérer l'abonnement</Link>
         </p> */}
         <p>
          <Link onClick={showModal}>Modifier le mot de passe</Link>
         </p>
         <div id="qrcode">
          <QRCode
           errorLevel="H"
           color="#2b2c32"
           size={220}
           iconSize={64}
           value="https://ant.design/"
           icon={Logo}
          />
         </div>
         <br />
         <Flex gap="small" wrap="wrap">
          <Button icon={<DownloadOutlined />} onClick={downloadQRCode}>
           Télécharger
          </Button>
          <Button
           type="link"
           icon={<CopyOutlined />}
           onClick={() => {
            navigator.clipboard.writeText('texttt');
           }}
          />
          <Button type="link" icon={<ShareAltOutlined />} />
         </Flex>
        </Space>
       </Card>

       <Modal
        title="Modifier le mot de passe"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
       >
        <Changepassword Id={userData.id} />
       </Modal>
      </Flex>
     </Col>
    </Row>
   </Content>
   <Foot />
  </Layout>
 );
};

export default Account;
