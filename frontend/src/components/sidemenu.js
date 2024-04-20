import React, { useState } from 'react';
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
import { Link } from 'react-router-dom';

const { Sider } = Layout;

function getItem(label, key, icon, route) {
 return {
  label,
  key,
  icon,
  route,
 };
}
const items = [
 getItem('Tableau de bord', '1', <DashboardOutlined />, '/pmhome'),
 getItem('Guides', '2', <BookOutlined />, '/guides'),
 getItem('Présentations', '3', <IdcardOutlined />, '/presentations'),
 getItem('Directions', '4', <AimOutlined />, '/directions'),
 getItem('Wifis', '5', <WifiOutlined />, '/wifis'),
 getItem('Informations', '6', <InfoCircleOutlined />, '/informations'),
 getItem('Recommendations', '7', <StarOutlined />, '/recommendations'),
 getItem('Lieu à proximité', '8', <PlusSquareOutlined />, '/createnearbyplace'),
];

const SideMenu = () => {
 const [collapsed, setCollapsed] = useState(false);
 return (
  <Sider
   collapsible
   collapsed={collapsed}
   onCollapse={(value) => setCollapsed(value)}
   breakpoint="sm"
   collapsedWidth="65"
  >
   <Menu defaultSelectedKeys={['1']} mode="inline">
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
