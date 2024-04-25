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
} from 'antd';
import {
 UploadOutlined,
 DownloadOutlined,
 CopyOutlined,
 ShareAltOutlined,
 PhoneOutlined,
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import Head from '../../components/common/header';
import Foot from '../../components/common/footer';
import Changepassword from './changepassword';
import Logo from '../../assets/logo-icon.png';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useUserData } from '../../hooks/useUserData';
const { Title, Text } = Typography;

const onFinish = (values) => {
 console.log('Success:', values);
};
const onFinishFailed = (errorInfo) => {
 console.log('Failed:', errorInfo);
};
const normFile = (e: any) => {
 console.log('Upload event:', e);
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
 const { isLoading, userData, getUserData } = useUserData();
 const User = user || JSON.parse(localStorage.getItem('user'));
 const [isModalOpen, setIsModalOpen] = useState(false);
 const [firstname, setfirstname] = useState();
 const [lastname, setLastname] = useState();
 const [email, setEmail] = useState();
 const [phone, setPhone] = useState();
 const showModal = () => {
  setIsModalOpen(true);
 };
 const handleOk = () => {
  setIsModalOpen(false);
 };
 const handleCancel = () => {
  setIsModalOpen(false);
 };

 useEffect(() => {
  console.log(User.email);
  if (user) {
   getUserData(User.email);
   setfirstname(userData.firstname);
   setLastname(userData.lastname);
   setEmail(userData.email);
   setPhone(userData.phone);
  }
 }, [isLoading]);

 if (isLoading) {
  return (
   <Layout className="contentStyle">
    <Head />
    <Row>
     <Col xs={24} sm={12} className="container-fluid">
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
       onFinishFailed={onFinishFailed}
       autoComplete="off"
       labelAlign="left"
      >
       <Form.Item name="fisrtname" label="Prénom">
        <Input placeholder={firstname} />
       </Form.Item>

       <Form.Item name="lastname" label="Nom">
        <Input placeholder={lastname} />
       </Form.Item>

       <Form.Item name="email" rules={[{ type: 'email' }]} label="Email">
        <Input disabled placeholder={email} />
       </Form.Item>

       <Form.Item name="phone" label="Téléphone">
        <InputNumber
         type="number"
         addonBefore={<PhoneOutlined />}
         style={{ width: '100%' }}
         prefix="+"
         placeholder={phone}
         controls={false}
        />
       </Form.Item>

       <Form.Item
        name="upload"
        label="Image d'avatar"
        valuePropName="fileList"
        getValueFromEvent={normFile}
        extra="Télécharger une image"
       >
        <Upload name="logo" action="/upload.do" listType="picture">
         <Button icon={<UploadOutlined />}>Cliquez pour charger</Button>
        </Upload>
       </Form.Item>

       <Form.Item>
        <Button type="primary" htmlType="submit">
         Mettre à jour du profil
        </Button>
       </Form.Item>
      </Form>
     </Col>
     <Col xs={24} sm={12} className="container-fluid">
      <Flex justify="center" align="center" style={{ height: 'auto' }}>
       <Card
        title="Liens rapides"
        style={{ width: '80%', textAlign: 'center' }}
       >
        <Space size="small" direction="vertical">
         <p>
          <Link to="/">Gérer l'abonnement</Link>
         </p>
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
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
         <Button
          key="submit"
          type="primary"
          loading={isLoading}
          onClick={handleOk}
         >
          Modifier
         </Button>,
        ]}
       >
        <Changepassword />
       </Modal>
      </Flex>
     </Col>
    </Row>
    <Foot />
   </Layout>
  );
 } else {
  return (
   <div className="loading">
    <Spin size="large" />
   </div>
  );
 }
};

export default Account;
