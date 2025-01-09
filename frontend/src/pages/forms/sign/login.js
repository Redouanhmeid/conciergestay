import React, { useState, useEffect } from 'react';
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
import { useTranslation } from '../../../context/TranslationContext';

const { Title, Text } = Typography;

const onFinishFailed = (errorInfo) => {
 console.log('Failed:', errorInfo);
};

const Login = () => {
 const { t } = useTranslation();
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
       {t('auth.login')}
      </Title>
      <Text className="sign-subtitle">
       {t('auth.needAccount')} <Link to="/signup">{t('auth.signupHere')}</Link>
      </Text>
      <Divider />
      <Button
       type="default"
       icon={<GoogleOutlined />}
       onClick={handleGoogleLogin}
       disabled={isLoading}
       className="sign-google-button"
      >
       {t('auth.loginWithGoogle')}
      </Button>
      <Divider>{t('auth.orUseEmail')}</Divider>
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
          message: t('auth.emailRequired'),
         },
        ]}
       >
        <Input
         prefix={<UserOutlined />}
         placeholder={t('auth.emailPlaceholder')}
        />
       </Form.Item>
       <Form.Item
        name="password"
        onChange={(e) => setPassword(e.target.value)}
        value={password}
        rules={[
         {
          required: true,
          message: t('auth.passwordRequired'),
         },
        ]}
       >
        <Input.Password
         prefix={<LockOutlined />}
         placeholder={t('auth.passwordPlaceholder')}
        />
       </Form.Item>
       <div className="sign-options">
        <Form.Item name="remember" valuePropName="checked" noStyle>
         <Checkbox>{t('auth.rememberMe')}</Checkbox>
        </Form.Item>
        <Link to="/reset-password-request" className="forgot-password-link">
         {t('auth.forgotPassword')}
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
         {t('auth.loginButton')}
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
