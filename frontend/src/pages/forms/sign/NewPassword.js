import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Alert } from 'antd';
import { useUserData } from '../../../hooks/useUserData';
import { useLocation, useNavigate } from 'react-router-dom';

const NewPassword = () => {
 const { resetPassword, error, success, errorMsg } = useUserData();
 const location = useLocation();
 const navigate = useNavigate();
 const [email, setEmail] = useState(location.state?.email || '');
 const [code, setCode] = useState(location.state?.code || '');
 const [newPassword, setNewPassword] = useState('');
 const [confirmPassword, setConfirmPassword] = useState('');

 useEffect(() => {
  if (!email || !code) {
   navigate('/reset-password-request');
  }
 }, [email, code, navigate]);

 const handleSubmit = async () => {
  if (newPassword === confirmPassword) {
   await resetPassword(email, code, newPassword);
  } else {
   alert('Les mots de passe ne correspondent pas');
  }
 };

 useEffect(() => {
  if (success) {
   navigate('/login');
  }
 }, [success, navigate]);

 return (
  <div style={{ maxWidth: 400, margin: 'auto' }}>
   <h2>Réinitialiser le mot de passe</h2>
   <Form onFinish={handleSubmit}>
    <Form.Item
     name="newPassword"
     rules={[
      { required: true, message: 'Veuillez saisir un nouveau mot de passe!' },
     ]}
    >
     <Input.Password
      placeholder="Nouveau mot de passe"
      value={newPassword}
      onChange={(e) => setNewPassword(e.target.value)}
     />
    </Form.Item>
    <Form.Item
     name="confirmPassword"
     rules={[
      {
       required: true,
       message: 'Veuillez confirmer votre nouveau mot de passe!',
      },
     ]}
    >
     <Input.Password
      placeholder="Confirmez le nouveau mot de passe"
      value={confirmPassword}
      onChange={(e) => setConfirmPassword(e.target.value)}
     />
    </Form.Item>
    <Form.Item>
     <Button type="primary" htmlType="submit">
      Réinitialiser le mot de passe
     </Button>
    </Form.Item>
   </Form>
   {error && <Alert message={errorMsg} type="error" showIcon />}
   {success && (
    <Alert
     message="Mot de passe réinitialisé avec succès!"
     type="success"
     showIcon
    />
   )}
  </div>
 );
};

export default NewPassword;
