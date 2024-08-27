import React, { useEffect } from 'react';
import {
 Layout,
 Row,
 Col,
 Card,
 Typography,
 Divider,
 Avatar,
 List,
 Statistic,
} from 'antd';
import { UserOutlined } from '@ant-design/icons';
import Head from '../components/common/header';
import Foot from '../components/common/footer';
import useGetProperties from '../hooks/useGetProperties';

const { Content } = Layout;
const { Title, Text } = Typography;

const Dashboard = () => {
 const { properties, loading, fetchAllProperties } = useGetProperties();

 useEffect(() => {
  fetchAllProperties();
  console.log(properties);
 }, [loading]);

 const numberOfProperties = properties.length;
 const totalPrice = properties.reduce(
  (sum, property) => sum + property.price,
  0
 );
 const averagePrice = totalPrice / numberOfProperties || 0;

 const stats = [
  {
   title: 'Link',
   value: '11.211',
   subvalue: '10.122 (+3%)',
   sub1: '7.768 Page link',
   sub2: '1.435 Boards',
  },
  {
   title: 'Users',
   value: '980',
   subvalue: '899 (+8%)',
   sub1: '891 Active',
   sub2: '1.321 Multiaccount',
  },
  {
   title: 'Posts',
   value: '3.211',
   subvalue: '2.786 (+21%)',
   sub1: '67.987 Clicks',
   sub2: '23.221 Likes',
   sub3: '11.132 Comments',
  },
 ];

 const users = [
  {
   name: 'Alexis Hill',
   links: 211,
   avatar: <Avatar style={{ backgroundColor: '#f56a00' }}>AH</Avatar>,
  },
  {
   name: 'Francesco Pisciotta',
   links: 189,
   avatar: <Avatar style={{ backgroundColor: '#87d068' }}>FP</Avatar>,
  },
  {
   name: 'Viviana Paterno',
   links: 118,
   avatar: <Avatar style={{ backgroundColor: '#1890ff' }}>VP</Avatar>,
  },
 ];

 const links = [
  { title: 'Producthunt', boards: 211 },
  { title: 'Stripe', boards: 189 },
  { title: 'Apple', boards: 118 },
 ];

 return (
  <Layout className="contentStyle">
   <Head />
   <Content className="dashboard-container">
    <Title level={2}>Statistiques</Title>
    <Row gutter={[16, 16]}>
     <Col span={6}>
      <Card title="Nombre de managers" bordered={false}>
       <Statistic value={numberOfProperties} />
      </Card>
     </Col>
     <Col span={6}>
      <Card title="Prix ​​moyen" bordered={false}>
       <Statistic value={averagePrice.toFixed(2)} precision={2} />
      </Card>
     </Col>
     <Col span={6}>
      <Card title="Nombre de propriétés" bordered={false}>
       <Statistic value={numberOfProperties} />
      </Card>
     </Col>
     <Col span={6}>
      <Card title="Prix ​​moyen" bordered={false}>
       <Statistic value={averagePrice.toFixed(2)} precision={2} />
      </Card>
     </Col>
    </Row>

    <Divider />

    <Row gutter={[16, 16]}>
     <Col xs={24} sm={12}>
      <Card title="Users" bordered={false}>
       <List
        itemLayout="horizontal"
        dataSource={users}
        renderItem={(item) => (
         <List.Item>
          <List.Item.Meta
           avatar={item.avatar}
           title={<Text>{item.name}</Text>}
           description={`${item.links} links`}
          />
         </List.Item>
        )}
       />
      </Card>
     </Col>

     <Col xs={24} sm={12}>
      <Card title="Links" bordered={false}>
       <List
        itemLayout="horizontal"
        dataSource={links}
        renderItem={(item) => (
         <List.Item>
          <Text>{item.title}</Text>
          <Text>{item.boards} boards</Text>
         </List.Item>
        )}
       />
      </Card>
     </Col>
    </Row>

    <Divider />

    <Card title="Advertisements" bordered={false}>
     <Row gutter={[16, 16]}>
      <Col xs={24} sm={12}>
       <Text>New Advertise</Text>
      </Col>
     </Row>
    </Card>
   </Content>
   <Foot />
  </Layout>
 );
};

export default Dashboard;
