import { useState } from 'react';
import axios from 'axios';

const useUpdateProperty = () => {
 const [Property, setProperty] = useState({});
 const [isLoading, setIsLoading] = useState(false);
 const [error, setError] = useState(null);
 const [success, setSuccess] = useState(false);

 const updateProperty = async (id, property) => {
  setIsLoading(true);
  try {
   const response = await axios.put(`/api/v1/properties/${id}`, property);
   setProperty(response.data); // Assuming response.data is the updated property
   setSuccess(true);
  } catch (error) {
   console.error('Error updating property:', error);
   setError(error.message);
   setSuccess(false);
  } finally {
   setIsLoading(false);
  }
 };

 return { isLoading, error, success, updateProperty, Property };
};

export default useUpdateProperty;
