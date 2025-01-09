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
import { LockOutlined, MailOutlined, GoogleOutlined } from '@ant-design/icons';
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

 return (
  <Layout className="sign-layout">
   <Head />
   <Row justify="center" align="middle" className="login-row">
    <Col xs={24} sm={12} md={8}>
     <div className="sign-container">
      <Title level={3} className="sign-title">
       {t('signup.startFree')}
      </Title>
      <Text className="sign-subtitle">
       {t('signup.createAccountText')}{' '}
       <Link to="/login">{t('signup.loginHere')}</Link>
      </Text>
      <Divider />
      <Button
       type="default"
       icon={<GoogleOutlined />}
       onClick={handleGoogleSignup}
       disabled={isLoading}
       className="sign-google-button"
      >
       {t('signup.withGoogle')}
      </Button>
      <Divider>{t('signup.orUseEmail')}</Divider>
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
        rules={[{ required: true, message: t('validation.lastName') }]}
       >
        <Input placeholder={t('signup.lastName')} />
       </Form.Item>

       <Form.Item
        name="firstname"
        onChange={(e) => setFirstName(e.target.value)}
        value={firstname}
        rules={[{ required: true, message: t('validation.firstName') }]}
       >
        <Input placeholder={t('signup.firstName')} />
       </Form.Item>

       <Form.Item
        name="email"
        onChange={(e) => setEmail(e.target.value)}
        value={email}
        rules={[
         {
          type: 'email',
          required: true,
          message: t('validation.email'),
         },
        ]}
       >
        <Input prefix={<MailOutlined />} placeholder={t('signup.email')} />
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
         placeholder={t('signup.phone')}
         controls={false}
        />
       </Form.Item>

       <Form.Item
        name="password"
        onChange={(e) => setPassword(e.target.value)}
        value={password}
        rules={[
         { required: true, message: t('validation.createPassword') },
         {
          min: 8,
          message: t('validation.passwordLength'),
         },
         {
          pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/,
          message: t('validation.passwordRequirements'),
         },
        ]}
       >
        <Input.Password
         prefix={<LockOutlined />}
         placeholder={t('signup.password')}
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
           return Promise.reject(new Error(t('validation.passwordMismatch')));
          },
         }),
        ]}
       >
        <Input.Password
         prefix={<LockOutlined />}
         placeholder={t('signup.confirmPassword')}
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
         {t('signup.startButton')}
        </Button>
       </Form.Item>

       <Form.Item>
        <Text>{t('signup.termsText')}</Text>{' '}
        <Link to="/">{t('signup.termsLink')}</Link>
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
