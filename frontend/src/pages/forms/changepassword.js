import React from 'react'
import { Form, Input } from 'antd'

const Changepassword = () => {
    const [form] = Form.useForm();
  return (
    <Form
      form={form}
      name="dependencies"
      autoComplete="off"
      style={{
        maxWidth: 600,
      }}
      layout="vertical"
    >

      <Form.Item
        label="Nouveau Mot de passe"
        name="password"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Input />
      </Form.Item>

      {/* Field */}
      <Form.Item
        label="Confirmez le mot de passe"
        name="password2"
        dependencies={['password']}
        rules={[
          {
            required: true,
          },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('Le nouveau mot de passe que vous avez saisi ne correspond pas!'));
            },
          }),
        ]}
      >
        <Input />
      </Form.Item>
    </Form>
  )
}

export default Changepassword