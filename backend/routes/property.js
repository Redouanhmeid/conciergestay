const express = require('express');
const router = express.Router();
const {
 getProperties,
 getProperty,
 getPropertiesByManagerId,
 createProperty,
 updateProperty,
 deleteProperty,
} = require('../controllers/PropertyController');

// Route to get all properties
router.get('/', getProperties);
// Route to get a property
router.get('/:id', getProperty);
// Route to get a property by propertyManagerId
router.get('/bypm/:id', getPropertiesByManagerId);
// Route for creating a new property
router.post('/', createProperty);
// Route for updating a property
router.put('/:id', updateProperty);
// Route for deleting a property
router.delete('/:id', deleteProperty);

module.exports = router;
