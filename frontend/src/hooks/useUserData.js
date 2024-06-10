import { useState } from 'react';
import axios from 'axios';

export const useUserData = () => {
 const [userData, setUserData] = useState({});
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
 const getUserDataById = async (id) => {
  setIsLoading(true);
  try {
   const params = {
    url: `/api/v1/propertymanagers/${id}`,
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

 return {
  isLoading,
  userData,
  getUserData,
  getUserDataById,
  updatePropertyManager,
  updateAvatar,
  updatePassword,
  success,
  error,
  errorMsg,
 };
};
