import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Alert } from 'antd';
import { useUserData } from '../../../hooks/useUserData';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../../../context/TranslationContext';

const ResetPasswordRequest = () => {
 const { requestPasswordReset, error, success, errorMsg } = useUserData();
 const [email, setEmail] = useState('');
 const navigate = useNavigate();
 const { t } = useTranslation();
 const [translations, setTranslations] = useState({
  requestTitle: '',
  validEmail: '',
  emailPlaceholder: '',
  sendCode: '',
  codeSent: '',
 });

 const handleSubmit = async () => {
  await requestPasswordReset(email);
 };

 // Redirect to the VerifyResetCode page upon success
 useEffect(() => {
  if (success) {
   navigate('/verify-reset-code', { state: { email } });
  }
 }, [success, navigate, email]);

 useEffect(() => {
  async function loadTranslations() {
   setTranslations({
    requestTitle: await t(
     'password.requestReset',
     'Demande de réinitialisation de mot de passe'
    ),
    validEmail: await t('validation.email', 'Veuillez saisir un email valide!'),
    emailPlaceholder: await t('common.email', 'Email'),
    sendCode: await t(
     'password.sendCode',
     'Envoyer le code de réinitialisation'
    ),
    codeSent: await t('password.codeSent', 'Code de réinitialisation envoyé!'),
   });
  }
  loadTranslations();
 }, [t]);

 return (
  <div style={{ maxWidth: 400, margin: 'auto' }}>
   <h2>Demande de réinitialisation de mot de passe</h2>
   <Form onFinish={handleSubmit}>
    <Form.Item
     name="email"
     rules={[
      {
       required: true,
       type: 'email',
       message: translations.validEmail,
      },
     ]}
    >
     <Input
      placeholder={translations.emailPlaceholder}
      value={email}
      onChange={(e) => setEmail(e.target.value)}
     />
    </Form.Item>
    <Form.Item>
     <Button type="primary" htmlType="submit">
      {translations.sendCode}
     </Button>
    </Form.Item>
   </Form>
   {error && <Alert message={errorMsg} type="error" showIcon />}
   {success && (
    <Alert message={translations.codeSent} type="success" showIcon />
   )}
  </div>
 );
};

export default ResetPasswordRequest;
