import React, { useState, useEffect } from 'react';
import {
 Grid,
 Layout,
 Card,
 List,
 Tag,
 Select,
 DatePicker,
 Typography,
 Row,
 Col,
 Badge,
 Statistic,
 Image,
 Flex,
 Button,
 Modal,
} from 'antd';
import { CalendarOutlined, BarChartOutlined } from '@ant-design/icons';
import {
 LineChart,
 Line,
 XAxis,
 YAxis,
 CartesianGrid,
 Tooltip,
 Legend,
 ResponsiveContainer,
} from 'recharts';
import Head from '../components/common/header';
import Foot from '../components/common/footer';
import useProperty from '../hooks/useProperty';
import useRevenue from '../hooks/useRevenue';
import fallback from '../assets/fallback.png';

const { Content } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;
const { useBreakpoint } = Grid;

const LogementDashboard = () => {
 const screens = useBreakpoint();
 const [tasks, setTasks] = useState([]);
 const [propertyRevenues, setPropertyRevenues] = useState({});
 const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
 const [isModalVisible, setIsModalVisible] = useState(false);
 const [selectedProperty, setSelectedProperty] = useState(null);
 const [chartData, setChartData] = useState([]);

 const {
  getPropertyManagerTasks,
  fetchPropertiesbypm,
  loading,
  error,
  properties,
 } = useProperty();
 const { getAnnualRevenue } = useRevenue();

 const currentYear = new Date().getFullYear();
 const [userId, setUserId] = useState(null);
 const [revenueFilter, setRevenueFilter] = useState('all');

 const handleUserData = (userData) => {
  setUserId(userData);
 };

 const fetchTasks = async () => {
  try {
   const fetchedTasks = await getPropertyManagerTasks(userId);
   setTasks(fetchedTasks || []);
  } catch (err) {
   console.error('Failed to fetch tasks', err);
  }
 };

 const fetchAllPropertyRevenues = async () => {
  const revenues = {};

  const fetchPromises = properties.map(async (property) => {
   try {
    const revenue = await getAnnualRevenue(property.id, selectedYear);
    revenues[property.id] = revenue?.totalRevenue || 0;
   } catch (err) {
    console.error(`Failed to fetch revenue for property ${property.id}`, err);
    revenues[property.id] = 0;
   }
  });

  await Promise.all(fetchPromises);
  setPropertyRevenues(revenues);
 };

 useEffect(() => {
  if (userId) {
   fetchTasks();
   fetchPropertiesbypm(userId);
  }
 }, [userId]);

 useEffect(() => {
  if (properties.length > 0) {
   fetchAllPropertyRevenues();
  }
 }, [properties, selectedYear]);

 // Filter logements based on revenue and date range
 const filteredLogements = properties.filter((property) => {
  const propertyRevenue = propertyRevenues[property.id] || 0;

  return propertyRevenue;
 });
 const getPriorityTag = (priority) => {
  const colors = {
   high: 'red',
   medium: 'orange',
   low: 'green',
  };
  const priorityInFrench = {
   high: 'URGENT',
   medium: 'MOYENNE',
   low: 'FAIBLE',
  };
  return <Tag color={colors[priority]}>{priorityInFrench[priority]}</Tag>;
 };

 const totalRevenue = Object.values(propertyRevenues).reduce(
  (sum, revenue) => sum + (revenue || 0),
  0
 );

 const generateYearOptions = () => {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let i = currentYear - 5; i <= currentYear; i++) {
   years.push(i);
  }
  return years;
 };

 const showRevenueChart = async (property) => {
  setSelectedProperty(property);
  try {
   const revenue = await getAnnualRevenue(property.id, selectedYear);
   const monthlyData = revenue.revenues.map((item) => ({
    month: new Date(selectedYear, item.month - 1).toLocaleString('default', {
     month: 'short',
    }),
    revenue: Number(item.amount),
   }));
   setChartData(monthlyData);
   setIsModalVisible(true);
  } catch (error) {
   console.error('Failed to fetch revenue data', error);
  }
 };

 return (
  <Layout className="contentStyle">
   <Head onUserData={handleUserData} />
   <Content className="container">
    {/* Tasks Overview */}
    <Row gutter={[16, 16]}>
     <Col xs={24} md={8}>
      <Card>
       <Statistic
        title="Tâches totales"
        value={tasks.length}
        prefix={<i className="fa-light fa-clipboard-check "></i>}
       />
      </Card>
     </Col>
     <Col xs={24} md={8}>
      <Card>
       <Statistic
        title="Propriétés totales"
        value={properties.length}
        prefix={<i className="fa-light fa-house "></i>}
       />
      </Card>
     </Col>
     <Col xs={24} md={8}>
      <Card>
       <Statistic title="Total Revenue" value={totalRevenue} suffix="DHs" />
      </Card>
     </Col>
    </Row>

    {/* Tasks Section */}
    <Card
     title={<Title level={4}>Tâches à faire</Title>}
     style={{ marginTop: 24 }}
    >
     {error && <Text type="danger">Erreur de chargement des tâches</Text>}
     <List
      itemLayout="horizontal"
      dataSource={tasks}
      renderItem={(task) => (
       <List.Item extra={getPriorityTag(task.priority)}>
        <List.Item.Meta
         title={
          <Text>
           {task.title}
           {task.notes && <Text type="secondary"> | {task.notes}</Text>}
          </Text>
         }
         description={
          <Flex vertical={screens.xs ? true : false} gap="small">
           <Text type="secondary">{task.property.name}</Text>
           <Tag icon={<i className="tag-icon-style fa-light fa-calendar"></i>}>
            {task.dueDate.split('T')[0]}
           </Tag>
          </Flex>
         }
        />
       </List.Item>
      )}
     />
    </Card>

    {/* Logements Section */}
    <Card
     title={<Title level={4}>Revenus</Title>}
     style={{ marginTop: 24 }}
     extra={
      <Flex gap="middle">
       <Select
        value={selectedYear}
        onChange={setSelectedYear}
        style={{ width: 120 }}
       >
        {generateYearOptions().map((year) => (
         <Option key={year} value={year}>
          {year}
         </Option>
        ))}
       </Select>
      </Flex>
     }
    >
     <List
      itemLayout="horizontal"
      dataSource={filteredLogements}
      renderItem={(logement) => (
       <List.Item>
        <List.Item.Meta
         avatar={
          <Image
           src={logement.frontPhoto || logement.photos?.[0]}
           alt={logement.name}
           fallback={fallback}
           placeholder={<div className="image-placeholder">Chargement...</div>}
           width={64}
          />
         }
         title={<Text strong>{logement.name}</Text>}
         description={
          <Flex vertical={screens.xs ? true : false} gap="small">
           <Tag>Revenu total: {propertyRevenues[logement.id] || 0}</Tag>
           <Button
            type="primary"
            icon={<BarChartOutlined />}
            onClick={() => showRevenueChart(logement)}
           >
            Voir les revenus
           </Button>
          </Flex>
         }
        />
       </List.Item>
      )}
     />
    </Card>

    {/* Revenue Chart Modal */}
    <Modal
     title={`Revenus ${selectedProperty?.name || ''} - ${selectedYear}`}
     open={isModalVisible}
     onCancel={() => setIsModalVisible(false)}
     footer={null}
     width={800}
    >
     <ResponsiveContainer width="100%" height={400}>
      <LineChart data={chartData}>
       <CartesianGrid strokeDasharray="3 3" />
       <XAxis dataKey="month" />
       <YAxis hide={screens.xs ? true : false} />
       <Tooltip />
       <Legend />
       <Line
        type="monotone"
        dataKey="revenue"
        stroke="#aa7e42"
        activeDot={{ r: 8 }}
       />
      </LineChart>
     </ResponsiveContainer>
    </Modal>
   </Content>
   <Foot />
  </Layout>
 );
};

export default LogementDashboard;
