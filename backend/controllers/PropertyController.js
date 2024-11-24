const haversine = require('haversine-distance');
const { Property, Amenity } = require('../models');
const { deletePropertyFiles } = require('../helpers/utils');

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
 try {
  const properties = await Property.findAll({
   where: {
    status: 'enable', // Filters properties with status 'enable'
   },
  });
  res.json(properties); // Send the filtered properties as the response
 } catch (error) {
  console.error('Error fetching properties:', error);
  res.status(500).json({ error: 'Failed to fetch properties' });
 }
};
// find all Pending Properties
const getPendingProperties = async (req, res) => {
 try {
  // Find all properties with a status of 'pending'
  const pendingProperties = await Property.findAll({
   where: { status: 'pending' },
  });

  res.status(200).json(pendingProperties);
 } catch (error) {
  console.error(error);
  res.status(500).json({ error: 'Failed to retrieve pending properties' });
 }
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

  const amenities = await Amenity.findAll({
   where: { propertyId: id },
  });
  const property = await Property.findByPk(id);

  if (!property) {
   return res.status(404).json({ error: 'Property not found' });
  }

  // Add the amenities to the property object
  property.Amenities = amenities;

  // Delete all associated files first
  try {
   await deletePropertyFiles(property);
  } catch (fileError) {
   console.error('Error deleting property files:', fileError);
   // Continue with property deletion even if some files fail to delete
  }

  // Delete the property from database

  await property.destroy();

  res.status(200).json({ message: 'Property deleted successfully' });
 } catch (error) {
  console.error(error);
  res.status(500).json({ error: 'Failed to delete property' });
 }
};

