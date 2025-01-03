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
 PlusOutlined,
 CheckCircleOutlined,
 ClockCircleOutlined,
 SyncOutlined,
 ExclamationCircleOutlined,
} from '@ant-design/icons';
import Head from '../../components/common/header';
import Foot from '../../components/common/footer';
import useTask from '../../hooks/useTask';
import { useNavigate, useLocation } from 'react-router-dom';
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
   title: 'Confirm Delete',
   icon: <ExclamationCircleOutlined />,
   content: 'Are you sure you want to delete this task?',
   okText: 'Delete',
   okType: 'danger',
   cancelText: 'Cancel',
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

  if (modalType === 'create') {
   await createTask(taskData);
  } else {
   await updateTask(selectedTask.id, taskData);
  }

  setModalVisible(false);
  fetchTasks();
 };

 const columns = [
  {
   title: 'Titre',
   dataIndex: 'title',
   key: 'title',
  },
  {
   title: 'Notes',
   dataIndex: 'notes',
   key: 'notes',
  },
  {
   title: 'Priorité',
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
   title: "Date d'échéance",
   dataIndex: 'dueDate',
   key: 'dueDate',
   render: (date) => dayjs(date).format('YYYY-MM-DD'),
  },
  {
   title: 'État',
   dataIndex: 'status',
   key: 'status',
   render: (status, record) => (
    <Select
     value={status}
     onChange={(value) => handleStatusChange(record.id, value)}
    >
     <Option value="pending">
      <ClockCircleOutlined /> En attente
     </Option>
     <Option value="in_progress">
      <SyncOutlined spin /> En progress
     </Option>
     <Option value="completed">
      <CheckCircleOutlined /> Complété
     </Option>
    </Select>
   ),
  },
  {
   title: 'Action',
   key: 'action',
   render: (_, record) => (
    <Space size="middle">
     <Button type="link" onClick={() => handleEdit(record)}>
      Modifier
     </Button>
     <Button type="link" danger onClick={() => handleDelete(record.id)}>
      Supprimer
     </Button>
    </Space>
   ),
  },
 ];

 return (
  <Layout>
   <Head onUserData={handleUserData} />
   <Content className="container">
    <Title level={2}>Tâches pour {propertyName}</Title>

    <Row gutter={16}>
     <Col span={6}>
      <Statistic title="Tâches totales" value={tasks.length} />
     </Col>
     <Col span={6}>
      <Statistic
       title="Tâches complétées"
       value={tasks.filter((t) => t.status === 'Completed').length}
      />
     </Col>
     <Col span={6}>
      <Statistic
       title="Tâches actives"
       value={tasks.filter((t) => t.status !== 'Completed').length}
      />
     </Col>
     <Col span={6}>
      <Statistic
       title="Priorités urgentes"
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
     Créer une tâche
    </Button>

    <Table columns={columns} dataSource={tasks} rowKey="id" loading={loading} />

    <Modal
     title={modalType === 'create' ? 'Créer une tâche' : 'Modifier la tâche'}
     open={modalVisible}
     onCancel={() => setModalVisible(false)}
     footer={[
      <Button key="cancel" onClick={() => setModalVisible(false)}>
       Cancel
      </Button>,
      <Button key="submit" type="primary" onClick={() => form.submit()}>
       {modalType === 'create' ? 'Créer' : 'Modifier'}
      </Button>,
     ]}
    >
     <Form form={form} layout="vertical" onFinish={handleSubmit}>
      <Form.Item
       name="title"
       label="Titre"
       rules={[
        { required: true, message: 'Veuillez saisir le titre de la tâche' },
       ]}
      >
       <Input />
      </Form.Item>
      <Form.Item
       name="priority"
       label="Priorité"
       rules={[
        { required: true, message: 'Veuillez sélectionner une priorité' },
       ]}
      >
       <Select>
        <Option value="High">Urgent</Option>
        <Option value="Medium">Moyenne</Option>
        <Option value="Low">Faible</Option>
       </Select>
      </Form.Item>
      <Form.Item
       name="dueDate"
       label="Date d'échéance"
       rules={[
        {
         required: true,
         message: "Veuillez sélectionner une date d'échéance",
        },
       ]}
      >
       <DatePicker format="YYYY-MM-DD" />
      </Form.Item>
      <Form.Item name="notes" label="Notes">
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
