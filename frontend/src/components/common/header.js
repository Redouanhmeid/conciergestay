import React, { useState, useEffect, useCallback } from 'react';
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
import { LanguageSelector } from '../../utils/LanguageSelector';
import { useTranslation } from '../../context/TranslationContext';

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
 const { t } = useTranslation();
 const [translations, setTranslations] = useState({
  adminPanel: '',
  dashboard: '',
  account: '',
  referral: '',
  logout: '',
  createAccount: '',
  profile: '',
  greeting: '',
 });

 useEffect(() => {
  async function loadTranslations() {
   const texts = {
    adminPanel: await t('admin.panel', "Panneau d'administration"),
    dashboard: await t('dashboard.title', 'Tableau de bord'),
    account: await t('account.title', 'Mon compte'),
    referral: await t('referral.title', 'Référez un ami'),
    logout: await t('auth.logout', 'Se déconnecter'),
    createAccount: await t('auth.createAccount', 'Créer un compte'),
    profile: await t('profile.title', 'Profile'),
    greeting: await t('profile.greeting', 'Bonjour'),
   };
   setTranslations(texts);
  }
  loadTranslations();
 }, [t]);

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
    <Link to="/adminpanel">{translations.adminPanel}</Link>,
    '0',
    <i className="fa-light fa-folder-gear"></i>
   ),
  getItem(
   <Link to="/dashboard">{translations.dashboard}</Link>,
   '1',
   <i className="fa-light fa-grid-2-plus"></i>
  ),
  getItem(
   <Link to="/account">{translations.account}</Link>,
   '2',
   <i className="fa-light fa-user-pen"></i>
  ),
  getItem(
   <span onClick={handleReferFriend}>{translations.referral}</span>,
   '3',
   <i className="fa-light fa-users-medical"></i>
  ),
  {
   type: 'divider',
  },
  getItem(
   <Link onClick={handleLogOut}>{translations.logout}</Link>,
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
         <Button onClick={handleSignUp}>{translations.createAccount}</Button>
        </Space>
       </Col>
      </>
     )}
    </Row>
    <Drawer title={translations.profile} onClose={onClose} open={open}>
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
         title={translations.greeting}
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
