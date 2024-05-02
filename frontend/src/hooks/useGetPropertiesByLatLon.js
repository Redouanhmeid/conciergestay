import { useEffect, useState } from 'react';

const useGetPropertiesByLatLon = (latitude, longitude) => {
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState(null);
 const [data, setData] = useState(null);

 useEffect(() => {
  const fetchData = async () => {
   try {
    const response = await fetch(
     `/api/v1/properties/properties?latitude=${latitude}&longitude=${longitude}`
    );
    if (!response.ok) {
     throw new Error('Failed to fetch data');
    }
    const json = await response.json();
    setData(json);
   } catch (error) {
    setError(error);
   } finally {
    setLoading(false);
   }
  };

  fetchData();
 }, [latitude, longitude]);
 return { loading, error, data };
};

export default useGetPropertiesByLatLon;
