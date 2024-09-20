import { useState } from 'react';
import axios from 'axios';

const API_BASE_URL = '/api/v1/nearbyplaces';

const useNearbyPlace = () => {
 const [loading, setLoading] = useState(false);
 const [error, setError] = useState(null);

 // 1. Get all nearby places
 const getAllNearbyPlaces = async () => {
  try {
   setLoading(true);
   const response = await axios.get(`${API_BASE_URL}`);
   return response.data;
  } catch (err) {
   setError(err);
   throw err;
  } finally {
   setLoading(false);
  }
 };

 // 2. Get a nearby place by ID
 const getNearbyPlaceById = async (id) => {
  try {
   setLoading(true);
   const response = await axios.get(`${API_BASE_URL}/${id}`);
   return response.data;
  } catch (err) {
   setError(err);
   throw err;
  } finally {
   setLoading(false);
  }
 };

 // 3. Create a new nearby place
 const createNearbyPlace = async (placeData) => {
  try {
   setLoading(true);
   const response = await axios.post(`${API_BASE_URL}`, placeData);
   return response.data;
  } catch (err) {
   setError(err);
   console.log(err);
   throw err;
  } finally {
   setLoading(false);
  }
 };

 // 4. Update a nearby place by ID
 const updateNearbyPlace = async (id, placeData) => {
  try {
   setLoading(true);
   const response = await axios.put(`${API_BASE_URL}/${id}`, placeData);
   return response.data;
  } catch (err) {
   setError(err);
   throw err;
  } finally {
   setLoading(false);
  }
 };

 // 5. Delete a nearby place by ID
 const deleteNearbyPlace = async (id) => {
  try {
   setLoading(true);
   await axios.delete(`${API_BASE_URL}/${id}`);
   return true;
  } catch (err) {
   setError(err);
   throw err;
  } finally {
   setLoading(false);
  }
 };

 // 6. Get nearby places by latitude and longitude
 const getNearbyPlacesByLatLon = async (lat, lon) => {
  try {
   setLoading(true);
   const response = await axios.get(`${API_BASE_URL}/nearby-places`, {
    params: {
     latitude: lat,
     longitude: lon,
    },
   });
   return response.data;
  } catch (err) {
   setError("Aucun lieu à proximité n'est enregistré");
   throw err;
  } finally {
   setLoading(false);
  }
 };

 return {
  loading,
  error,
  getAllNearbyPlaces,
  getNearbyPlaceById,
  createNearbyPlace,
  updateNearbyPlace,
  deleteNearbyPlace,
  getNearbyPlacesByLatLon,
 };
};

export default useNearbyPlace;