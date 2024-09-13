import { useState, useCallback } from 'react';
import axios from 'axios';

export const useUserData = () => {
 const [userData, setUserData] = useState({});
 const [Managers, setManagers] = useState({});
 const [isLoading, setIsLoading] = useState(true);
 const [success, setSuccess] = useState(false);
 const [error, setError] = useState(false);
 const [errorMsg, setErrorMsg] = useState();

 const getUserData = async (userEmail) => {
  setIsLoading(true);
  try {
   const params = {
    url: `/api/v1/propertymanagers/email/${userEmail}`,
    method: 'get',
    rejectUnauthorized: false, //add when working with https sites
    requestCert: false, //add when working with https sites
    agent: false, //add when working with https sites
   };
   const json = await axios(params);
   setUserData(json.data);
  } catch (error) {
   console.error('Error fetching user data:', error);
  }
  setIsLoading(false);
 };

 const getUserDataById = useCallback(async (id) => {
  setIsLoading(true); // Start loading state here
  try {
   const response = await axios.get(`/api/v1/propertymanagers/${id}`, {
    rejectUnauthorized: false, // Add when working with HTTPS sites
    requestCert: false, // Add when working with HTTPS sites
    agent: false, // Add when working with HTTPS sites
   });
   setUserData(response.data);
   setIsLoading(false);
  } catch (error) {
   console.error('Error fetching user data:', error);
   setError(true);
   setErrorMsg(error.message);
   setIsLoading(false);
  }
 });

 const updatePropertyManager = async (id, firstname, lastname, phone) => {
  setIsLoading(true);
  try {
   const params = {
    url: `/api/v1/propertymanagers/${id}`,
    method: 'put',
    data: { firstname, lastname, phone },
    rejectUnauthorized: false, //add when working with https sites
    requestCert: false, //add when working with https sites
    agent: false, //add when working with https sites
   };
   const json = await axios(params);
   setSuccess(true);
   setError(false);
  } catch (error) {
   console.error('Error fetching user data:', error);
   setSuccess(false);
   setError(true);
  }
  setIsLoading(false);
 };

 const updateAvatar = async (id, avatar) => {
  setIsLoading(true);
  try {
   const params = {
    url: `/api/v1/propertymanagers/avatar/${id}`,
    method: 'put',
    data: { avatar },
    rejectUnauthorized: false, //add when working with https sites
    requestCert: false, //add when working with https sites
    agent: false, //add when working with https sites
   };
   const json = await axios(params);
   setSuccess(true);
   setError(false);
  } catch (error) {
   console.error('Error fetching user data:', error);
   setSuccess(false);
   setError(true);
  }
  setIsLoading(false);
 };

 const updatePassword = async (id, currentPassword, newPassword) => {
  setIsLoading(true);
  try {
   const response = await fetch(`/api/v1/propertymanagers/password/${id}`, {
    method: 'PUT',
    headers: {
     'Content-Type': 'application/json',
    },
    body: JSON.stringify({ currentPassword, newPassword }),
   });
   if (!response.ok) {
    throw new Error('Échec de la mise à jour du mot de passe');
   }
   setSuccess(true);
   setErrorMsg('Échec de la mise à jour du mot de passe');
   return true;
  } catch (error) {
   console.error('Erreur lors de la mise à jour du mot de passe:', error);
   setSuccess(false);
   setErrorMsg(error.message);
   return false;
  }
  setIsLoading(false);
 };

 const requestPasswordReset = async (email) => {
  setIsLoading(true);
  setError(false);
  setSuccess(false);
  setErrorMsg('');
  try {
   const response = await fetch(
    '/api/v1/propertymanagers/reset-password-request',
    {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({ email }),
    }
   );
   if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
     errorData.message ||
      'Échec de la demande de réinitialisation de mot de passe'
    );
   }
   setSuccess(true);
   setErrorMsg('');
  } catch (err) {
   setError(true);
   setErrorMsg(err.message);
  } finally {
   setIsLoading(false);
  }
 };

 const verifyResetCode = async (email, code) => {
  setIsLoading(true);
  try {
   const response = await fetch('/api/v1/propertymanagers/verify-reset-code', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, code }),
   });
   if (!response.ok)
    throw new Error('Échec de la vérification du code de réinitialisation');
   setSuccess(true);
   setErrorMsg('');
   return true;
  } catch (err) {
   setError(true);
   setErrorMsg(err.message);
   return false;
  } finally {
   setIsLoading(false);
  }
 };

 const resetPassword = async (email, code, newPassword) => {
  setIsLoading(true);
  try {
   const response = await fetch('/api/v1/propertymanagers/reset-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, code, newPassword }),
   });
   if (!response.ok)
    throw new Error('Échec de la réinitialisation du mot de passe');
   setSuccess(true);
   setErrorMsg('');
  } catch (err) {
   setError(true);
   setErrorMsg(err.message);
  } finally {
   setIsLoading(false);
  }
 };

 const fetchAllManagers = async () => {
  try {
   const response = await axios.get(`/api/v1/propertymanagers`);
   setManagers(response.data);
   setIsLoading(false);
  } catch (err) {
   console.error('Error fetching managers:', err);
   setError(err.message);
   setIsLoading(false);
  }
 };

 const fetchManagerById = async (id) => {
  try {
   const response = await axios.get(`/api/v1/propertymanagers/${id}`);
   return response.data;
  } catch (err) {
   console.error('Error fetching manager:', err);
   return null;
  }
 };

 const deleteManagerById = async (id) => {
  setIsLoading(true);
  setSuccess(false);
  setError(null);
  try {
   await axios.delete(`/api/v1/propertymanagers/${id}`);
   setSuccess(true);
   setIsLoading(false);
  } catch (err) {
   setError(err);
   setIsLoading(false);
  }
 };

 // New function to verify a manager
 const verifyManager = async (id) => {
  setIsLoading(true);
  setSuccess(false);
  setError(false);
  setErrorMsg('');

  try {
   const response = await axios.patch(`/api/v1/propertymanagers/${id}/verify`, {
    rejectUnauthorized: false, // Add when working with HTTPS sites
    requestCert: false, // Add when working with HTTPS sites
    agent: false, // Add when working with HTTPS sites
   });

   if (response.status === 200) {
    setSuccess(true);
   } else {
    throw new Error('Failed to verify the manager');
   }
  } catch (err) {
   console.error('Error verifying the manager:', err);
   setError(true);
   setErrorMsg(err.message || 'An error occurred while verifying the manager');
  } finally {
   setIsLoading(false);
  }
 };

 return {
  isLoading,
  userData,
  Managers,
  getUserData,
  getUserDataById,
  updatePropertyManager,
  updateAvatar,
  updatePassword,
  requestPasswordReset,
  verifyResetCode,
  resetPassword,
  fetchAllManagers,
  fetchManagerById,
  deleteManagerById,
  verifyManager,
  success,
  error,
  errorMsg,
 };
};
