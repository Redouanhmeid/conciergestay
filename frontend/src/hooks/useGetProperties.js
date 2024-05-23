import { useState } from 'react';
import axios from 'axios';

const useGetProperties = () => {
 const [properties, setProperties] = useState([]);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState(null);

 const fetchAllProperties = async () => {
  setError(null);
  try {
   const response = await axios.get(`/api/v1/properties`);
   setProperties(response.data);
  } catch (err) {
   console.error('Error fetching properties:', err);
   setError(err.message);
  } finally {
   setLoading(false);
  }
 };

 const fetchProperties = async (propertyManagerId) => {
  try {
   const response = await axios.get(
    `/api/v1/properties/bypm/${propertyManagerId}`
   );
   setProperties(response.data);
   setLoading(false);
  } catch (error) {
   console.error('Error fetching properties:', error);
   setLoading(false);
  }
 };

 return { properties, loading, fetchAllProperties, fetchProperties };
};

export default useGetProperties;
