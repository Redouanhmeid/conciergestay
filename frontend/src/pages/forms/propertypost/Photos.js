import React, { useState } from 'react';
import { Row, Col, Divider, Upload, Modal, message, Image } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import ImgCrop from 'antd-img-crop';

const getBase64 = (file) =>
 new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result);
  reader.onerror = (error) => reject(error);
 });

const Photos = ({ onPhotosChange, photos }) => {
 const [previewOpen, setPreviewOpen] = useState(false);
 const [previewImage, setPreviewImage] = useState('');
 const [previewTitle, setPreviewTitle] = useState('');
 const [fileList, setFileList] = useState([]);
 const [uploading, setUploading] = useState(false);

 const handleCancel = () => setPreviewOpen(false);

 const handlePreview = async (file) => {
  if (!file.url && !file.preview) {
   file.preview = await getBase64(file.originFileObj);
  }
  file.error = false;
  setPreviewImage(file.url || file.preview);
  setPreviewOpen(true);
  setPreviewTitle(
   file.name || file.url.substring(file.url.lastIndexOf('/') + 1)
  );
 };

 const handleChange = async ({ fileList: newFileList }) => {
  setFileList(newFileList);

  if (newFileList.length === 8) {
   message.warning('Vous avez atteint le nombre maximum de photos.');
  }

  if (newFileList.length === 0) {
   setUploading(false);
  }

  // Upload files
  if (newFileList.length > fileList.length) {
   setUploading(true);
   // Simulate uploading
   setTimeout(() => {
    setUploading(false);
    message.success('Toutes les photos ont été téléchargées avec succès.');
   }, 2000);
  }

  onPhotosChange(newFileList); // Send updated fileList to parent component
 };

 const handleRemove = (file) => {
  const newFileList = fileList.filter((item) => item !== file);
  setFileList(newFileList);
 };

 const uploadButton = (
  <div>
   {uploading ? (
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

 return (
  <Row gutter={[24, 0]}>
   <Col xs={24} md={24}>
    <Divider orientation="left">Ajouter des Photos de votre logement</Divider>
   </Col>
   <Col xs={24} md={24}>
    <ImgCrop rotationSlider>
     <Upload
      action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
      listType="picture-card"
      fileList={fileList}
      onPreview={handlePreview}
      onChange={handleChange}
      onRemove={handleRemove}
      disabled={uploading}
     >
      {fileList.length >= 8 ? null : uploadButton}
     </Upload>
    </ImgCrop>
    <Modal open={previewOpen} footer={null} onCancel={handleCancel}>
     <Image width={200} src={previewImage} />
    </Modal>
   </Col>
  </Row>
 );
};

export default Photos;
