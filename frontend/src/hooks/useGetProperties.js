import { useState } from 'react';
import axios from 'axios';

const useGetProperties = () => {
 const [properties, setProperties] = useState([]);
 const [loading, setLoading] = useState(true);

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

 return { properties, loading, fetchProperties };
};

export default useGetProperties;
