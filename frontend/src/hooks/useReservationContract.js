import { useState } from 'react';
import axios from 'axios';

const useReservationContract = () => {
 const [loading, setLoading] = useState(false);
 const [error, setError] = useState(null);

 const apiBase = '/api/v1/reservationcontract/';

 // Create a new contract
 const createContract = async (contractData) => {
  setLoading(true);
  setError(null);
  try {
   const response = await axios.post(`${apiBase}/contracts`, contractData);
   return response.data;
  } catch (err) {
   setError(err.response?.data?.error || 'Failed to create contract');
   throw err;
  } finally {
   setLoading(false);
  }
 };

 // Update an existing contract
 const updateContract = async (contractId, updatedData) => {
  setLoading(true);
  setError(null);
  try {
   const response = await axios.put(
    `${apiBase}/contracts/${contractId}`,
    updatedData
   );
   return response.data;
  } catch (err) {
   setError(err.response?.data?.error || 'Failed to update contract');
   throw err;
  } finally {
   setLoading(false);
  }
 };

 // Update contract status
 const updateContractStatus = async (contractId, status) => {
  setLoading(true);
  setError(null);
  try {
   const response = await axios.patch(
    `${apiBase}/contracts/${contractId}/status`,
    {
     status,
    }
   );
   return response.data;
  } catch (err) {
   setError(err.response?.data?.error || 'Failed to update contract status');
   throw err;
  } finally {
   setLoading(false);
  }
 };

 // Get contracts for a property
 const getContractsByProperty = async (propertyId) => {
  setLoading(true);
  setError(null);
  try {
   const response = await axios.get(`${apiBase}/properties/${propertyId}`);
   return response.data;
  } catch (err) {
   setError(err.response?.data?.error || 'Failed to fetch contracts');
   throw err;
  } finally {
   setLoading(false);
  }
 };

 // Get a single contract by ID
 const getContractById = async (contractId) => {
  setLoading(true);
  setError(null);
  try {
   const response = await axios.get(`${apiBase}/contracts/${contractId}`);
   return response.data;
  } catch (err) {
   setError(err.response?.data?.error || 'Failed to fetch contract');
   throw err;
  } finally {
   setLoading(false);
  }
 };

 // Check property availability
 const checkAvailability = async (
  propertyId,
  startDate,
  endDate,
  excludeContractId = null
 ) => {
  setLoading(true);
  setError(null);
  try {
   const params = new URLSearchParams({
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
    ...(excludeContractId && { excludeContractId }),
   });

   const response = await axios.get(
    `${apiBase}/properties/${propertyId}/availability?${params}`
   );
   return response.data;
  } catch (err) {
   setError(err.response?.data?.error || 'Failed to check availability');
   throw err;
  } finally {
   setLoading(false);
  }
 };

 // Delete a contract
 const deleteContract = async (contractId) => {
  setLoading(true);
  setError(null);
  try {
   await axios.delete(`${apiBase}/contracts/${contractId}`);
   return true;
  } catch (err) {
   setError(err.response?.data?.error || 'Failed to delete contract');
   throw err;
  } finally {
   setLoading(false);
  }
 };

 return {
  loading,
  error,
  createContract,
  updateContract,
  updateContractStatus,
  getContractsByProperty,
  getContractById,
  checkAvailability,
  deleteContract,
 };
};

export default useReservationContract;
