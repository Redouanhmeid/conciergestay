import React, { useState } from 'react'
import { useSignup } from '../../hooks/useSignup'
import { Button, Form, Input, Col, Row, Typography, Divider, Layout, Flex, InputNumber, Alert } from 'antd'
import { LockOutlined, PhoneOutlined, MailOutlined } from '@ant-design/icons'
import {Link} from 'react-router-dom'
import MapImg from '../../assets/hostfully-5-star-hospitality-sign-up.jpg'
import Head from '../../components/common/header'
import Foot from '../../components/common/footer'
const {Title, Text} = Typography

const onFinishFailed = (errorInfo) => {
  console.log('Failed:', errorInfo)
};
const Signup = () => {
  const {signup, error, isLoading, message} = useSignup()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [firstname, setFirstName] = useState('')
  const [lastname, setLastName] = useState('')
  const [phone, setPhone] = useState('')
  const handleSubmit = async (e) => {
    await signup(email, password, firstname, lastname, phone)
  }
  return (
    <Layout className='contentStyle'>
    <Head />
    <Row>
      <Col xs={24} sm={8} >
        <div className='container-fluid'>
        <Title level={3}>Commencez avec un compte gratuit</Title>
            
        <Text>Créez un compte Concierge Stay gratuit pour partager de magnifiques guides avec vos invités. Vous avez déjà un compte? </Text><Link to="/login">Connectez-vous ici.</Link>
        <Divider />
        <Form
          name="signup"
          initialValues={{remember: true,}}
          onFinish={handleSubmit}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          
          <Form.Item
            name="lastname"
            onChange={(e) => setLastName(e.target.value)} 
            value={lastname}
            rules={[
              {
                required: true,
                message: 'Veuillez fournir votre Nom.',
              },
            ]}
          >
            <Input placeholder="Nom" />
          </Form.Item>

          <Form.Item
            name="firstname"
            onChange={(e) => setFirstName(e.target.value)} 
            value={firstname}
            rules={[
            {
              required: true,
              message: 'Veuillez fournir votre Prénom.',
              },
            ]}
          >
            <Input placeholder="Prénom" />
          </Form.Item>

          <Form.Item
            name="email"
            onChange={(e) => setEmail(e.target.value)} 
            value={email}
            rules={[
              {
                type: 'email',
                required: true,
                message: 'Veuillez fournir une adresse Email valide.',
              },
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="Email" />
          </Form.Item>

          <Form.Item
            name="phone"
            onChange={(e) => setPhone(e.target.value)} 
            value={phone}
          >
            <InputNumber type='number' addonBefore={<PhoneOutlined />} prefix="+" style={{width: '100%',}}  placeholder="N° Téléphone"  controls={false} />
          </Form.Item>

          <Form.Item
            name="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            rules={[
            {
              required: true,
              message: 'Veuillez créer un mot de passe.',
            },
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Mot de passe"/>
          </Form.Item>
          <Form.Item
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
            <Input.Password prefix={<LockOutlined />} placeholder="Confirmez le mot de passe"/>
          </Form.Item>
          {message && <Form.Item><Alert message={message} type="info" showIcon closable /></Form.Item> }
          {error && <Form.Item><Alert message={error} type="warning" showIcon closable /></Form.Item> }
          <Form.Item>
            <Button disabled={isLoading} type="primary" htmlType="submit">Commencez</Button>
          </Form.Item>
          
          <Form.Item>
            <Text>En cliquant sur Commencez, vous acceptez </Text><Link to="/">les conditions d'utilisation.</Link>
          </Form.Item>
        </Form>
        </div>
      </Col>
      <Col xs={24} sm={16} >
        <Flex justify='center' align='center' style={{overflow: 'auto', height:'84vh', backgroundRepeat: 'no-repeat', backgroundImage:`url(${MapImg})`, backgroundPosition:'50%', backgroundSize: 'cover'}}>
          <Text>Content de te revoir! En tant qu'hôte ConciergeStay, vous êtes un membre important de l'équipe ConciergeStay.</Text>
        </Flex>
      </Col>
    </Row>
    <Foot />
  </Layout>
  )
}

export default Signup