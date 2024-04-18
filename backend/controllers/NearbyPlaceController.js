const { NearbyPlace } = require('../models');

// Create a new nearby place
const createNearbyPlace = async (req, res) => {
 try {
  const nearbyPlaceData = req.body;
  const nearbyPlace = await NearbyPlace.createNearbyPlace(nearbyPlaceData);
  res.status(201).json(nearbyPlace);
 } catch (error) {
  console.error('Error creating nearby place:', error);
  res.status(500).json({ error: 'Failed to create nearbyPlace' });
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
  res.status(500).json({ error: 'Failed to get all nearby places' });
 }
};

// Get a nearby place by ID
const getNearbyPlaceById = async (req, res) => {
 try {
  const nearbyPlaces = await NearbyPlace.findAll();
  if (nearbyPlaces) {
   res.json(nearbyPlaces);
  } else {
   res.status(404).send('No nearby places found');
  }
 } catch (error) {
  res.status(500).send(`Failed to get nearby places: ${error.message}`);
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
  res.status(500).json({ error: 'Failed to delete nearby place' });
 }
};

// get nearby places by Lat Long of a property
const getNearbyPlacesbyLatLon = async (req, res) => {
 const { propertyLatitude, propertyLongitude, maxDistance } = req.query;

 try {
  const nearbyPlaces = await NearbyPlace.findAll({
   attributes: [
    'id',
    'name',
    'description',
    'address',
    'latitude',
    'longitude',
    'photos',
   ],
   where: {
    latitude: {
     [Sequelize.Op.between]: [
      parseFloat(propertyLatitude) - 1,
      parseFloat(propertyLatitude) + 1,
     ],
    },
    longitude: {
     [Sequelize.Op.between]: [
      parseFloat(propertyLongitude) - 1,
      parseFloat(propertyLongitude) + 1,
     ],
    },
   },
  });

  const sortedNearbyPlaces = nearbyPlaces.sort((a, b) => {
   const distanceA = calculateDistance(
    propertyLatitude,
    propertyLongitude,
    a.latitude,
    a.longitude
   );
   const distanceB = calculateDistance(
    propertyLatitude,
    propertyLongitude,
    b.latitude,
    b.longitude
   );
   return distanceA - distanceB;
  });

  const nearbyPlacesWithinDistance = sortedNearbyPlaces.filter((place) => {
   const distance = calculateDistance(
    propertyLatitude,
    propertyLongitude,
    place.latitude,
    place.longitude
   );
   return distance <= parseFloat(maxDistance);
  });

  res.status(200).json(nearbyPlacesWithinDistance);
 } catch (error) {
  console.error('Error getting nearby places:', error);
  res.status(500).json({ error: 'Failed to get nearby places' });
 }
};

module.exports = {
 createNearbyPlace,
 updateNearbyPlace,
 getNearbyPlaceById,
 getNearbyPlaces,
 deleteNearbyPlace,
};
