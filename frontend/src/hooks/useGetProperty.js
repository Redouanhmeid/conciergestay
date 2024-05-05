import { useEffect, useState } from 'react';
import axios from 'axios';

const useGetProperty = (id) => {
 const [property, setProperty] = useState([]);
 const [loading, setLoading] = useState(true);

 useEffect(() => {
  const fetchProperty = async () => {
   try {
    const response = await axios.get(`/api/v1/properties/${id}`);
    setProperty(response.data);
    setLoading(false);
   } catch (error) {
    console.error('Error fetching properties:', error);
    setLoading(false);
   }
  };

  fetchProperty();
 }, [id]);

 return { property, loading };
};

export default useGetProperty;
