import React, { useState, useEffect } from 'react';
import {
 Table,
 Tag,
 Space,
 Button,
 Layout,
 Typography,
 Image,
 message,
 Row,
 Col,
 Card,
 Statistic,
} from 'antd';
import {
 CalendarOutlined,
 UserOutlined,
 MailOutlined,
 PhoneOutlined,
 ArrowLeftOutlined,
} from '@ant-design/icons';
import useReservationContract from '../../hooks/useReservationContract';
import { useTranslation } from '../../context/TranslationContext';
import { useLocation, useNavigate } from 'react-router-dom';
import queryString from 'query-string';
import Head from '../../components/common/header';
import Foot from '../../components/common/footer';

const { Title } = Typography;
const { Content } = Layout;

const ContractsList = () => {
 const { t } = useTranslation();
 const location = useLocation();
 const { id: propertyId } = queryString.parse(location.search);
 const [contracts, setContracts] = useState([]);
 const [loading, setLoading] = useState(true);
 const { getContractsByProperty, updateContractStatus } =
  useReservationContract();

 const navigate = useNavigate();

 useEffect(() => {
  fetchContracts();
 }, [propertyId]);

 const handleStatusChange = async (contractId, newStatus) => {
  try {
   await updateContractStatus(contractId, newStatus);
   message.success(t('contracts.success.statusUpdate'));
   fetchContracts(); // Refresh the list
  } catch (error) {
   message.error(t('contracts.error.statusUpdate'));
  }
 };

 const getStatusCounts = () => {
  // Add check to ensure contracts is an array
  if (!Array.isArray(contracts)) return {};

  return contracts.reduce((acc, contract) => {
   acc[contract.status] = (acc[contract.status] || 0) + 1;
   return acc;
  }, {});
 };

 const statusColors = {
  DRAFT: 'gray',
  SENT: 'blue',
  SIGNED: 'green',
  REJECTED: 'red',
  COMPLETED: 'purple',
 };

 const columns = [
  {
   title: t('contracts.guest'),
   key: 'guest',
   render: (text, record) => (
    <Space direction="vertical">
     <span>
      <UserOutlined /> {record.firstname} {record.lastname}
     </span>
     <span>
      <MailOutlined /> {record.email}
     </span>
     <span>
      <PhoneOutlined /> {record.phone}
     </span>
    </Space>
   ),
  },
  {
   title: t('contracts.identity'),
   dataIndex: 'identity',
   key: 'identity',
   render: (text, record) => (
    <Image
     src={record.identityDocumentUrl}
     shape="square"
     width={180}
     height={100}
    />
   ),
  },
  {
   title: t('contracts.signature'),
   dataIndex: 'signature',
   key: 'signature',
   render: (text, record) => (
    <Image src={record.signatureImageUrl} shape="square" width={200} />
   ),
  },
  {
   title: t('contracts.status'),
   key: 'status',
   render: (text, record) => (
    <Tag color={statusColors[record.status]}>{record.status}</Tag>
   ),
  },
  {
   title: t('contracts.actions'),
   key: 'actions',
   render: (text, record) => (
    <Space>
     {record.status === 'DRAFT' && (
      <Button
       type="primary"
       onClick={() => handleStatusChange(record.id, 'SENT')}
      >
       {t('contracts.actions.send')}
      </Button>
     )}
     {record.status === 'SENT' && (
      <>
       <Button
        type="primary"
        onClick={() => handleStatusChange(record.id, 'SIGNED')}
       >
        {t('contracts.actions.markSigned')}
       </Button>
       <Button danger onClick={() => handleStatusChange(record.id, 'REJECTED')}>
        {t('contracts.actions.reject')}
       </Button>
      </>
     )}
     {record.status === 'SIGNED' && (
      <Button
       type="primary"
       onClick={() => handleStatusChange(record.id, 'COMPLETED')}
      >
       {t('contracts.actions.complete')}
      </Button>
     )}
    </Space>
   ),
  },
 ];

 const fetchContracts = async () => {
  try {
   setLoading(true);
   const data = await getContractsByProperty(propertyId);
   // Ensure we're setting an array
   setContracts(Array.isArray(data) ? data : []);
  } catch (error) {
   message.error(t('contracts.error.fetch'));
   setContracts([]); // Set empty array on error
  } finally {
   setLoading(false);
  }
 };

 // Calculate status counts whenever contracts change
 const statusCounts = contracts.reduce((acc, contract) => {
  acc[contract.status] = (acc[contract.status] || 0) + 1;
  return acc;
 }, {});

 return (
  <Layout className="contentStyle">
   <Head />
   <Layout>
    <Content className="container-fluid">
     <Button
      type="default"
      shape="round"
      icon={<ArrowLeftOutlined />}
      onClick={() => navigate(-1)}
     >
      {t('button.back')}
     </Button>
     <Title level={2}>{t('contracts.title')}</Title>

     <Row gutter={[16, 4]}>
      {/* Status Summary Cards */}
      <Col span={24}>
       <Row gutter={16}>
        {Object.entries(statusCounts).map(([status, count]) => (
         <Col span={4} key={status}>
          <Card>
           <Statistic
            title={t(`contracts.statuses.${status.toLowerCase()}`)}
            value={count}
            valueStyle={{ color: statusColors[status] }}
           />
          </Card>
         </Col>
        ))}
       </Row>
      </Col>

      {/* Contracts Table */}
      <Col span={24}>
       <br />
       <Table
        columns={columns}
        dataSource={contracts}
        loading={loading}
        rowKey="id"
        expandable={{
         expandedRowRender: (record) => (
          <Space direction="vertical">
           <p>
            <strong>{t('contracts.details.nationality')}:</strong>{' '}
            {record.nationality}
           </p>
           <p>
            <strong>{t('contracts.details.address')}:</strong>{' '}
            {record.residenceAddress}, {record.residenceCity}
           </p>
           <p>
            <strong>{t('contracts.details.postalCode')}:</strong>{' '}
            {record.residencePostalCode}
           </p>
           <p>
            <strong>{t('contracts.details.country')}:</strong>{' '}
            {record.residenceCountry}
           </p>
           {record.birthDate && (
            <p>
             <strong>{t('contracts.details.birthDate')}:</strong>{' '}
             {new Date(record.birthDate).toLocaleDateString()}
            </p>
           )}
          </Space>
         ),
        }}
       />
      </Col>
     </Row>
    </Content>
   </Layout>
   <Foot />
  </Layout>
 );
};

export default ContractsList;
