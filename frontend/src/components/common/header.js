import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLogout } from '../../hooks/useLogout';
import { useAuthContext } from '../../hooks/useAuthContext';
import {
 Drawer,
 Layout,
 Avatar,
 Col,
 Row,
 Image,
 List,
 Menu,
 Button,
 Flex,
 Space,
} from 'antd';
import {
 UserOutlined,
 SettingOutlined,
 UsergroupAddOutlined,
 LogoutOutlined,
} from '@ant-design/icons';
import Logo from '../../assets/logo.png';

/* const { Search } = Input; */
const { Header } = Layout;

function getItem(label, key, icon, children, type) {
 return {
  key,
  icon,
  children,
  label,
  type,
 };
}

/* const onSearch = (value, _e, info) => console.log(info?.source, value); */
const Head = () => {
 const { logout } = useLogout();
 const { user } = useAuthContext();
 const navigate = useNavigate();
 const handleLogOut = () => {
  logout();
  navigate('/login');
 };
 const handleLogin = () => {
  navigate('/login');
 };
 const handleSignUp = () => {
  logout();
  navigate('/signup');
 };
 const menuItems = [
  getItem(<Link to="/account">Mon compte</Link>, '1', <UserOutlined />),
  getItem('Paramètres', '2', <SettingOutlined />),
  getItem('Référez un ami', '3', <UsergroupAddOutlined />),
  {
   type: 'divider',
  },
  getItem(
   <Link onClick={handleLogOut}>Se déconnecter</Link>,
   '4',
   <LogoutOutlined />
  ),
 ];
 const [open, setOpen] = useState(false);
 const showDrawer = () => {
  setOpen(true);
 };
 const onClose = () => {
  setOpen(false);
 };
 const onClick = () => {
  onClose();
 };
 return (
  <Header className="headerStyle">
   <Row>
    <Col xs={8} sm={6} md={4}>
     <Link to={'/'}>
      <Image className="logoStyle" src={Logo} preview={false} />
     </Link>
    </Col>
    {/* <Col xs={14} sm={6} md={8}>
            <Space>
              <Search placeholder="saisir le texte de recherche" onSearch={onSearch} allowClear enterButton size="large" style={{ display: "block" }}/>
            </Space>
          </Col> */}

    {user && (
     <Col
      xs={{ span: 1, offset: 15 }}
      sm={{ span: 1, offset: 17 }}
      md={{ span: 1, offset: 19 }}
     >
      <Avatar
       onClick={showDrawer}
       size={{ xs: 40, sm: 46, md: 46, lg: 46, xl: 50, xxl: 50 }}
       src="https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png"
       style={{ cursor: 'pointer' }}
      />
     </Col>
    )}
    {!user && (
     <Col
      xs={{ span: 4, offset: 12 }}
      sm={{ span: 4, offset: 14 }}
      md={{ span: 6, offset: 14 }}
     >
      <Space>
       <Button onClick={handleLogin} type="primary">
        Se connecter
       </Button>
       <Button onClick={handleSignUp}>Créer un compte</Button>
      </Space>
     </Col>
    )}
   </Row>
   <Drawer title="Profile" onClose={onClose} open={open}>
    <List
     dataSource={[{ id: 1, name: 'Redouan' }]}
     bordered
     renderItem={(item) => (
      <List.Item key={item.id}>
       <List.Item.Meta
        avatar={
         <Avatar
          size={{ xs: 40, sm: 46, md: 46, lg: 46, xl: 50, xxl: 50 }}
          src="https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png"
         />
        }
        title="Bonjour"
        description={user.email}
       />
      </List.Item>
     )}
    />
    <br />
    <Menu
     onClick={onClick}
     mode="vertical"
     selectable={false}
     items={menuItems}
    />
   </Drawer>
  </Header>
 );
};

export default Head;
