const express = require('express');
const router = express.Router();
const {
 createNearbyPlace,
 updateNearbyPlace,
 getNearbyPlaces,
 getNearbyPlaceById,
 deleteNearbyPlace,
} = require('../controllers/NearbyPlaceController');

// Route to get all properties
router.get('/', getNearbyPlaces);
// Route to get a NearbyPlace by Id
router.get('/:id', getNearbyPlaceById);
// Route for creating a new NearbyPlace
router.post('/', createNearbyPlace);
// Route for updating a NearbyPlace
router.put('/:id', updateNearbyPlace);
// Route for deleting a NearbyPlace
router.delete('/:id', deleteNearbyPlace);

module.exports = router;
