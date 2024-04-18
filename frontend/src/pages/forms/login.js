import React, { useState } from 'react';
import { useLogin } from '../../hooks/useLogin';
import {
 Button,
 Checkbox,
 Form,
 Input,
 Col,
 Row,
 Typography,
 Divider,
 Layout,
 Flex,
 Alert,
} from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import MapImg from '../../assets/hostfully-5-star-hospitality-sign-up.jpg';
import Head from '../../components/common/header';
import Foot from '../../components/common/footer';
const { Title, Text } = Typography;

const onFinishFailed = (errorInfo) => {
 console.log('Failed:', errorInfo);
};
const Login = () => {
 const { login, error, isLoading } = useLogin();
 const [email, setEmail] = useState('');
 const [password, setPassword] = useState('');

 const handleSubmit = async (e) => {
  await login(email, password);
 };
 return (
  <Layout className="contentStyle">
   <Head />
   <Row>
    <Col xs={24} sm={8}>
     <div className="container-fluid">
      <Title>Se connecter</Title>
      <Text>Besoin d'un compte? </Text>
      <Link to="/signup">Inscrivez-vous ici</Link>
      <Divider />
      <Form
       name="signin"
       initialValues={{ remember: true }}
       onFinish={handleSubmit}
       onFinishFailed={onFinishFailed}
       autoComplete="off"
      >
       <Form.Item
        name="email"
        onChange={(e) => setEmail(e.target.value)}
        value={email}
        prefix={<UserOutlined />}
        rules={[
         {
          type: 'email',
          required: true,
          message: 'Veuillez saisir votre email!',
         },
        ]}
       >
        <Input prefix={<UserOutlined />} placeholder="Email" />
       </Form.Item>

       <Form.Item
        name="password"
        onChange={(e) => setPassword(e.target.value)}
        value={password}
        rules={[
         {
          required: true,
          message: 'Veuillez saisir votre Mot de passe!',
         },
        ]}
       >
        <Input.Password prefix={<LockOutlined />} placeholder="Mot de passe" />
       </Form.Item>

       <Form.Item name="remember" valuePropName="checked">
        <Checkbox>Rappelez-vous de moi</Checkbox>
       </Form.Item>
       {error && (
        <Form.Item>
         <Alert message={error} type="warning" showIcon closable />
        </Form.Item>
       )}
       <Form.Item>
        <Button type="primary" disabled={isLoading} htmlType="submit">
         Se connecter
        </Button>
       </Form.Item>
       <Form.Item>
        <Text>Mot de passe oublié? </Text>
        <Link to="/">Réinitialisez-le ici.</Link>
       </Form.Item>
      </Form>
     </div>
    </Col>
    <Col xs={24} sm={16}>
     <Flex
      justify="center"
      align="center"
      style={{
       overflow: 'auto',
       height: '84vh',
       backgroundRepeat: 'no-repeat',
       backgroundImage: `url(${MapImg})`,
       backgroundPosition: '50%',
       backgroundSize: 'cover',
      }}
     >
      <Text>
       Content de te revoir! En tant qu'hôte ConciergeStay, vous êtes un membre
       important de l'équipe ConciergeStay.
      </Text>
     </Flex>
    </Col>
   </Row>
   <Foot />
  </Layout>
 );
};

export default Login;
