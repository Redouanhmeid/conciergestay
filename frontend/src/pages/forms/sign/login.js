import React, { useState } from 'react';
import { useLogin } from '../../../hooks/useLogin';
import {
 Button,
 Checkbox,
 Form,
 Input,
 Col,
 Row,
 Typography,
 Divider,
 Layout,
 Alert,
} from 'antd';
import { UserOutlined, LockOutlined, GoogleOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import Head from '../../../components/common/header';
import Foot from '../../../components/common/footer';
import Logo from '../../../assets/logo.png';

const { Title, Text } = Typography;

const onFinishFailed = (errorInfo) => {
 console.log('Failed:', errorInfo);
};

const Login = () => {
 const { login, googleLogin, error, isLoading } = useLogin();
 const [email, setEmail] = useState('');
 const [password, setPassword] = useState('');

 const handleSubmit = async (e) => {
  await login(email, password);
 };

 const handleGoogleLogin = async () => {
  await googleLogin();
 };

 return (
  <Layout className="sign-layout">
   <Head />
   <Row justify="center" align="middle" className="sign-row">
    <Col xs={24} sm={12} md={8}>
     <div className="sign-container">
      <img src={Logo} alt="Logo" className="sign-logo" />
      <Title level={2} className="sign-title">
       Se connecter
      </Title>
      <Text className="sign-subtitle">
       Besoin d'un compte? <Link to="/signup">Inscrivez-vous ici</Link>
      </Text>
      <Divider />
      <Button
       type="default"
       icon={<GoogleOutlined />}
       onClick={handleGoogleLogin}
       disabled={isLoading}
       className="sign-google-button"
      >
       Connectez-vous avec Google
      </Button>
      <Divider>Ou utilisez E-mail</Divider>
      <Form
       name="signin"
       initialValues={{ remember: true }}
       onFinish={handleSubmit}
       onFinishFailed={onFinishFailed}
       autoComplete="off"
       size="large"
       className="sign-form"
      >
       <Form.Item
        name="email"
        onChange={(e) => setEmail(e.target.value)}
        value={email}
        rules={[
         {
          type: 'email',
          required: true,
          message: 'Veuillez saisir votre email!',
         },
        ]}
       >
        <Input prefix={<UserOutlined />} placeholder="Email" />
       </Form.Item>
       <Form.Item
        name="password"
        onChange={(e) => setPassword(e.target.value)}
        value={password}
        rules={[
         {
          required: true,
          message: 'Veuillez saisir votre Mot de passe!',
         },
        ]}
       >
        <Input.Password prefix={<LockOutlined />} placeholder="Mot de passe" />
       </Form.Item>
       <div className="sign-options">
        <Form.Item name="remember" valuePropName="checked" noStyle>
         <Checkbox>Rappelez-vous de moi</Checkbox>
        </Form.Item>
        <Link to="/reset-password-request" className="forgot-password-link">
         Mot de passe oublié?
        </Link>
       </div>
       {error && (
        <Form.Item>
         <Alert message={error} type="warning" showIcon closable />
        </Form.Item>
       )}
       <Form.Item>
        <Button
         type="primary"
         disabled={isLoading}
         htmlType="submit"
         className="sign-submit-button"
        >
         Se connecter
        </Button>
       </Form.Item>
      </Form>
     </div>
    </Col>
   </Row>
   <Foot />
  </Layout>
 );
};

export default Login;
