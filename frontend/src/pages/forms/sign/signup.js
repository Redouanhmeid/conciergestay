import React, { useState, useEffect } from 'react';
import { useSignup } from '../../../hooks/useSignup';
import {
 Button,
 Form,
 Input,
 Col,
 Row,
 Typography,
 Divider,
 Layout,
 InputNumber,
 Select,
 Alert,
} from 'antd';
import {
 LockOutlined,
 PhoneOutlined,
 MailOutlined,
 GoogleOutlined,
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import Head from '../../../components/common/header';
import Foot from '../../../components/common/footer';
import { countries } from '../../../utils/countries';
import { useTranslation } from '../../../context/TranslationContext';

const { Title, Text } = Typography;
const { Option } = Select;

const onFinishFailed = (errorInfo) => {
 console.log('Failed:', errorInfo);
};

const Signup = () => {
 const { t } = useTranslation();
 const { signup, googleSignup, error, isLoading, message } = useSignup();
 const [email, setEmail] = useState('');
 const [password, setPassword] = useState('');
 const [firstname, setFirstName] = useState('');
 const [lastname, setLastName] = useState('');
 const [phone, setPhone] = useState('');
 const [countryCode, setCountryCode] = useState(
  countries.find((country) => country.name === 'Maroc').dialCode
 ); // Default to first country
 const [translations, setTranslations] = useState({
  startFree: '',
  createAccountText: '',
  haveAccount: '',
  loginHere: '',
  signupWithGoogle: '',
  orUseEmail: '',
  lastName: '',
  firstName: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  startButton: '',
  termsText: '',
  termsLink: '',
  // Validation messages
  provideLastName: '',
  provideFirstName: '',
  provideEmail: '',
  createPassword: '',
  passwordLength: '',
  passwordRequirements: '',
  passwordMismatch: '',
 });

 const handleCountryChange = (value) => {
  setCountryCode(value);
 };

 const handleSubmit = async (e) => {
  const fullPhoneNumber = `${countryCode}${phone}`;
  await signup(email, password, firstname, lastname, fullPhoneNumber);
 };

 const handleGoogleSignup = async () => {
  await googleSignup();
 };

 useEffect(() => {
  async function loadTranslations() {
   setTranslations({
    startFree: await t('signup.startFree', 'Commencez avec un compte gratuit'),
    createAccountText: await t(
     'signup.createAccountText',
     'Créez un compte Trevio gratuit pour partager de magnifiques guides avec vos invités.'
    ),
    haveAccount: await t('signup.haveAccount', 'Vous avez déjà un compte?'),
    loginHere: await t('signup.loginHere', 'Connectez-vous ici.'),
    signupWithGoogle: await t(
     'signup.withGoogle',
     'Inscrivez-vous avec Google'
    ),
    orUseEmail: await t('signup.orUseEmail', 'Ou utilisez E-mail'),
    lastName: await t('signup.lastName', 'Nom'),
    firstName: await t('signup.firstName', 'Prénom'),
    email: await t('signup.email', 'Email'),
    phone: await t('signup.phone', 'N° Téléphone'),
    password: await t('signup.password', 'Mot de passe'),
    confirmPassword: await t(
     'signup.confirmPassword',
     'Confirmez le mot de passe'
    ),
    startButton: await t('signup.startButton', 'Commencez'),
    termsText: await t(
     'signup.termsText',
     'En cliquant sur Commencez, vous acceptez'
    ),
    termsLink: await t('signup.termsLink', "les conditions d'utilisation."),
    // Validation messages
    provideLastName: await t(
     'validation.lastName',
     'Veuillez fournir votre Nom.'
    ),
    provideFirstName: await t(
     'validation.firstName',
     'Veuillez fournir votre Prénom.'
    ),
    provideEmail: await t(
     'validation.email',
     'Veuillez fournir une adresse Email valide.'
    ),
    createPassword: await t(
     'validation.createPassword',
     'Veuillez créer un mot de passe.'
    ),
    passwordLength: await t(
     'validation.passwordLength',
     'Le mot de passe doit contenir au moins 8 caractères.'
    ),
    passwordRequirements: await t(
     'validation.passwordRequirements',
     'Le mot de passe doit contenir au moins une minuscule, une majuscule et un chiffre.'
    ),
    passwordMismatch: await t(
     'validation.passwordMismatch',
     'Le nouveau mot de passe que vous avez saisi ne correspond pas!'
    ),
   });
  }
  loadTranslations();
 }, [t]);

 return (
  <Layout className="sign-layout">
   <Head />
   <Row justify="center" align="middle" className="login-row">
    <Col xs={24} sm={12} md={8}>
     <div className="sign-container">
      <Title level={3} className="sign-title">
       {translations.startFree}
      </Title>
      <Text className="sign-subtitle">
       {translations.createAccountText}{' '}
       <Link to="/login">{translations.loginHere}</Link>
      </Text>
      <Divider />
      <Button
       type="default"
       icon={<GoogleOutlined />}
       onClick={handleGoogleSignup}
       disabled={isLoading}
       className="sign-google-button"
      >
       {translations.loginHere}
      </Button>
      <Divider>{translations.orUseEmail}</Divider>
      <Form
       name="signup"
       initialValues={{ remember: true }}
       onFinish={handleSubmit}
       onFinishFailed={onFinishFailed}
       autoComplete="off"
       size="large"
       className="sign-form"
      >
       <Form.Item
        name="lastname"
        onChange={(e) => setLastName(e.target.value)}
        value={lastname}
        rules={[{ required: true, message: translations.lastName }]}
       >
        <Input placeholder={translations.lastName} />
       </Form.Item>

       <Form.Item
        name="firstname"
        onChange={(e) => setFirstName(e.target.value)}
        value={firstname}
        rules={[{ required: true, message: translations.firstName }]}
       >
        <Input placeholder={translations.firstName} />
       </Form.Item>

       <Form.Item
        name="email"
        onChange={(e) => setEmail(e.target.value)}
        value={email}
        rules={[
         {
          type: 'email',
          required: true,
          message: translations.provideEmail,
         },
        ]}
       >
        <Input prefix={<MailOutlined />} placeholder={translations.email} />
       </Form.Item>

       <Form.Item
        name="phone"
        onChange={(e) => setPhone(e.target.value)}
        value={phone}
       >
        <InputNumber
         type="number"
         addonBefore={
          <Select
           defaultValue={countryCode}
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
         placeholder={translations.phone}
         controls={false}
        />
       </Form.Item>

       <Form.Item
        name="password"
        onChange={(e) => setPassword(e.target.value)}
        value={password}
        rules={[
         { required: true, message: translations.createPassword },
         {
          min: 8,
          message: translations.passwordLength,
         },
         {
          pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/,
          message: translations.passwordRequirements,
         },
        ]}
       >
        <Input.Password
         prefix={<LockOutlined />}
         placeholder={translations.password}
        />
       </Form.Item>

       <Form.Item
        name="password2"
        dependencies={['password']}
        rules={[
         { required: true },
         ({ getFieldValue }) => ({
          validator(_, value) {
           if (!value || getFieldValue('password') === value) {
            return Promise.resolve();
           }
           return Promise.reject(new Error(translations.passwordMismatch));
          },
         }),
        ]}
       >
        <Input.Password
         prefix={<LockOutlined />}
         placeholder={translations.confirmPassword}
        />
       </Form.Item>

       {message && (
        <Form.Item>
         <Alert message={message} type="info" showIcon closable />
        </Form.Item>
       )}
       {error && (
        <Form.Item>
         <Alert message={error} type="warning" showIcon closable />
        </Form.Item>
       )}

       <Form.Item>
        <Button
         disabled={isLoading}
         type="primary"
         htmlType="submit"
         className="sign-submit-button"
        >
         {translations.startButton}
        </Button>
       </Form.Item>

       <Form.Item>
        <Text>{translations.termsText}</Text>
        <Link to="/">{translations.passwordMismatch}</Link>
       </Form.Item>
      </Form>
     </div>
    </Col>
   </Row>
   <Foot />
  </Layout>
 );
};

export default Signup;
