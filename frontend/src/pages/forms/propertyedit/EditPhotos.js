import React, { useState, useEffect } from 'react';
import {
 Spin,
 Layout,
 Typography,
 Form,
 Row,
 Col,
 Upload,
 Button,
 Image,
 Alert,
 Progress,
 message,
} from 'antd';
import {
 DndContext,
 TouchSensor,
 closestCenter,
 PointerSensor,
 useSensor,
 useSensors,
 defaultDropAnimation,
} from '@dnd-kit/core';
import {
 SortableContext,
 arrayMove,
 useSortable,
 verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
 LoadingOutlined,
 PlusOutlined,
 ArrowRightOutlined,
 ArrowLeftOutlined,
} from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import queryString from 'query-string';
import useUpdateProperty from '../../../hooks/useUpdateProperty';
import useProperty from '../../../hooks/useProperty';
import useUploadPhotos from '../../../hooks/useUploadPhotos';
import Head from '../../../components/common/header';
import Foot from '../../../components/common/footer';
import { useTranslation } from '../../../context/TranslationContext';

const { Content } = Layout;
const { Title, Text } = Typography;

const getBase64 = (file) =>
 new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result);
  reader.onerror = (error) => reject(error);
 });

const DraggableUploadListItem = ({ originNode, file }) => {
 const {
  attributes,
  listeners,
  setNodeRef,
  transform,
  transition,
  isDragging,
 } = useSortable({
  id: file.uid,
 });
 const style = {
  transform: CSS.Transform.toString(transform),
  transition,
  cursor: 'move',
  border: isDragging ? '2px solid #1890ff' : 'none',
  touchAction: 'none',
 };
 return (
  <div
   ref={setNodeRef}
   style={style}
   {...attributes}
   {...listeners}
   className={isDragging ? 'dragging' : ''}
  >
   {originNode}
  </div>
 );
};