const getPropertiesbyLatLon = async (propertyLat, propertyLon) => {
 const RADIUS = 10000; // Radius in meters (10 kilometers)
 // Parse latitude and longitude as floats
 const lat = parseFloat(propertyLat);
 const lon = parseFloat(propertyLon);
 // Get all places
 let places;
 try {
  // Fetch only properties with status 'enable'
  places = await Property.findAll({
   where: {
    status: 'enable', // Filter to include only enabled properties
   },
  });
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

const updatePropertyBasicInfo = async (req, res) => {
 try {
  const { id } = req.params;
  const { name, description, type, airbnbUrl, bookingUrl } = req.body;
  const property = await Property.findByPk(id);
  if (!property) {
   return res.status(404).json({ error: 'Property not found' });
  }
  await property.update({ name, description, type, airbnbUrl, bookingUrl });
  res.status(200).json(property);
 } catch (error) {
  console.error(error);
  res.status(500).json({ error: 'Failed to update property basic info' });
 }
};

const updatePropertyAmenities = async (req, res) => {
 try {
  const { id } = req.params;
  const { basicAmenities } = req.body;
  const property = await Property.findByPk(id);
  if (!property) {
   return res.status(404).json({ error: 'Property not found' });
  }
  await property.update({ basicAmenities });
  res.status(200).json(property);
 } catch (error) {
  console.error(error);
  res.status(500).json({ error: 'Failed to update property amenities' });
 }
};

const updatePropertyCapacity = async (req, res) => {
 try {
  const { id } = req.params;
  const { price, capacity, rooms, beds } = req.body;
  const property = await Property.findByPk(id);
  if (!property) {
   return res.status(404).json({ error: 'Property not found' });
  }
  await property.update({ price, capacity, rooms, beds });
  res.status(200).json(property);
 } catch (error) {
  console.error(error);
  res.status(500).json({ error: 'Failed to update property capacity' });
 }
};

const updatePropertyRules = async (req, res) => {
 try {
  const { id } = req.params;
  const { houseRules } = req.body;
  const property = await Property.findByPk(id);
  if (!property) {
   return res.status(404).json({ error: 'Property not found' });
  }
  await property.update({ houseRules });
  res.status(200).json(property);
 } catch (error) {
  console.error(error);
  res.status(500).json({ error: 'Failed to update property rules' });
 }
};

const updatePropertyCheckIn = async (req, res) => {
 try {
  const { id } = req.params;
  const {
   checkInTime,
   earlyCheckIn,
   frontPhoto,
   accessToProperty,
   guestAccessInfo,
   videoCheckIn,
  } = req.body;
  const property = await Property.findByPk(id);
  if (!property) {
   return res.status(404).json({ error: 'Property not found' });
  }
  await property.update({
   checkInTime,
   earlyCheckIn,
   frontPhoto,
   accessToProperty,
   guestAccessInfo,
   videoCheckIn,
  });
  res.status(200).json(property);
 } catch (error) {
  console.error(error);
  res.status(500).json({ error: 'Failed to update property check-in info' });
 }
};

const updatePropertyCheckOut = async (req, res) => {
 try {
  const { id } = req.params;
  const {
   checkOutTime,
   lateCheckOutPolicy,
   beforeCheckOut,
   additionalCheckOutInfo,
  } = req.body;
  const property = await Property.findByPk(id);
  if (!property) {
   return res.status(404).json({ error: 'Property not found' });
  }
  await property.update({
   checkOutTime,
   lateCheckOutPolicy,
   beforeCheckOut,
   additionalCheckOutInfo,
  });
  res.status(200).json(property);
 } catch (error) {
  console.error(error);
  res.status(500).json({ error: 'Failed to update property check-out info' });
 }
};

const updatePropertyPhotos = async (req, res) => {
 try {
  const { id } = req.params;
  const { photos } = req.body;
  const property = await Property.findByPk(id);
  if (!property) {
   return res.status(404).json({ error: 'Property not found' });
  }
  await property.update({ photos });
  res.status(200).json(property);
 } catch (error) {
  console.error(error);
  res.status(500).json({ error: 'Failed to update property photos' });
 }
};

const verifyProperty = async (req, res) => {
 try {
  const { id } = req.params;
  const property = await Property.findByPk(id);

  if (!property) {
   return res.status(404).json({ error: 'Property not found' });
  }

  // Ensure only `pending` properties can be verified
  if (property.status !== 'pending') {
   return res.status(400).json({ error: 'Property is not in pending status' });
  }

  // Set the property status to `verified`
  await property.update({ status: 'published' });
  res
   .status(200)
   .json({ message: 'Property published successfully', property });
 } catch (error) {
  console.error(error);
  res.status(500).json({ error: 'Failed to published property' });
 }
};

const bulkVerifyProperties = async (req, res) => {
 try {
  const { ids } = req.body; // Expecting an array of property IDs

  if (!Array.isArray(ids) || ids.length === 0) {
   return res.status(400).json({ error: 'Invalid or missing property IDs' });
  }

  const properties = await Property.findAll({
   where: {
    id: ids,
   },
  });

  if (properties.length === 0) {
   return res
    .status(404)
    .json({ error: 'No properties found for the given IDs' });
  }

  const results = await Promise.all(
   properties.map(async (property) => {
    if (property.status === 'pending') {
     await property.update({ status: 'enable' });
     return { id: property.id, status: 'success' };
    }
    return {
     id: property.id,
     status: 'failed',
     reason: 'Not in pending status',
    };
   })
  );

  const successfulUpdates = results.filter(
   (result) => result.status === 'success'
  );
  const failedUpdates = results.filter((result) => result.status === 'failed');

  res.status(200).json({
   message: 'Bulk verification process completed',
   successful: successfulUpdates,
   failed: failedUpdates,
  });
 } catch (error) {
  console.error(error);
  res.status(500).json({ error: 'Failed to bulk verify properties' });
 }
};

const toggleEnableProperty = async (req, res) => {
 try {
  const { id } = req.params;
  const property = await Property.findByPk(id);

  if (!property) {
   return res.status(404).json({ error: 'Property not found' });
  }

  // Toggle between `enable` and `disable`
  const newStatus = property.status === 'enable' ? 'disable' : 'enable';
  await property.update({ status: newStatus });
  res
   .status(200)
   .json({ message: `Property ${newStatus} successfully`, property });
 } catch (error) {
  console.error(error);
  res.status(500).json({ error: 'Failed to update property status' });
 }
};

module.exports = {
 getProperties,
 getPendingProperties,
 getProperty,
 getPropertiesByManagerId,
 createProperty,
 updateProperty,
 deleteProperty,
 getPropertiesByPlaceLatLon,
 updatePropertyBasicInfo,
 updatePropertyAmenities,
 updatePropertyCapacity,
 updatePropertyRules,
 updatePropertyCheckIn,
 updatePropertyCheckOut,
 updatePropertyPhotos,
 verifyProperty,
 bulkVerifyProperties,
 toggleEnableProperty,
};
