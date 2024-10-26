import { useState } from 'react';
import axios from 'axios';

const useAmenity = () => {
 const [loading, setLoading] = useState(false);
 const [error, setError] = useState(null);

 const getAllAmenities = async (propertyId) => {
  setLoading(true);
  try {
   const response = await axios.get(`/api/v1/amenities/${propertyId}`);
   return response.data;
  } catch (error) {
   setError(error);
   return null;
  } finally {
   setLoading(false);
  }
 };

 const getOneAmenity = async (id) => {
  setLoading(true);
  try {
   const response = await axios.get(`/api/v1/amenities/one/${id}`);
   setLoading(false);
   return response.data;
  } catch (error) {
   setLoading(false);
   setError(error);
   return null;
  }
 };

 const postAmenity = async (amenityData) => {
  setLoading(true);
  try {
   const response = await axios.post(`/api/v1/amenities/`, amenityData);
   setLoading(false);
   return response.data;
  } catch (error) {
   setLoading(false);
   setError(error);
   return null;
  }
 };

 const updateAmenity = async (amenityData) => {
  try {
   const response = await axios.put(
    `/api/v1/amenities/${amenityData.id}`,
    amenityData
   );
   return response.data;
  } catch (error) {
   setError(error);
   return null;
  }
 };

 const deleteAmenity = async (id) => {
  setLoading(true);
  try {
   const response = await axios.delete(`/api/v1/amenities/${id}`);
   setLoading(false);
   return response.data;
  } catch (error) {
   setLoading(false);
   setError(error);
   return null;
  }
 };

 return {
  loading,
  error,
  getAllAmenities,
  getOneAmenity,
  postAmenity,
  updateAmenity,
  deleteAmenity,
 };
};

export default useAmenity;
