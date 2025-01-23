import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import useNotification from './useNotification';

const useProperty = () => {
 const [properties, setProperties] = useState([]);
 const [property, setProperty] = useState([]);
 const [pendingProperties, setPendingProperties] = useState([]);
 const [loading, setLoading] = useState(false);
 const [success, setSuccess] = useState(false);
 const [error, setError] = useState(null);

 const { createPropertyVerificationNotification } = useNotification();

 const apiBase = '/api/v1/properties';

 // Fetch all properties
 const fetchAllProperties = async () => {
  setError(null);
  try {
   const response = await axios.get(`${apiBase}`);
   setProperties(response.data);
  } catch (err) {
   console.error('Error fetching properties:', err);
   setError(err.message);
  } finally {
   setLoading(false);
  }
 };

 // Fetch properties by id
 const fetchProperty = async (id) => {
  try {
   const response = await axios.get(`${apiBase}/${id}`);
   setProperty(response.data);
   setLoading(false);
  } catch (error) {
   console.error('Error fetching properties:', error);
   setLoading(false);
  }
 };

 // Fetch properties by manager id
 const fetchPropertiesbypm = async (propertyManagerId) => {
  setLoading(true);
  setError(null);
  try {
   const response = await axios.get(`${apiBase}/bypm/${propertyManagerId}`);
   setProperties(response.data);
  } catch (error) {
   console.error('Error fetching properties:', error);
  } finally {
   setLoading(false);
  }
 };

 // Fetch pending properties
 const fetchPendingProperties = useCallback(async () => {
  setLoading(true);
  setError(null);
  try {
   const response = await axios.get(`${apiBase}/pending`);
   setPendingProperties(response.data);
  } catch (err) {
   setError(err.message || 'Failed to fetch pending properties.');
  } finally {
   setLoading(false);
  }
 }, [apiBase]);

 // Verify a property
 const verifyProperty = async (propertyManagerId, id, propertyName) => {
  setLoading(true);
  setError(null);
  try {
   const response = await axios.put(`${apiBase}/${id}/verify`);
   // Optimistically update the local state
   setPendingProperties((prev) => prev.filter((prop) => prop.id !== id));
   // Send notification
   if (response.data) {
    await createPropertyVerificationNotification(
     propertyManagerId,
     id,
     propertyName
    );
   }

   return response.data;
  } catch (err) {
   setError(err.message || `Failed to verify property with ID: ${id}`);
  } finally {
   setLoading(false);
  }
 };

 // Toggle property publish status
 const toggleEnableProperty = async (id) => {
  setLoading(true);
  setError(null);
  try {
   await axios.put(`${apiBase}/${id}/toggleenable`);
   // Optionally, refresh the data or provide feedback to the user
  } catch (err) {
   setError(
    err.message || `Failed to toggle publish status for property ID: ${id}`
   );
  } finally {
   setLoading(false);
  }
 };

 // Bulk verify properties
 const bulkVerifyProperties = async (ids) => {
  setLoading(true);
  setError(null);
  try {
   // First, get all properties details
   const propertiesResponse = await Promise.all(
    ids.map((id) => axios.get(`/api/v1/properties/${id}`))
   );
   const properties = propertiesResponse.map((response) => response.data);

   const response = await axios.post(`${apiBase}/bulkVerify`, { ids });
   const { successful, failed } = response.data;

   // Optimistically update the state to remove successfully verified properties
   setPendingProperties((prev) =>
    prev.filter((prop) => !successful.some((success) => success.id === prop.id))
   );

   if (response.data) {
    await Promise.all(
     properties.map((property) =>
      createPropertyVerificationNotification(
       property.propertyManagerId,
       property.id,
       property.name
      )
     )
    );
   }

   return { successful, failed }; // Return the results for further handling if needed
  } catch (err) {
   setError(err.message || 'Failed to bulk verify properties.');
   return null; // Return null to indicate failure
  } finally {
   setLoading(false);
  }
 };

 const deleteProperty = async (id) => {
  setLoading(true);
  setSuccess(false);
  setError(null);
  try {
   await axios.delete(`${apiBase}/${id}`);
   setSuccess(true);
  } catch (err) {
   console.error('Error deleting property:', err);
   setError(err);
  } finally {
   setLoading(false);
  }
 };

 useEffect(() => {
  fetchPendingProperties();
 }, [fetchPendingProperties]);

 const getPropertyManagerTasks = async (managerId) => {
  setLoading(true);
  try {
   let url = `${apiBase}/propertytask/manager/${managerId}/tasks`;
   const response = await axios.get(url);
   return response.data;
  } catch (error) {
   setError(error);
   return null;
  } finally {
   setLoading(false);
  }
 };

 return {
  properties,
  property,
  pendingProperties,
  loading,
  success,
  error,
  fetchAllProperties,
  fetchProperty,
  fetchPropertiesbypm,
  fetchPendingProperties,
  verifyProperty,
  bulkVerifyProperties,
  toggleEnableProperty,
  deleteProperty,
  getPropertyManagerTasks,
 };
};

export default useProperty;
