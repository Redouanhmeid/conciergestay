import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Alert } from 'antd';
import { useUserData } from '../../../hooks/useUserData';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from '../../../context/TranslationContext';

const VerifyResetCode = ({ onCodeVerified }) => {
 const { verifyResetCode, error, success, errorMsg } = useUserData();
 const location = useLocation();
 const navigate = useNavigate();
 const [email, setEmail] = useState(location.state?.email || '');
 const [code, setCode] = useState('');
 const { t } = useTranslation();
 const [translations, setTranslations] = useState({
  verifyCode: '',
  enterCode: '',
  codePlaceholder: '',
  verifyButton: '',
  verifySuccess: '',
 });

 useEffect(() => {
  if (!location.state?.email) {
   navigate('/reset-password-request');
  }
 }, [location, navigate]);

 useEffect(() => {
  async function loadTranslations() {
   setTranslations({
    verifyCode: await t(
     'password.verifyCode',
     'Vérifier le code de réinitialisation'
    ),
    enterCode: await t(
     'password.enterCode',
     'Veuillez saisir le code de réinitialisation!'
    ),
    codePlaceholder: await t(
     'password.codePlaceholder',
     'Code de réinitialisation'
    ),
    verifyButton: await t('password.verifyButton', 'Vérifier le code'),
    verifySuccess: await t(
     'password.verifySuccess',
     'Code vérifié avec succès!'
    ),
   });
  }
  loadTranslations();
 }, [t]);

 const handleSubmit = async () => {
  const isValid = await verifyResetCode(email, code);
  if (isValid) {
   navigate('/new-password', { state: { email, code } });
  }
 };

 return (
  <div style={{ maxWidth: 400, margin: 'auto' }}>
   <h2>{translations.verifyCode}</h2>
   <Form onFinish={handleSubmit}>
    <Form.Item
     name="code"
     rules={[
      {
       required: true,
       message: translations.enterCode,
      },
     ]}
    >
     <Input
      placeholder={translations.codePlaceholder}
      value={code}
      onChange={(e) => setCode(e.target.value)}
     />
    </Form.Item>
    <Form.Item>
     <Button type="primary" htmlType="submit">
      {translations.verifyButton}
     </Button>
    </Form.Item>
   </Form>
   {error && <Alert message={errorMsg} type="error" showIcon />}
   {success && (
    <Alert message={translations.verifySuccess} type="success" showIcon />
   )}
  </div>
 );
};

export default VerifyResetCode;
