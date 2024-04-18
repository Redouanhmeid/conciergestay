import { useEffect, useState } from 'react';
import axios from 'axios';

const useGetProperties = (propertyManagerId) => {
 const [properties, setProperties] = useState([]);
 const [loading, setLoading] = useState(true);

 useEffect(() => {
  const fetchProperties = async () => {
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

  fetchProperties();
 }, [propertyManagerId]);

 return { properties, loading };
};

export default useGetProperties;
