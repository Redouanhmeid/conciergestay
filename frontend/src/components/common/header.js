import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLogout } from '../../hooks/useLogout';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useTranslation } from '../../context/TranslationContext';
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
import { LanguageSelector } from '../../utils/LanguageSelector';

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
const Head = ({ onUserData = () => {} }) => {
 const { logout } = useLogout();
 const { user } = useAuthContext();
 const User = user || JSON.parse(localStorage.getItem('user'));
 const { userData = {}, getUserData } = useUserData();
 const { t, currentLanguage, setLanguage } = useTranslation();
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
 const handleReferFriend = async (t) => {
  const referralLink = `${window.location.origin}/signup?referralCode=${userData.id}`;
  navigator.clipboard.writeText(referralLink);
  message.success(t('messages.refereFriend'));
 };

 const menuItems = [
  userData.role === 'admin' &&
   getItem(
    <Link to="/adminpanel">{t('header.adminPanel')}</Link>,
    '0',
    <i className="fa-light fa-folder-gear"></i>
   ),
  getItem(
   <Link to="/dashboard">{t('header.dashboard')}</Link>,
   '1',
   <i className="fa-light fa-grid-2-plus"></i>
  ),
  getItem(
   <Link to="/revtasskdashboard">{t('header.Revandtasks')}</Link>,
   '2',
   <i className="fa-light fa-chart-line"></i>
  ),
  getItem(
   <Link to="/account">{t('header.account')}</Link>,
   '3',
   <i className="fa-light fa-user-pen"></i>
  ),
  getItem(
   <span onClick={() => handleReferFriend(t)}>{t('header.referral')}</span>,
   '4',
   <i className="fa-light fa-users-medical"></i>
  ),
  {
   type: 'divider',
  },
  getItem(
   <Link onClick={handleLogOut}>{t('header.logout')}</Link>,
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

 // Memoize the getUserData call
 const fetchUserData = useCallback(() => {
  if (
   User?.email &&
   User?.status !== 'EN ATTENTE' &&
   (!userData || Object.keys(userData).length === 0)
  ) {
   getUserData(User.email);
  }
 }, [User?.email, User?.status, userData]);

 useEffect(() => {
  fetchUserData();
 }, [fetchUserData]);

 useEffect(() => {
  if (userData && userData.id) {
   onUserData(userData.id);
  }
 }, [userData, onUserData]);

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
      <>
       <Col
        xs={{ span: 9, offset: 3 }}
        sm={{ span: 7, offset: 10 }}
        md={{ span: 4, offset: 15 }}
       >
        <LanguageSelector />
       </Col>
       <Col xs={4} sm={1} md={1}>
        <Avatar
         onClick={showDrawer}
         size={{ xs: 46, sm: 50, md: 50, lg: 50, xl: 56, xxl: 56 }}
         src={userData.avatar}
         style={{ cursor: 'pointer' }}
        />
       </Col>
      </>
     )}
     {Object.keys(userData).length === 0 && (
      <>
       <Col xs={8} sm={{ span: 7, offset: 5 }} md={{ span: 4, offset: 13 }}>
        <LanguageSelector />
       </Col>
       <Col xs={8} sm={6} md={3}>
        <Space>
         <Button
          onClick={handleLogin}
          type="primary"
          icon={<i className="fa-light fa-user"></i>}
          shape="circle"
         />
         <Button onClick={handleSignUp}>{t('header.createAccount')}</Button>
        </Space>
       </Col>
      </>
     )}
    </Row>
    <Drawer title={t('header.profile')} onClose={onClose} open={open}>
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
         title={t('header.greeting')}
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

export default React.memo(Head);
