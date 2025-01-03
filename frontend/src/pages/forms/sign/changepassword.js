import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Row, Col, Alert } from 'antd';
import { useUserData } from '../../../hooks/useUserData';
import { useTranslation } from '../../../context/TranslationContext';

const Changepassword = ({ Id }) => {
 const { t } = useTranslation();
 const { isLoading, updatePassword, success, errorMsg } = useUserData();
 const [translations, setTranslations] = useState({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
  mismatchError: '',
  successMsg: '',
  modify: '',
 });

 const onFinish = async (values) => {
  const { currentPassword, newPassword } = values;
  const updated = await updatePassword(Id, currentPassword, newPassword);
 };
 useEffect(() => {
  async function loadTranslations() {
   setTranslations({
    currentPassword: await t('password.current', 'Mot de passe actuel'),
    newPassword: await t('password.new', 'Nouveau Mot de passe'),
    confirmPassword: await t('password.confirm', 'Confirmez le mot de passe'),
    mismatchError: await t(
     'password.mismatch',
     'Le nouveau mot de passe que vous avez saisi ne correspond pas!'
    ),
    successMsg: await t(
     'password.success',
     'Mot de passe mis à jour avec succès'
    ),
    modify: await t('common.modify', 'Modifier'),
   });
  }
  loadTranslations();
 }, [t]);

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
    label={translations.currentPassword}
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
    label={translations.newPassword}
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
    label={translations.confirmPassword}
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
       return Promise.reject(new Error(translations.mismatchError));
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
       {translations.modify}
      </Button>
     </Form.Item>
    </Col>
   </Row>
   {errorMsg && !success && (
    <Alert message={errorMsg} type="warning" showIcon closable />
   )}
   {success && (
    <Alert message={translations.successMsg} type="success" showIcon closable />
   )}
  </Form>
 );
};

export default Changepassword;
