import React, { useState } from 'react';

const useUploadPhotos = () => {
 const [uploading, setUploading] = useState(false);

 const uploadAvatar = async (avatar) => {
  const formData = new FormData();
  formData.append('avatar', avatar[0].originFileObj);
  try {
   setUploading(true);
   const response = await fetch('/upload/avatars', {
    method: 'POST',
    body: formData,
   });
   if (!response.ok) {
    throw new Error('Failed to upload Avatar');
   }
   const data = await response.json();
   setUploading(false);

   return data.file.url;
  } catch (error) {
   console.error('Error uploading Avatar:', error);
   setUploading(false);
   throw error;
  }
 };

 const uploadPhoto = async (photo) => {
  const formData = new FormData();
  formData.append('photo', photo[0].originFileObj);
  try {
   setUploading(true);
   const response = await fetch('/upload/single', {
    method: 'POST',
    body: formData,
   });
   if (!response.ok) {
    throw new Error('Failed to upload photo');
   }
   const data = await response.json();
   setUploading(false);

   return data.file.url;
  } catch (error) {
   console.error('Error uploading photo:', error);
   setUploading(false);
   throw error;
  }
 };

 const uploadPhotos = async (photos) => {
  const formData = new FormData();
  photos.forEach((photo) => {
   formData.append('photos', photo.originFileObj, photo.name);
  });
  try {
   setUploading(true);
   const response = await fetch('/upload', {
    method: 'POST',
    body: formData,
   });
   const data = await response.json();

   setUploading(false);

   return data.files.map((file) => file.url);
  } catch (error) {
   console.error('Error uploading photos:', error);
   setUploading(false);
   throw error;
  }
 };

 return { uploadPhotos, uploadPhoto, uploadAvatar, uploading };
};

export default useUploadPhotos;
