import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Alert } from 'antd';
import { useUserData } from '../../../hooks/useUserData';
import { useNavigate } from 'react-router-dom';

const ResetPasswordRequest = () => {
 const { requestPasswordReset, error, success, errorMsg } = useUserData();
 const [email, setEmail] = useState('');
 const navigate = useNavigate();

 const handleSubmit = async () => {
  await requestPasswordReset(email);
 };

 // Redirect to the VerifyResetCode page upon success
 useEffect(() => {
  if (success) {
   navigate('/verify-reset-code', { state: { email } });
  }
 }, [success, navigate, email]);

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
       message: 'Veuillez saisir un email valide!',
      },
     ]}
    >
     <Input
      placeholder="Email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
     />
    </Form.Item>
    <Form.Item>
     <Button type="primary" htmlType="submit">
      Envoyer le code de réinitialisation
     </Button>
    </Form.Item>
   </Form>
   {error && <Alert message={errorMsg} type="error" showIcon />}
   {success && (
    <Alert message="Code de réinitialisation envoyé!" type="success" showIcon />
   )}
  </div>
 );
};

export default ResetPasswordRequest;
