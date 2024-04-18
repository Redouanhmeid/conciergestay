import { useState } from 'react';

const useCreateNearbyPlace = () => {
 const [loading, setLoading] = useState(false);
 const [error, setError] = useState(null);
 const [success, setSuccess] = useState(false);

 const createNearbyPlace = async (nearbyPlaceData) => {
  setLoading(true);
  try {
   const response = await fetch('/api/v1/nearbyplaces', {
    method: 'POST',
    headers: {
     'Content-Type': 'application/json',
    },
    body: JSON.stringify(nearbyPlaceData),
   });
   const data = await response.json();
   if (!response.ok) {
    throw new Error(data.message || 'Failed to create nearby place');
   }
   setSuccess(true);
  } catch (error) {
   setError(error.message);
   console.log('Error:', error);
  }
  setLoading(false);
 };

 return { loading, error, success, createNearbyPlace };
};

export default useCreateNearbyPlace;
