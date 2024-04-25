import { useState } from 'react';

const useCreateProperty = () => {
 const [loading, setLoading] = useState(false);
 const [error, setError] = useState(null);
 const [success, setSuccess] = useState(false);

 const createProperty = async (nearbyPlaceData) => {
  setLoading(true);
  try {
   const response = await fetch('/api/v1/properties', {
    method: 'POST',
    headers: {
     'Content-Type': 'application/json',
    },
    body: JSON.stringify(nearbyPlaceData),
   });
   const data = await response.json();
   if (!response.ok) {
    throw new Error(data.message || 'Failed to create property');
   }
   setSuccess(true);
  } catch (error) {
   setError(error.message);
  }
  setLoading(false);
 };

 return { loading, error, success, createProperty };
};

export default useCreateProperty;
