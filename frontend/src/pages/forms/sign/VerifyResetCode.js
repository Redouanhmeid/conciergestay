import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Alert } from 'antd';
import { useUserData } from '../../../hooks/useUserData';
import { useLocation, useNavigate } from 'react-router-dom';

const VerifyResetCode = ({ onCodeVerified }) => {
 const { verifyResetCode, error, success, errorMsg } = useUserData();
 const location = useLocation();
 const navigate = useNavigate();
 const [email, setEmail] = useState(location.state?.email || '');
 const [code, setCode] = useState('');

 useEffect(() => {
  if (!location.state?.email) {
   navigate('/reset-password-request');
  }
 }, [location, navigate]);

 const handleSubmit = async () => {
  const isValid = await verifyResetCode(email, code);
  if (isValid) {
   navigate('/new-password', { state: { email, code } });
  }
 };

 return (
  <div style={{ maxWidth: 400, margin: 'auto' }}>
   <h2>Vérifier le code de réinitialisation</h2>
   <Form onFinish={handleSubmit}>
    <Form.Item
     name="code"
     rules={[
      {
       required: true,
       message: 'Veuillez saisir le code de réinitialisation!',
      },
     ]}
    >
     <Input
      placeholder="Code de réinitialisation"
      value={code}
      onChange={(e) => setCode(e.target.value)}
     />
    </Form.Item>
    <Form.Item>
     <Button type="primary" htmlType="submit">
      Vérifier le code
     </Button>
    </Form.Item>
   </Form>
   {error && <Alert message={errorMsg} type="error" showIcon />}
   {success && (
    <Alert message="Code vérifié avec succès!" type="success" showIcon />
   )}
  </div>
 );
};

export default VerifyResetCode;
