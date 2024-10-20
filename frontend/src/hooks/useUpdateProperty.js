import { useState } from 'react';
import axios from 'axios';

const useUpdateProperty = (propertyId) => {
 const [property, setProperty] = useState({});
 const [isLoading, setIsLoading] = useState(false);
 const [error, setError] = useState(null);
 const [success, setSuccess] = useState(false);

 const handleUpdate = async (endpoint, data) => {
  setIsLoading(true);
  setError(null);
  setSuccess(false);
  try {
   const response = await axios.put(
    `/api/v1/properties/${propertyId}${endpoint}`,
    data
   );
   setProperty(response.data);
   setSuccess(true);
  } catch (err) {
   console.error('Error updating property:', err);
   setError(err.message || 'An error occurred while updating the property');
  } finally {
   setIsLoading(false);
  }
 };

 const updatePropertyBasicInfo = async (data) => {
  await handleUpdate('/basic-info', data);
 };

 const updatePropertyAmenities = async (data) => {
  await handleUpdate('/equipements', data);
 };

 const updatePropertyCapacity = async (data) => {
  await handleUpdate('/capacity', data);
 };

 const updatePropertyRules = async (data) => {
  await handleUpdate('/rules', data);
 };

 const updatePropertyCheckIn = async (data) => {
  await handleUpdate('/check-in', data);
 };

 const updatePropertyCheckOut = async (data) => {
  await handleUpdate('/check-out', data);
 };

 const updatePropertyPhotos = async (data) => {
  await handleUpdate('/photos', data);
 };

 return {
  isLoading,
  error,
  success,
  property,
  updatePropertyBasicInfo,
  updatePropertyAmenities,
  updatePropertyCapacity,
  updatePropertyRules,
  updatePropertyCheckIn,
  updatePropertyCheckOut,
  updatePropertyPhotos,
 };
};

export default useUpdateProperty;
