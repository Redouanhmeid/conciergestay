import { useState } from 'react';

const useCreateProperty = () => {
 const [loading, setLoading] = useState(false);
 const [error, setError] = useState(null);
 const [success, setSuccess] = useState(false);
 const [propertyId, setPropertyId] = useState(null);

 const createProperty = async (firstStepData) => {
  setLoading(true);
  try {
   const initialProperty = {
    name: firstStepData.name,
    description: firstStepData.description,
    type: firstStepData.type,
    latitude: firstStepData.latitude,
    longitude: firstStepData.longitude,
    placeName: firstStepData.placeName,
    propertyManagerId: firstStepData.propertyManagerId,
    // Optional fields from step 1
    airbnbUrl: firstStepData.airbnbUrl || '',
    bookingUrl: firstStepData.bookingUrl || '',
    // Default values for required fields in the model
    basicAmenities: [],
    price: null,
    capacity: null,
    rooms: null,
    beds: null,
    houseRules: [],
    checkInTime: null,
    earlyCheckIn: [],
    accessToProperty: [],
    guestAccessInfo: '',
    videoCheckIn: '',
    checkOutTime: null,
    lateCheckOutPolicy: [],
    beforeCheckOut: [],
    additionalCheckOutInfo: '',
    photos: [],
    frontPhoto: '',
    isVerified: 0,
    isPublished: 0,
   };

   const response = await fetch('/api/v1/properties', {
    method: 'POST',
    headers: {
     'Content-Type': 'application/json',
    },
    body: JSON.stringify(initialProperty),
   });

   const data = await response.json();

   if (!response.ok) {
    throw new Error(data.message || 'Failed to create property');
   }

   setPropertyId(data.id);
   setSuccess(true);
   return data;
  } catch (error) {
   setError(error.message);
   setSuccess(false);
   throw error;
  } finally {
   setLoading(false);
  }
 };

 return { loading, error, propertyId, success, createProperty };
};

export default useCreateProperty;
