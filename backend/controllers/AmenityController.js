const { Amenity } = require('../models');

// Create a new amenity
const createAmenity = async (req, res) => {
 try {
  const amenityData = req.body;
  const amenity = await Amenity.createAmenity(amenityData);
  res.status(201).json(amenity);
 } catch (error) {
  console.error(error);
  res.status(500).json({ error: 'Failed to create property' });
 }
};

// Update an existing amenity
const updateAmenity = async (req, res) => {
 const { id } = req.params;
 const updatedData = req.body;

 try {
  const amenity = await Amenity.findByPk(id);
  if (!amenity) {
   return res.status(404).json({ error: 'Amenity not found' });
  }
  await amenity.update(updatedData);
  res.status(200).json(amenity);
 } catch (error) {
  console.error('Error updating amenity:', error);
  res.status(500).json({ error: 'Failed to update amenity' });
 }
};

// Delete an existing amenity
const deleteAmenity = async (req, res) => {
 try {
  const { id } = req.params;
  const amenity = await Amenity.findByPk(id);
  if (!amenity) {
   return res.status(404).json({ error: 'Amenity not found' });
  }
  await amenity.destroy();

  res.status(200).json({ message: 'Amenity deleted successfully' });
 } catch (error) {
  console.error(error);
  res.status(500).json({ error: 'Failed to delete amenity' });
 }
};

// Get all amenities for a property
const getAmenitiesForProperty = async (req, res) => {
 const { propertyId } = req.params;
 try {
  const amenities = await Amenity.findAll({ where: { propertyId } });
  res.status(200).json(amenities);
 } catch (error) {
  console.error('Error getting amenities:', error);
  res
   .status(500)
   .json({ error: 'Failed to get amenities', details: error.message });
 }
};

const getAmenityById = async (req, res) => {
 const { id } = req.params;
 try {
  const amenity = await Amenity.findByPk(id);
  if (!amenity) {
   throw new Error('Amenity not found');
  }
  if (amenity) {
   res.json(amenity);
  } else {
   res.status(404).json('No amenity found');
  }
 } catch (error) {
  res
   .status(500)
   .json({ error: 'Error getting amenity by ID', details: error.message });
 }
};

module.exports = {
 createAmenity,
 updateAmenity,
 deleteAmenity,
 getAmenitiesForProperty,
 getAmenityById,
};
