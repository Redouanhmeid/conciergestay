const express = require('express');
const router = express.Router();
const {
 createAmenity,
 updateAmenity,
 deleteAmenity,
 getAmenitiesForProperty,
 getAmenityById,
} = require('../controllers/AmenityController');

// Route to get all properties
router.get('/:propertyId', getAmenitiesForProperty);
// Route to get a property
router.get('/one/:id', getAmenityById);
// Route for creating a new property
router.post('/', createAmenity);
// Route for updating a property
router.put('/:id', updateAmenity);
// Route for deleting a property
router.delete('/:id', deleteAmenity);

module.exports = router;
