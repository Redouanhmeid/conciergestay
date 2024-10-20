import React, { useCallback, useState, useEffect } from 'react';
import {
 Layout,
 Row,
 Col,
 Typography,
 Form,
 Input,
 InputNumber,
 Select,
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
 PlusOutlined,
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import Head from '../../components/common/header';
import Foot from '../../components/common/footer';
import Changepassword from './sign/changepassword';
import Logo from '../../assets/logo-icon.png';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useUserData } from '../../hooks/useUserData';
import ImgCrop from 'antd-img-crop';
import useUploadPhotos from '../../hooks/useUploadPhotos';
import { countries } from '../../utils/countries';
import ShareModal from '../../components/common/ShareModal';

const { Title, Text } = Typography;
const { Content } = Layout;
const { Option } = Select;

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
  a.download = `conciergestayqrcode.png`;
  a.href = url;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
 }
};

const Account = () => {
 const [form] = Form.useForm();
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
 const currentUser = user || JSON.parse(localStorage.getItem('user'));
 // State declarations
 const [loading, setLoading] = useState(true);
 const [isModalOpen, setIsModalOpen] = useState(false);
 const [previewOpen, setPreviewOpen] = useState(false);
 const [previewImage, setPreviewImage] = useState('');
 const [fileList, setFileList] = useState([]);
 const [isShareModalVisible, setIsShareModalVisible] = useState(false);
 const [countryCode, setCountryCode] = useState(
  countries.find((country) => country.name === 'Maroc').dialCode
 ); // Default to first country

 const pageUrl = window.location.href;

 useEffect(() => {
  const initializeUserData = async () => {
   if (currentUser?.email) {
    await getUserData(currentUser.email);
    setLoading(false);
   }
  };
  initializeUserData();
 }, [currentUser?.email]);

 // Update form values when userData changes
 useEffect(() => {
  const initializeFormData = async () => {
   if (userData && form) {
    const fullPhone = userData?.phone || '';
    const phoneWithoutCountryCode = fullPhone.startsWith(countryCode)
     ? fullPhone.slice(countryCode.length)
     : fullPhone;

    form.setFieldsValue({
     lastname: userData.lastname,
     firstname: userData.firstname,
     phone: phoneWithoutCountryCode,
    });

    if (userData?.avatar) {
     try {
      // Get the filename from the URL or use a default name
      const filename = userData.avatar.split('/').pop() || 'avatar.jpg';
      const file = await urlToFile(userData.avatar, filename);

      if (file) {
       setFileList([
        {
         uid: '1',
         name: filename,
         status: 'done',
         url: userData.avatar,
         originFileObj: file,
        },
       ]);
      }
     } catch (error) {
      console.error('Error setting file list:', error);
     }
    }
   }
  };

  initializeFormData();
 }, [userData?.email, form]);

 // Handle success and error messages
 useEffect(() => {
  if (success) message.success('Détails mis à jour avec succès!');
  if (error) message.warning('Erreur lors de la mise à jour des détails!');
 }, [success, error]);

 const urlToFile = async (url, filename) => {
  try {
   const response = await fetch(url);
   const blob = await response.blob();
   return new File([blob], filename, { type: blob.type });
  } catch (error) {
   console.error('Error converting URL to File:', error);
   return null;
  }
 };

 const showPWDModal = () => {
  setIsModalOpen(true);
 };
 const handlePWDCancel = () => {
  setIsModalOpen(false);
 };

 const showShareModal = () => {
  setIsShareModalVisible(true);
 };

 const hideShareModal = () => {
  setIsShareModalVisible(false);
 };

 const onFinish = (values) => {
  const fullPhoneNumber = `${countryCode}${values.phone}`;
  updatePropertyManager(
   userData.id,
   values.firstname,
   values.lastname,
   fullPhoneNumber
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

 const handleCountryChange = (value) => {
  setCountryCode(value);
 };

 const initializeUserData = async () => {
  if (currentUser?.email) {
   await getUserData(currentUser.email);
   setLoading(false);
  }
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
       name="account"
       form={form}
       labelCol={{ xs: 24, sm: 4 }}
       wrapperCol={{ xs: 24, sm: 20 }}
       onFinish={onFinish}
       labelAlign="left"
       size="large"
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
         addonBefore={
          <Select
           value={countryCode}
           style={{ width: 140 }}
           onChange={handleCountryChange}
          >
           {countries.map((country) => (
            <Option key={country.code} value={country.dialCode}>
             {`${country.name} ${country.dialCode}`}
            </Option>
           ))}
          </Select>
         }
         style={{ width: '100%' }}
         controls={false}
        />
       </Form.Item>
       <Form.Item>
        <Button type="primary" htmlType="submit" loading={isLoading}>
         Mettre à jour du profil
        </Button>
       </Form.Item>
      </Form>
      <Divider />
      <Form name="avatar" onFinish={onAvatarChange} layout="vertical">
       <Row gutter={[24, 0]}>
        <Flex align="center">
         <Col xs={12}>
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
         <Col xs={12}>
          <Form.Item>
           <Button type="primary" htmlType="submit" loading={uploading}>
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
          <Link onClick={showPWDModal}>Modifier le mot de passe</Link>
         </p>
         <div id="qrcode">
          <QRCode size={220} value={pageUrl} />
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
            navigator.clipboard.writeText(pageUrl);
           }}
          />
          <Button
           type="link"
           icon={<ShareAltOutlined />}
           onClick={showShareModal}
          />
         </Flex>
        </Space>
       </Card>

       <Modal
        title="Modifier le mot de passe"
        open={isModalOpen}
        onCancel={handlePWDCancel}
        footer={null}
       >
        <Changepassword Id={userData.id} />
       </Modal>
      </Flex>
     </Col>
    </Row>
   </Content>
   <Foot />
   <ShareModal
    isVisible={isShareModalVisible}
    onClose={hideShareModal}
    pageUrl={pageUrl}
   />
  </Layout>
 );
};

export default Account;
