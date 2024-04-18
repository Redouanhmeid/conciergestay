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

module.exports = {
 getProperties,
 getProperty,
 getPropertiesByManagerId,
 createProperty,
 updateProperty,
 deleteProperty,
};
