import { useState } from 'react';
import axios from 'axios';

export const useUserData = () => {
 const [userData, setUserData] = useState({});
 const [isLoading, setIsLoading] = useState(true);

 const getUserData = async (userEmail) => {
  var params = {
   url: `/api/v1/propertymanagers/email/${userEmail}`,
   method: 'get',
   rejectUnauthorized: false, //add when working with https sites
   requestCert: false, //add when working with https sites
   agent: false, //add when working with https sites
  };
  const json = await axios(params);
  await setUserData(json.data);
  setIsLoading(false);
 };

 return { isLoading, userData, getUserData };
};
