import React, { useState, useEffect } from 'react';
import {
 Layout,
 Typography,
 Table,
 Tag,
 Button,
 Modal,
 Form,
 Input,
 DatePicker,
 Select,
 Space,
 Row,
 Col,
 Statistic,
} from 'antd';
import {
 ArrowLeftOutlined,
 PlusOutlined,
 CheckCircleOutlined,
 ClockCircleOutlined,
 SyncOutlined,
 ExclamationCircleOutlined,
} from '@ant-design/icons';
import Head from '../../components/common/header';
import Foot from '../../components/common/footer';
import useTask from '../../hooks/useTask';
import useNotification from '../../hooks/useNotification';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from '../../context/TranslationContext';
import dayjs from 'dayjs';

const { Content } = Layout;
const { Title } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;
const { TextArea } = Input;

const statusColors = {
 'Not Started': 'default',
 'In Progress': 'processing',
 'On Hold': 'warning',
 Completed: 'success',
};

const priorityColors = {
 High: 'red',
 Medium: 'orange',
 Low: 'green',
};

const PropertyTaskDashboard = () => {
 const location = useLocation();
 const searchParams = new URLSearchParams(location.search);
 const { t } = useTranslation();
 const navigate = useNavigate();
 const propertyId = searchParams.get('id');
 const propertyName = searchParams.get('name');

 const [tasks, setTasks] = useState([]);
 const [modalVisible, setModalVisible] = useState(false);
 const [modalType, setModalType] = useState('create');
 const [selectedTask, setSelectedTask] = useState(null);

 const [userId, setUserId] = useState(null);

 const [form] = Form.useForm();

 const {
  loading,
  error,
  getPropertyTasks,
  createTask,
  updateTask,
  deleteTask,
  updateTaskStatus,
 } = useTask();

 const { createTaskUpdateNotification } = useNotification();

 const handleUserData = (userData) => {
  setUserId(userData);
 };

 useEffect(() => {
  fetchTasks();
 }, [propertyId]);

 const fetchTasks = async () => {
  const data = await getPropertyTasks(propertyId);
  setTasks(data);
 };

 const handleCreate = () => {
  setModalType('create');
  setSelectedTask(null);
  form.resetFields();
  setModalVisible(true);
 };

 const handleEdit = (task) => {
  setModalType('edit');
  setSelectedTask(task);
  form.setFieldsValue({
   ...task,
   dueDate: dayjs(task.dueDate),
  });
  setModalVisible(true);
 };

 const handleDelete = (id) => {
  Modal.confirm({
   title: t('tasks.confirmDelete.title'),
   icon: <ExclamationCircleOutlined />,
   content: t('tasks.confirmDelete.content'),
   okText: t('tasks.confirmDelete.ok'),
   okType: 'danger',
   cancelText: t('tasks.confirmDelete.cancel'),
   onOk: async () => {
    await deleteTask(id);
    fetchTasks();
   },
  });
 };

 const handleStatusChange = async (id, status) => {
  let mappedStatus;
  switch (status) {
   case 'Not Started':
    mappedStatus = 'pending';
    break;
   case 'In Progress':
    mappedStatus = 'in_progress';
    break;
   case 'Completed':
    mappedStatus = 'completed';
    break;
   default:
    mappedStatus = 'pending';
  }
  await updateTaskStatus(id, mappedStatus);
  fetchTasks();
 };

 const handleSubmit = async (values) => {
  const taskData = {
   ...values,
   propertyId,
   dueDate: values.dueDate.format('YYYY-MM-DD'),
   assignedTo: values.assignedTo,
   createdBy: userId,
  };

  let result;

  if (modalType === 'create') {
   result = await createTask(taskData);
  } else {
   result = await updateTask(selectedTask.id, taskData);
  }

  if (result) {
   const notification = await createTaskUpdateNotification(
    Number(userId),
    Number(propertyId, 10),
    values.title,
    values.priority
   );
  }

  setModalVisible(false);
  fetchTasks();
 };

 const columns = [
  {
   title: t('tasks.title'),
   dataIndex: 'title',
   key: 'title',
  },
  {
   title: t('tasks.notes'),
   dataIndex: 'notes',
   key: 'notes',
  },
  {
   title: t('tasks.priority.title'),
   dataIndex: 'priority',
   key: 'priority',
   render: (priority) => {
    const colors = {
     high: 'red',
     medium: 'orange',
     low: 'green',
     default: 'gray',
    };

    const priorityInFrench = {
     high: 'URGENT',
     medium: 'MOYENNE',
     low: 'FAIBLE',
     default: '-',
    };

    const color = colors[priority] || colors.default;
    const label = priorityInFrench[priority] || priorityInFrench.default;

    return <Tag color={color}>{label}</Tag>;
   },
  },
  {
   title: t('tasks.dueDate'),
   dataIndex: 'dueDate',
   key: 'dueDate',
   render: (date) => dayjs(date).format('YYYY-MM-DD'),
  },
  {
   title: t('tasks.status.title'),
   dataIndex: 'status',
   key: 'status',
   render: (status, record) => (
    <Select
     value={status}
     onChange={(value) => handleStatusChange(record.id, value)}
    >
     <Option value="pending">
      <ClockCircleOutlined /> {t('tasks.status.pending')}
     </Option>
     <Option value="in_progress">
      <SyncOutlined spin /> {t('tasks.status.inProgress')}
     </Option>
     <Option value="completed">
      <CheckCircleOutlined /> {t('tasks.status.completed')}
     </Option>
    </Select>
   ),
  },
  {
   title: t('tasks.actions'),
   key: 'action',
   render: (_, record) => (
    <Space size="middle">
     <Button type="link" onClick={() => handleEdit(record)}>
      {t('tasks.edit')}
     </Button>
     <Button type="link" danger onClick={() => handleDelete(record.id)}>
      {t('tasks.delete')}
     </Button>
    </Space>
   ),
  },
 ];

 return (
  <Layout>
   <Head onUserData={handleUserData} />
   <Content className="container">
    <Button
     type="default"
     shape="round"
     icon={<ArrowLeftOutlined />}
     onClick={() => navigate(-1)}
    >
     {t('button.back')}
    </Button>
    <Title level={2}>
     {t('tasks.management')} {propertyName}
    </Title>

    <Row gutter={16}>
     <Col span={6}>
      <Statistic
       title={t('tasks.statistics.totalTasks')}
       value={tasks.length}
      />
     </Col>
     <Col span={6}>
      <Statistic
       title={t('tasks.statistics.completedTasks')}
       value={tasks.filter((t) => t.status === 'Completed').length}
      />
     </Col>
     <Col span={6}>
      <Statistic
       title={t('tasks.statistics.activeTasks')}
       value={tasks.filter((t) => t.status !== 'Completed').length}
      />
     </Col>
     <Col span={6}>
      <Statistic
       title={t('tasks.statistics.urgentTasks')}
       value={tasks.filter((t) => t.priority === 'high').length}
      />
     </Col>
    </Row>
    <br />

    <Button
     type="primary"
     icon={<PlusOutlined />}
     onClick={handleCreate}
     style={{ marginBottom: 16 }}
    >
     {t('tasks.createTask')}
    </Button>

    <Table columns={columns} dataSource={tasks} rowKey="id" loading={loading} />

    <Modal
     title={
      modalType === 'create' ? t('tasks.createTask') : t('tasks.editTask')
     }
     open={modalVisible}
     onCancel={() => setModalVisible(false)}
     footer={[
      <Button key="cancel" onClick={() => setModalVisible(false)}>
       {t('tasks.confirmDelete.cancel')}
      </Button>,
      <Button key="submit" type="primary" onClick={() => form.submit()}>
       {modalType === 'create' ? t('tasks.createTask') : t('tasks.edit')}
      </Button>,
     ]}
    >
     <Form form={form} layout="vertical" onFinish={handleSubmit}>
      <Form.Item
       name="title"
       label={t('tasks.title')}
       rules={[
        { required: true, message: t('tasks.validation.titleRequired') },
       ]}
      >
       <Input />
      </Form.Item>
      <Form.Item
       name="priority"
       label={t('tasks.priority.title')}
       rules={[
        { required: true, message: t('tasks.validation.priorityRequired') },
       ]}
      >
       <Select>
        <Option value="High">{t('tasks.priority.high')}</Option>
        <Option value="Medium">{t('tasks.priority.medium')}</Option>
        <Option value="Low">{t('tasks.priority.low')}</Option>
       </Select>
      </Form.Item>
      <Form.Item
       name="dueDate"
       label={t('tasks.dueDate')}
       rules={[
        { required: true, message: t('tasks.validation.dueDateRequired') },
       ]}
      >
       <DatePicker format="YYYY-MM-DD" />
      </Form.Item>
      <Form.Item name="notes" label={t('tasks.notes')}>
       <TextArea rows={4} />
      </Form.Item>
      {error && <p>{error.message}</p>}
     </Form>
    </Modal>
   </Content>
   <Foot />
  </Layout>
 );
};

export default PropertyTaskDashboard;
