const haversine = require('haversine-distance'); // You need to install this package
const { NearbyPlace } = require('../models');
const { Property } = require('../models');

// Create a new nearby place
const createNearbyPlace = async (req, res) => {
 try {
  const { name, address } = req.body;

  // Check if a place with the same name and address already exists
  const existingPlace = await NearbyPlace.findOne({ name, address });
  if (existingPlace) {
   return res.status(400).json({ error: 'Place already exists' });
  }

  const nearbyPlaceData = req.body;
  const nearbyPlace = await NearbyPlace.createNearbyPlace(nearbyPlaceData);
  res.status(201).json(nearbyPlace);
 } catch (error) {
  console.error('Error creating nearby place:', error);
  res
   .status(500)
   .json({ error: 'Failed to create nearbyPlace', details: error.message });
 }
};

// Update an existing nearby place
const updateNearbyPlace = async (req, res) => {
 const { id } = req.params;
 const updatedData = req.body;

 try {
  const nearbyPlace = await NearbyPlace.findByPk(id);

  if (!nearbyPlace) {
   return res.status(404).json({ error: 'Nearby place not found' });
  }

  await nearbyPlace.update(updatedData);

  res.status(200).json(nearbyPlace);
 } catch (error) {
  console.error('Error updating nearby place:', error);
  res.status(500).json({ error: 'Failed to update nearby place' });
 }
};

// Get all nearby places
const getNearbyPlaces = async (req, res) => {
 try {
  const nearbyPlaces = await NearbyPlace.findAll();
  res.status(200).json(nearbyPlaces);
 } catch (error) {
  console.error('Error getting all nearby places:', error);
  res
   .status(500)
   .json({ error: 'Failed to get all nearby places', details: error.message });
 }
};

// Get a nearby place by ID
const getNearbyPlaceById = async (req, res) => {
 const { id } = req.params;
 try {
  const nearbyPlaces = await NearbyPlace.findByPk(id);

  if (nearbyPlaces) {
   res.json(nearbyPlaces);
  } else {
   res.status(404).json('No nearby places found');
  }
 } catch (error) {
  res
   .status(500)
   .json({ error: 'Failed to get nearby place by ID', details: error.message });
 }
};

// Delete a nearby place by ID
const deleteNearbyPlace = async (req, res) => {
 try {
  const { id } = req.params;
  const nearbyPlaces = await NearbyPlace.findByPk(id);
  if (!nearbyPlaces) {
   return res.status(404).json({ error: 'Nearby Place not found' });
  }

  await nearbyPlaces.destroy();
  res.status(200).json({ message: 'Nearby Place deleted successfully' });
 } catch (error) {
  console.error('Error deleting nearby place:', error);
  res
   .status(500)
   .json({ error: 'Failed to delete nearby place', details: error.message });
 }
};

const getNearbyPlacesbyLatLon = async (propertyLat, propertyLon) => {
 console.log(JSON.stringify({ latitude: propertyLat, longitude: propertyLon }));
 const RADIUS = 10000; // Radius in meters (10 kilometers)
 // Parse latitude and longitude as floats
 const lat = parseFloat(propertyLat);
 const lon = parseFloat(propertyLon);
 // Get all places
 let places;
 try {
  places = await NearbyPlace.findAll();
  console.log(JSON.stringify(`Found ${places.length} places`)); // Log the number of places found
 } catch (error) {
  console.error('Error fetching places:', error); // Log any errors
  return [];
 }

 // Calculate distance for each place and add it to the place object
 const placesWithDistance = places.map((place) => {
  const placeCoords = { latitude: place.latitude, longitude: place.longitude };
  const propertyCoords = { latitude: lat, longitude: lon };
  const distance = haversine(placeCoords, propertyCoords);
  return { ...place.toJSON(), distance };
 });

 // Sort places by distance
 const sortedPlaces = placesWithDistance.sort(
  (a, b) => a.distance - b.distance
 );

 // Filter places within 10km radius
 const nearbyPlaces = sortedPlaces.filter((place) => place.distance <= RADIUS);

 return nearbyPlaces;
};

const getNearbyPlacesByPlaceLatLon = async (req, res) => {
 const { latitude, longitude } = req.query;
 console.log(JSON.stringify(`Latitude: ${latitude}, Longitude: ${latitude}`)); // Add this line

 if (!latitude || !longitude) {
  return res.status(400).json({ error: 'Latitude and longitude are required' });
 }

 try {
  const nearbyPlaces = await getNearbyPlacesbyLatLon(latitude, longitude);
  if (nearbyPlaces.length === 0) {
   return res.status(500).json({ error: 'Something went wrong' });
  }
  res.json(nearbyPlaces);
 } catch (error) {
  res.status(500).json({ error: 'Something went wrong' });
 }
};

module.exports = {
 createNearbyPlace,
 updateNearbyPlace,
 getNearbyPlaceById,
 getNearbyPlaces,
 deleteNearbyPlace,
 getNearbyPlacesByPlaceLatLon,
};
