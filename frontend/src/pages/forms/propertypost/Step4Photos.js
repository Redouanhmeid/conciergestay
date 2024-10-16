import React, { useState } from 'react';
import {
 Layout,
 Form,
 Row,
 Col,
 Upload,
 Modal,
 Image,
 Button,
 Alert,
 Typography,
} from 'antd';
import {
 DndContext,
 closestCenter,
 PointerSensor,
 useSensor,
 useSensors,
} from '@dnd-kit/core';
import {
 SortableContext,
 arrayMove,
 useSortable,
 verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Head from '../../../components/common/header';
import Foot from '../../../components/common/footer';
import {
 ArrowLeftOutlined,
 ArrowRightOutlined,
 PlusOutlined,
} from '@ant-design/icons';
import ImgCrop from 'antd-img-crop';
import useUploadPhotos from '../../../hooks/useUploadPhotos';

const { Content } = Layout;
const { Title } = Typography;

const getBase64 = (file) =>
 new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result);
  reader.onerror = (error) => reject(error);
 });

const DraggableUploadListItem = ({ originNode, file }) => {
 const { attributes, listeners, setNodeRef, transform, transition } =
  useSortable({
   id: file.uid,
  });
 const style = {
  transform: CSS.Transform.toString(transform),
  transition,
  cursor: 'move',
 };
 return (
  <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
   {originNode}
  </div>
 );
};

const Step4Photos = ({ next, prev, values }) => {
 const { uploadPhotos, uploading } = useUploadPhotos();
 const [previewOpen, setPreviewOpen] = useState(false);
 const [previewImage, setPreviewImage] = useState('');
 const [fileList, setFileList] = useState([]);
 const [upload, setUpload] = useState(false);

 const sensors = useSensors(
  useSensor(PointerSensor, {
   activationConstraint: {
    distance: 8,
   },
  })
 );

 const handlePreview = async (file) => {
  if (!file.url && !file.preview) {
   file.preview = await getBase64(file.originFileObj);
  }
  file.error = false;
  setPreviewImage(file.url || file.preview);
  setPreviewOpen(true);
 };

 const handleChange = async ({ fileList: newFileList }) => {
  setFileList(newFileList);

  if (newFileList.length === 0) {
   setUpload(false);
  }

  // Upload files
  if (newFileList.length > fileList.length) {
   setUpload(true);
   // Simulate uploading
   setTimeout(() => {
    setUpload(false);
   }, 2000);
  }
 };

 const handleRemove = (file) => {
  const newFileList = fileList.filter((item) => item !== file);
  setFileList(newFileList);
 };

 const onDragEnd = (event) => {
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
   {upload ? (
    <div style={{ marginTop: 8 }}>Téléchargement en cours...</div>
   ) : (
    <button
     style={{
      border: 0,
      background: 'none',
     }}
     type="button"
    >
     <PlusOutlined />
     <div
      style={{
       marginTop: 8,
      }}
     >
      Ajouter des Photos
     </div>
    </button>
   )}
  </div>
 );
 const submitFormData = async () => {
  try {
   const photoUrls = await uploadPhotos(fileList);
   values.photos = photoUrls;
  } catch (error) {
   console.error('Error uploading photos:', error);
  }
  next();
 };
 return (
  <Layout className="contentStyle">
   <Head />
   <Layout>
    <Content className="container">
     <Form
      name="step4"
      layout="vertical"
      onFinish={submitFormData}
      size="large"
     >
      <Row gutter={[24, 0]}>
       <Col xs={24} md={24}>
        <Title level={2}>Ajouter des Photos de votre logement</Title>
       </Col>
       <Col xs={24} md={24}>
        <DndContext
         sensors={sensors}
         collisionDetection={closestCenter}
         onDragEnd={onDragEnd}
        >
         <SortableContext
          items={fileList.map((f) => f.uid)}
          strategy={verticalListSortingStrategy}
         >
          <ImgCrop
           aspect={640 / 426}
           modalTitle="Modifier l'image"
           rotationSlider
          >
           <Upload
            listType="picture-card"
            className="custom-upload"
            fileList={fileList}
            onPreview={handlePreview}
            onChange={handleChange}
            itemRender={(originNode, file) => (
             <DraggableUploadListItem originNode={originNode} file={file} />
            )}
           >
            {fileList.length >= 16 ? null : uploadButton}
           </Upload>
          </ImgCrop>
         </SortableContext>
        </DndContext>

        {previewOpen && (
         <Image
          wrapperStyle={{
           display: 'none',
          }}
          preview={{
           visible: previewOpen,
           onVisibleChange: (visible) => setPreviewOpen(visible),
          }}
          src={previewImage}
         />
        )}
       </Col>
      </Row>
      <br />
      {fileList.length === 16 && (
       <>
        <Alert
         message="Vous avez atteint le nombre maximum de photos."
         type="info"
        />
        <br />
       </>
      )}

      <Row justify="end">
       <Col xs={8} md={1}>
        <Form.Item>
         <Button
          htmlType="submit"
          shape="circle"
          onClick={prev}
          icon={<ArrowLeftOutlined />}
         />
        </Form.Item>
       </Col>
       <Col xs={16} md={3}>
        <Form.Item>
         <Button
          type="primary"
          htmlType="submit"
          style={{ width: '100%' }}
          loading={uploading}
         >
          Continue {<ArrowRightOutlined />}
         </Button>
        </Form.Item>
       </Col>
      </Row>
     </Form>
    </Content>
   </Layout>
   <Foot />
  </Layout>
 );
};

export default Step4Photos;
