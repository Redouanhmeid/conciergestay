const haversine = require('haversine-distance');
const { Property } = require('../models');

// find one Property
const getProperty = async (req, res) => {
 Property.findOne({ where: { id: req.params.id } }).then((property) => {
  res.json(property);
 });
};
// find Property by propertyManagerId
const getPropertiesByManagerId = async (req, res) => {
 const propertyManagerId = req.params.id; // Assuming id is passed in the URL params
 Property.findAll({ where: { propertyManagerId } }).then((properties) => {
  res.json(properties);
 });
};
// find all Properties
const getProperties = async (req, res) => {
 Property.findAll().then((property) => {
  res.json(property);
 });
};

const createProperty = async (req, res) => {
 try {
  const propertyData = req.body;
  const property = await Property.createProperty(propertyData);
  res.status(201).json(property);
 } catch (error) {
  console.error(error);
  res.status(500).json({ error: 'Failed to create property' });
 }
};

const updateProperty = async (req, res) => {
 try {
  const { id } = req.params;
  const propertyData = req.body;
  const property = await Property.findByPk(id);
  if (!property) {
   return res.status(404).json({ error: 'Property not found' });
  }
  await property.update(propertyData);

  res.status(200).json(property);
 } catch (error) {
  console.error(error);
  res.status(500).json({ error: 'Failed to update property' });
 }
};

const deleteProperty = async (req, res) => {
 try {
  const { id } = req.params;

  const property = await Property.findByPk(id);
  if (!property) {
   return res.status(404).json({ error: 'Property not found' });
  }

  await property.destroy();

  res.status(200).json({ message: 'Property deleted successfully' });
 } catch (error) {
  console.error(error);
  res.status(500).json({ error: 'Failed to delete property' });
 }
};

const getPropertiesbyLatLon = async (propertyLat, propertyLon) => {
 console.log(JSON.stringify({ latitude: propertyLat, longitude: propertyLon }));
 const RADIUS = 10000; // Radius in meters (10 kilometers)
 // Parse latitude and longitude as floats
 const lat = parseFloat(propertyLat);
 const lon = parseFloat(propertyLon);
 // Get all places
 let places;
 try {
  places = await Property.findAll();
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
 const properties = sortedPlaces.filter((place) => place.distance <= RADIUS);

 return properties;
};

const getPropertiesByPlaceLatLon = async (req, res) => {
 const { latitude, longitude } = req.query;
 console.log(JSON.stringify(`Latitude: ${latitude}, Longitude: ${longitude}`)); // Add this line

 if (!latitude || !longitude) {
  return res.status(400).json({ error: 'Latitude and longitude are required' });
 }

 try {
  const property = await getPropertiesbyLatLon(latitude, longitude);
  if (property.length === 0) {
   return res.status(500).json({ error: 'Something went wrong' });
  }
  res.json(property);
 } catch (error) {
  res.status(500).json({ error: 'Something went wrong' });
 }
};

module.exports = {
 getProperties,
 getProperty,
 getPropertiesByManagerId,
 createProperty,
 updateProperty,
 deleteProperty,
 getPropertiesByPlaceLatLon,
};
