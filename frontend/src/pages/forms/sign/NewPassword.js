import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Alert } from 'antd';
import { useUserData } from '../../../hooks/useUserData';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from '../../../context/TranslationContext';

const NewPassword = () => {
 const { t } = useTranslation();
 const { resetPassword, error, success, errorMsg } = useUserData();
 const location = useLocation();
 const navigate = useNavigate();
 const [email, setEmail] = useState(location.state?.email || '');
 const [code, setCode] = useState(location.state?.code || '');
 const [newPassword, setNewPassword] = useState('');
 const [confirmPassword, setConfirmPassword] = useState('');

 const [translations, setTranslations] = useState({
  resetPassword: '',
  enterNewPassword: '',
  confirmNewPasswordMsg: '',
  passwordsDontMatch: '',
  resetPasswordButton: '',
  resetSuccess: '',
 });

 useEffect(() => {
  async function loadTranslations() {
   setTranslations({
    resetPassword: await t('password.reset', 'Réinitialiser le mot de passe'),
    enterNewPassword: await t(
     'password.enterNew',
     'Veuillez saisir un nouveau mot de passe!'
    ),
    enterNewPasswordPlaceholder: await t(
     'password.enterNewPlaceholder',
     'Nouveau mot de passe'
    ),
    confirmNewPasswordMsg: await t(
     'password.confirmNew',
     'Veuillez confirmer votre nouveau mot de passe!'
    ),
    confirmNewPasswordMsgPlaceholder: await t(
     'password.confirmNewPlaceholder',
     'Confirmez le nouveau mot de passe'
    ),
    passwordsDontMatch: await t(
     'password.mismatch',
     'Les mots de passe ne correspondent pas'
    ),
    resetPasswordButton: await t(
     'password.resetButton',
     'Réinitialiser le mot de passe'
    ),
    resetSuccess: await t(
     'password.resetSuccess',
     'Mot de passe réinitialisé avec succès!'
    ),
   });
  }
  loadTranslations();
 }, [t]);

 useEffect(() => {
  if (!email || !code) {
   navigate('/reset-password-request');
  }
 }, [email, code, navigate]);

 const handleSubmit = async () => {
  if (newPassword === confirmPassword) {
   await resetPassword(email, code, newPassword);
  } else {
   alert(translations.passwordsDontMatch);
  }
 };

 useEffect(() => {
  if (success) {
   navigate('/login');
  }
 }, [success, navigate]);

 return (
  <div style={{ maxWidth: 400, margin: 'auto' }}>
   <h2>{translations.resetPassword}</h2>
   <Form onFinish={handleSubmit}>
    <Form.Item
     name="newPassword"
     rules={[{ required: true, message: translations.enterNewPassword }]}
    >
     <Input.Password
      placeholder={translations.enterNewPasswordPlaceholder}
      value={newPassword}
      onChange={(e) => setNewPassword(e.target.value)}
     />
    </Form.Item>
    <Form.Item
     name="confirmPassword"
     rules={[
      {
       required: true,
       message: translations.confirmNewPasswordMsg,
      },
     ]}
    >
     <Input.Password
      placeholder={translations.confirmNewPasswordMsgPlaceholder}
      value={confirmPassword}
      onChange={(e) => setConfirmPassword(e.target.value)}
     />
    </Form.Item>
    <Form.Item>
     <Button type="primary" htmlType="submit">
      {translations.resetPasswordButton}
     </Button>
    </Form.Item>
   </Form>
   {error && <Alert message={errorMsg} type="error" showIcon />}
   {success && (
    <Alert message={translations.resetSuccess} type="success" showIcon />
   )}
  </div>
 );
};

export default NewPassword;
