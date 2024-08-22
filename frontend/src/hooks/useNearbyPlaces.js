import { useEffect, useState } from 'react';

const useNearbyPlaces = (latitude, longitude) => {
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState(null);
 const [data, setData] = useState(null);

 useEffect(() => {
  const fetchData = async () => {
   try {
    const response = await fetch(
     `/api/v1/nearbyplaces/nearby-places?latitude=${latitude}&longitude=${longitude}`
    );
    if (!response.ok) {
     throw new Error('Aucun endroit à proximité à montrer');
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

export default useNearbyPlaces;
