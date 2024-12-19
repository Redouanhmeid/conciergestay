import React, { useState } from 'react';
import imageCompression from 'browser-image-compression';

const useUploadPhotos = () => {
 const [uploading, setUploading] = useState(false);
 const [uploadProgress, setUploadProgress] = useState(0);

 const compressImage = async (image) => {
  const options = {
   maxSizeMB: 1,
   maxWidthOrHeight: 640,
   useWebWorker: true,
  };

  try {
   const compressedFile = await imageCompression(image, options);
   return compressedFile;
  } catch (error) {
   console.error('Error compressing image:', error);
   throw error;
  }
 };

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

 const uploadPlace = async (photo) => {
  const formData = new FormData();
  formData.append('photo', photo[0].originFileObj); // Use the original file

  try {
   setUploading(true);

   const response = await fetch('/places', {
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

 const uploadAmenity = async (photo) => {
  const formData = new FormData();
  formData.append('photo', photo[0].originFileObj); // Use the original file

  try {
   setUploading(true);

   const response = await fetch('/amenities', {
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

 const uploadFrontPhoto = async (photo) => {
  const formData = new FormData();

  try {
   // Compress the photo before uploading
   const compressedPhoto = await compressImage(photo[0].originFileObj);

   // Append the compressed photo to the FormData
   formData.append('photo', compressedPhoto, photo[0].name);

   setUploading(true);

   const response = await fetch('/frontphotos', {
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

 const uploadSignature = async (signatureData, firstname, lastname) => {
  try {
   setUploading(true);

   // Convert base64 to blob
   const byteString = atob(signatureData.split(',')[1]);
   const mimeString = signatureData.split(',')[0].split(':')[1].split(';')[0];
   const ab = new ArrayBuffer(byteString.length);
   const ia = new Uint8Array(ab);

   for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
   }

   const blob = new Blob([ab], { type: mimeString });
   const timestamp = new Date().getTime();
   const filename = `signature_${firstname.toLowerCase()}_${lastname.toLowerCase()}_${timestamp}.png`;
   const file = new File([blob], filename, { type: 'image/png' });

   const formData = new FormData();
   formData.append('signature', file);

   const response = await fetch('/signatures', {
    method: 'POST',
    body: formData,
   });

   if (!response.ok) {
    throw new Error('Failed to upload signature');
   }

   const data = await response.json();
   setUploading(false);
   return data.file.url;
  } catch (error) {
   console.error('Error uploading signature:', error);
   setUploading(false);
   throw error;
  }
 };

 const uploadWithProgress = async (formData, onProgress) => {
  return new Promise((resolve, reject) => {
   const xhr = new XMLHttpRequest();

   xhr.upload.addEventListener('progress', (event) => {
    if (event.lengthComputable) {
     const percentComplete = Math.round((event.loaded / event.total) * 100);
     onProgress(percentComplete);
    }
   });

   xhr.addEventListener('load', () => {
    if (xhr.status >= 200 && xhr.status < 300) {
     const response = JSON.parse(xhr.responseText);
     resolve(response);
    } else {
     reject(new Error(`HTTP Error: ${xhr.status}`));
    }
   });

   xhr.addEventListener('error', () => {
    reject(new Error('Network Error'));
   });

   xhr.open('POST', '/upload');
   xhr.send(formData);
  });
 };

 const uploadPhotos = async (photos) => {
  try {
   setUploading(true);
   const formData = new FormData();

   for (const photo of photos) {
    const compressedPhoto = await compressImage(photo.originFileObj);
    formData.append('photos', compressedPhoto, photo.name);
   }

   const data = await uploadWithProgress(formData, (progress) => {
    setUploadProgress(progress);
   });

   return data.files.map((file) => file.url);
  } catch (error) {
   console.error('Error uploading photos:', error);
   throw error;
  } finally {
   setUploading(false);
   setUploadProgress(0);
  }
 };

 const uploadIdentity = async (identity, firstname, lastname) => {
  try {
   // Get the original file
   const originalFile = identity[0].originFileObj;

   // Get file extension from original file
   const fileExt = originalFile.name.split('.').pop();

   // Create custom filename with firstname and lastname
   const Firstname = firstname?.toLowerCase() || '';
   const Lastname = lastname?.toLowerCase() || '';
   const timestamp = new Date().getTime();
   const newFileName = `identity_${Firstname}_${Lastname}_${timestamp}.${fileExt}`;

   // Create new File object with custom name
   const customFile = new File([originalFile], newFileName, {
    type: originalFile.type,
   });
   const formData = new FormData();
   formData.append('identity', customFile);

   setUploading(true);
   const response = await fetch('/identities', {
    method: 'POST',
    body: formData,
   });
   if (!response.ok) {
    throw new Error('Failed to upload Identity');
   }
   const data = await response.json();
   setUploading(false);

   return data.file.url;
  } catch (error) {
   console.error('Error uploading Identity:', error);
   setUploading(false);
   throw error;
  }
 };

 return {
  uploadPhotos,
  uploadPlace,
  uploadAmenity,
  uploadFrontPhoto,
  uploadSignature,
  uploadAvatar,
  uploadIdentity,
  uploading,
  uploadProgress,
 };
};

export default useUploadPhotos;
