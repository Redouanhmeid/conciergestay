import React, { useState, useEffect } from 'react';
import {
 DashboardOutlined,
 BookOutlined,
 WifiOutlined,
 IdcardOutlined,
 StarOutlined,
 InfoCircleOutlined,
 AimOutlined,
 PlusSquareOutlined,
} from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import { Link, useLocation } from 'react-router-dom';

const { Sider } = Layout;

const items = [
 {
  label: 'Tableau de bord',
  icon: <DashboardOutlined />,
  key: '1',
  route: '/pmhome',
 },
 {
  label: 'Guides',
  icon: <BookOutlined />,
  key: '2',
  route: '/guides',
 },
 {
  label: 'Présentations',
  icon: <IdcardOutlined />,
  key: '3',
  route: '/presentations',
 },
 {
  label: 'Lieu à proximité',
  icon: <PlusSquareOutlined />,
  key: '4',
  route: '/createnearbyplace',
 },
];

const SideMenu = () => {
 const location = useLocation();
 const [collapsed, setCollapsed] = useState(false);
 const [selectedKey, setSelectedKey] = useState('1'); // Default selected key
 useEffect(() => {
  // Find the matching item based on the current route
  const selectedItem = items.find((item) => item.route === location.pathname);
  if (selectedItem) {
   setSelectedKey(selectedItem.key);
  }
 }, [location.pathname]);
 return (
  <Sider
   collapsible
   collapsed={collapsed}
   onCollapse={(value) => setCollapsed(value)}
   breakpoint="sm"
   collapsedWidth="65"
  >
   <Menu selectedKeys={[selectedKey]} mode="inline">
    {items.map((item) => (
     <Menu.Item key={item.key} icon={item.icon}>
      <Link to={item.route}>{item.label}</Link>
     </Menu.Item>
    ))}
   </Menu>
  </Sider>
 );
};

export default SideMenu;
