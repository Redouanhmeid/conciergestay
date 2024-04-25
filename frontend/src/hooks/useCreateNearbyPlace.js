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
    if (response.status === 400) {
     throw new Error('Le lieu existe déjà');
    } else {
     throw new Error(
      data.message || 'Échec de la création du lieu à proximité'
     );
    }
   }
   setLoading(false);
   setSuccess(true);
   return true; // Indicate success
  } catch (error) {
   console.error(error);
   setLoading(false);
   setError(error.message);
   throw error; // Indicate failure
  }
  setLoading(false);
 };

 return { loading, error, success, createNearbyPlace };
};

export default useCreateNearbyPlace;
