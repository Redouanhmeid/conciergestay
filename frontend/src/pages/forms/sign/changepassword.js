import React from 'react';
import { Form, Input, Button, Row, Col, Alert } from 'antd';
import { useUserData } from '../../../hooks/useUserData';

const Changepassword = ({ Id }) => {
 const { isLoading, updatePassword, success, errorMsg } = useUserData();
 const onFinish = async (values) => {
  console.log('Values:', Id, values);
  const { currentPassword, newPassword } = values;
  const updated = await updatePassword(Id, currentPassword, newPassword);
 };
 console.log(success, errorMsg);
 return (
  <Form
   name="dependencies"
   autoComplete="off"
   style={{
    maxWidth: 600,
   }}
   onFinish={onFinish}
   layout="vertical"
  >
   <Form.Item
    label="Mot de passe actuel"
    name="currentPassword"
    rules={[
     {
      required: true,
     },
    ]}
   >
    <Input />
   </Form.Item>
   <Form.Item
    label="Nouveau Mot de passe"
    name="newPassword"
    rules={[
     {
      required: true,
     },
    ]}
   >
    <Input />
   </Form.Item>
   <Form.Item
    label="Confirmez le mot de passe"
    name="newPassword2"
    dependencies={['newPassword']}
    rules={[
     {
      required: true,
     },
     ({ getFieldValue }) => ({
      validator(_, value) {
       if (!value || getFieldValue('newPassword') === value) {
        return Promise.resolve();
       }
       return Promise.reject(
        new Error(
         'Le nouveau mot de passe que vous avez saisi ne correspond pas!'
        )
       );
      },
     }),
    ]}
   >
    <Input />
   </Form.Item>
   <Row justify="end">
    <Col xs={24} md={5}>
     <Form.Item>
      <Button
       type="primary"
       htmlType="submit"
       loading={!isLoading}
       disabled={success}
      >
       Modifier
      </Button>
     </Form.Item>
    </Col>
   </Row>
   {errorMsg && !success && (
    <Alert message={errorMsg} type="warning" showIcon closable />
   )}
   {success && (
    <Alert
     message="Mot de passe mis à jour avec succès"
     type="success"
     showIcon
     closable
    />
   )}
  </Form>
 );
};

export default Changepassword;
