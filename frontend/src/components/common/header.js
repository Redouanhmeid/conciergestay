import React, { useState, useEffect } from 'react';
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
 Space,
 message,
} from 'antd';
import Logo from '../../assets/logo.png';
import { Helmet } from 'react-helmet';
import { useUserData } from '../../hooks/useUserData';

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
 const User = user || JSON.parse(localStorage.getItem('user'));
 const { userData = {}, getUserData } = useUserData();
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
 const handleReferFriend = () => {
  const referralLink = `${window.location.origin}/signup?referralCode=${userData.id}`;
  navigator.clipboard.writeText(referralLink);
  message.success('Lien de parrainage copié ! Partagez-le avec vos amis.');
 };

 const menuItems = [
  userData.role === 'admin' &&
   getItem(
    <Link to="/adminpanel">Panneau d'administration</Link>,
    '0',
    <i className="fa-light fa-folder-gear"></i>
   ),
  getItem(
   <Link to="/dashboard">Tableau de bord</Link>,
   '1',
   <i className="fa-light fa-grid-2-plus"></i>
  ),
  getItem(
   <Link to="/account">Mon compte</Link>,
   '2',
   <i className="fa-light fa-user-pen"></i>
  ),
  getItem(
   <span onClick={handleReferFriend}>Référez un ami</span>,
   '3',
   <i className="fa-light fa-users-medical"></i>
  ),
  {
   type: 'divider',
  },
  getItem(
   <Link onClick={handleLogOut}>Se déconnecter</Link>,
   '5',
   <i className="fa-light fa-right-from-bracket"></i>
  ),
 ].filter(Boolean);

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

 useEffect(() => {
  if (User && User.status !== 'EN ATTENTE') {
   getUserData(User.email);
  }
 }, [User]);

 return (
  <>
   <Helmet>
    <link
     rel="stylesheet"
     href="https://site-assets.fontawesome.com/releases/v6.4.2/css/all.css"
    />
   </Helmet>
   <Header className="headerStyle">
    <Row>
     <Col xs={8} sm={6} md={4}>
      <Link to={'/'}>
       <Image className="logoStyle" src={Logo} preview={false} />
      </Link>
     </Col>

     {Object.keys(userData).length > 0 && (
      <Col
       xs={{ span: 4, offset: 12 }}
       sm={{ span: 1, offset: 17 }}
       md={{ span: 1, offset: 19 }}
      >
       <Avatar
        onClick={showDrawer}
        size={{ xs: 46, sm: 50, md: 50, lg: 50, xl: 56, xxl: 56 }}
        src={userData.avatar}
        style={{ cursor: 'pointer' }}
       />
      </Col>
     )}
     {Object.keys(userData).length === 0 && (
      <Col
       xs={{ span: 13, offset: 3 }}
       sm={{ span: 3, offset: 10 }}
       md={{ span: 3, offset: 17 }}
      >
       <Space>
        <Button
         onClick={handleLogin}
         type="primary"
         icon={<i className="fa-light fa-user"></i>}
         shape="circle"
        />
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
           src={userData.avatar}
          />
         }
         title="Bonjour"
         description={userData.email}
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
  </>
 );
};

export default Head;