const EditPhotos = () => {
 const { t } = useTranslation();
 const location = useLocation();
 const { id } = queryString.parse(location.search);
 const navigate = useNavigate();
 const [form] = Form.useForm();
 const { property, loading, fetchProperty } = useProperty();
 const {
  updatePropertyPhotos,
  isLoading: isUpdating,
  success,
 } = useUpdateProperty(id);
 const { uploadPhotos, uploading, uploadProgress } = useUploadPhotos();

 const [previewOpen, setPreviewOpen] = useState(false);
 const [previewImage, setPreviewImage] = useState('');
 const [fileList, setFileList] = useState([]);

 const sensors = useSensors(
  useSensor(PointerSensor, {
   activationConstraint: {
    distance: 8, // For desktop
   },
  }),
  useSensor(TouchSensor, {
   activationConstraint: {
    delay: 100, // Short delay for touch interactions
    tolerance: 5, // Allow slight finger movement before drag starts
   },
   listeners: {
    touchmove: (event) => {
     // Prevent scrolling while dragging
     event.preventDefault();
    },
   },
  })
 );

 const handleSubmit = async () => {
  if (!fileList.length) {
   console.error(t('photo.noFiles'));
   return;
  }
  const filesWithOriginFileObj = fileList.filter((file) => file.originFileObj);
  const newFileList = filesWithOriginFileObj.reduce((acc, file, index) => {
   acc[index] = file;
   return acc;
  }, []);
  const urlsArray = fileList
   .filter((file) => !file.originFileObj)
   .map((file) => file.url);
  /* updatePropertyPhotos({ photos: files }); */
  try {
   const photoUrls = await uploadPhotos(newFileList);
   photoUrls.unshift(...urlsArray);
   await updatePropertyPhotos({ photos: photoUrls });
   navigate(-1);
  } catch (error) {
   console.error('Error handling photos:', error);
   message.error(t('photo.uploadError'));
  }
 };

 const handlePreview = async (file) => {
  if (!file.url && !file.preview) {
   file.preview = await getBase64(file.originFileObj);
  }
  file.error = false;
  setPreviewImage(file.url || file.preview);
  setPreviewOpen(true);
 };

 useEffect(() => {
  fetchProperty(id);
 }, [loading]);

 useEffect(() => {
  if (!loading && property && property.photos) {
   setFileList(
    property.photos.map((url, index) => ({
     uid: `existing-${index}`,
     name: url.substring(url.lastIndexOf('/') + 1),
     status: 'done',
     url: url,
    }))
   );
  }
 }, [loading, property]);

 useEffect(() => {
  // Add CSS to prevent scrolling while dragging
  const style = document.createElement('style');
  style.textContent = `
      .dragging {
        touch-action: none;
      }
      body.dragging {
        overflow: hidden;
        touch-action: none;
      }
    `;
  document.head.appendChild(style);
  return () => document.head.removeChild(style);
 }, []);

 const handleDragStart = () => {
  document.body.classList.add('dragging');
 };

 const onDragEnd = (event) => {
  document.body.classList.remove('dragging');
  const { active, over } = event;
  if (active.id !== over.id) {
   setFileList((items) => {
    const oldIndex = items.findIndex((item) => item.uid === active.id);
    const newIndex = items.findIndex((item) => item.uid === over.id);
    return arrayMove(items, oldIndex, newIndex);
   });
  }
 };

 const uploadButton = (
  <div
   style={{
    height: '105px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
   }}
  >
   {uploading ? (
    <div>{t('photo.uploading')}</div>
   ) : (
    <>
     <PlusOutlined />
     <div style={{ marginTop: 8 }}>{t('validation.addPhotos')}</div>
    </>
   )}
  </div>
 );

 if (loading || property.length === 0) {
  return (
   <div className="loading">
    <Spin size="large" />
   </div>
  );
 }
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

     <Form
      name="editBasicInfo"
      form={form}
      onFinish={handleSubmit}
      initialValues={property}
      layout="vertical"
     >
      <Row gutter={[8, 0]}>
       <Col xs={24} md={24}>
        <Title level={3}>
         {t('photo.editTitle', 'Modifier les photos de votre logement')}
        </Title>
        {fileList.length > 1 && (
         <div
          style={{
           textAlign: 'center',
           margin: '10px 0',
          }}
         >
          <Text type="secondary">{t('photo.dragDrop')}</Text> 🎯📷
         </div>
        )}
       </Col>
       <Col xs={24} md={24}>
        <DndContext
         sensors={sensors}
         collisionDetection={closestCenter}
         onDragStart={handleDragStart}
         onDragEnd={onDragEnd}
         dropAnimation={{
          ...defaultDropAnimation,
          dragSourceOpacity: 0.5,
         }}
        >
         <SortableContext
          items={fileList.map((f) => f.uid)}
          strategy={verticalListSortingStrategy}
         >
          <Upload
           listType="picture-card"
           className="custom-upload"
           fileList={fileList}
           onPreview={handlePreview}
           onChange={({ fileList: newFileList }) => setFileList(newFileList)}
           beforeUpload={() => false}
           maxCount={16}
           multiple
           customRequest={({ onSuccess }) => onSuccess('ok')}
           itemRender={(originNode, file) => (
            <DraggableUploadListItem originNode={originNode} file={file} />
           )}
          >
           {fileList.length >= 16 ? null : uploadButton}
          </Upload>
         </SortableContext>
        </DndContext>

        {previewOpen && (
         <Image
          wrapperStyle={{ display: 'none' }}
          preview={{
           visible: previewOpen,
           onVisibleChange: (visible) => setPreviewOpen(visible),
          }}
          src={previewImage}
         />
        )}
       </Col>

       {fileList.length === 16 && (
        <Col xs={24}>
         <Alert message={t('photo.maxReached')} type="info" />
         <br />
        </Col>
       )}
       {uploading && (
        <Col xs={24}>
         <Progress
          percent={uploadProgress}
          status="active"
          strokeColor={{ from: '#ebdecd', to: '#aa7e42' }}
         />
        </Col>
       )}
      </Row>

      <Row justify="end">
       <Col xs={16} md={3}>
        <Button type="primary" htmlType="submit" loading={isUpdating}>
         {success ? t('messages.updateSuccess') : t('button.save')}
        </Button>
       </Col>
      </Row>
     </Form>
    </Content>
   </Layout>
   <Foot />
  </Layout>
 );
};

export default EditPhotos;
