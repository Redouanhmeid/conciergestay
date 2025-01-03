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

 const [translations, setTranslations] = useState({
  login: '',
  needAccount: '',
  signupHere: '',
  loginWithGoogle: '',
  orUseEmail: '',
  emailPlaceholder: '',
  emailRequired: '',
  passwordPlaceholder: '',
  passwordRequired: '',
  rememberMe: '',
  forgotPassword: '',
  loginButton: '',
 });

 useEffect(() => {
  async function loadTranslations() {
   setTranslations({
    login: await t('auth.login', 'Se connecter'),
    needAccount: await t('auth.needAccount', "Besoin d'un compte?"),
    signupHere: await t('auth.signupHere', 'Inscrivez-vous ici'),
    loginWithGoogle: await t(
     'auth.loginWithGoogle',
     'Connectez-vous avec Google'
    ),
    orUseEmail: await t('auth.orUseEmail', 'Ou utilisez E-mail'),
    emailPlaceholder: await t('auth.emailPlaceholder', 'Email'),
    emailRequired: await t(
     'auth.emailRequired',
     'Veuillez saisir votre email!'
    ),
    passwordPlaceholder: await t('auth.passwordPlaceholder', 'Mot de passe'),
    passwordRequired: await t(
     'auth.passwordRequired',
     'Veuillez saisir votre Mot de passe!'
    ),
    rememberMe: await t('auth.rememberMe', 'Rappelez-vous de moi'),
    forgotPassword: await t('auth.forgotPassword', 'Mot de passe oublié?'),
    loginButton: await t('auth.loginButton', 'Se connecter'),
   });
  }
  loadTranslations();
 }, [t]);

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
       {translations.login}
      </Title>
      <Text className="sign-subtitle">
       {translations.needAccount}{' '}
       <Link to="/signup">{translations.signupHere}</Link>
      </Text>
      <Divider />
      <Button
       type="default"
       icon={<GoogleOutlined />}
       onClick={handleGoogleLogin}
       disabled={isLoading}
       className="sign-google-button"
      >
       {translations.loginWithGoogle}
      </Button>
      <Divider>{translations.orUseEmail}</Divider>
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
          message: translations.emailRequired,
         },
        ]}
       >
        <Input
         prefix={<UserOutlined />}
         placeholder={translations.emailPlaceholder}
        />
       </Form.Item>
       <Form.Item
        name="password"
        onChange={(e) => setPassword(e.target.value)}
        value={password}
        rules={[
         {
          required: true,
          message: translations.passwordRequired,
         },
        ]}
       >
        <Input.Password
         prefix={<LockOutlined />}
         placeholder={translations.passwordPlaceholder}
        />
       </Form.Item>
       <div className="sign-options">
        <Form.Item name="remember" valuePropName="checked" noStyle>
         <Checkbox>{translations.rememberMe}</Checkbox>
        </Form.Item>
        <Link to="/reset-password-request" className="forgot-password-link">
         {translations.forgotPassword}
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
         {translations.loginButton}
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
