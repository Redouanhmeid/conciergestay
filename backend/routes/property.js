const express = require('express');
const router = express.Router();
const {
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
 getPropertyManagerTasks,
} = require('../controllers/PropertyController');

// Route to get all properties
router.get('/', getProperties);
// Route to get all pending properties
router.get('/pending', getPendingProperties); // Admin-only route
// Route for get Properties by Latitude & Longitude
router.get('/properties', getPropertiesByPlaceLatLon);
// Route to get a property
router.get('/:id', getProperty);
// Route to get a property by propertyManagerId
router.get('/bypm/:id', getPropertiesByManagerId);
// Route for creating a new property
router.post('/', createProperty);
// Route for updating a property
router.put('/:id', updateProperty);
// Routes for specific property updates
router.put('/:id/basic-info', updatePropertyBasicInfo);
router.put('/:id/equipements', updatePropertyAmenities);
router.put('/:id/capacity', updatePropertyCapacity);
router.put('/:id/rules', updatePropertyRules);
router.put('/:id/check-in', updatePropertyCheckIn);
router.put('/:id/check-out', updatePropertyCheckOut);
router.put('/:id/photos', updatePropertyPhotos);
// Route for deleting a property
router.delete('/:id', deleteProperty);

router.put('/:id/verify', verifyProperty);
router.post('/bulkVerify', bulkVerifyProperties);
router.put('/:id/toggleenable', toggleEnableProperty);

router.get('/propertytask/manager/:managerId/tasks', getPropertyManagerTasks);

module.exports = router;
