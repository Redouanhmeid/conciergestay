const express = require('express');
const router = express.Router();
const {
 createContract,
 updateContract,
 deleteContract,
 getContractsForProperty,
 getContractById,
 updateContractStatus,
 checkAvailability,
} = require('../controllers/ReservationContractController');

// Basic CRUD routes
router.post('/contracts', createContract);
router.get('/properties/:propertyId', getContractsForProperty);
router.get('/contracts/:id', getContractById);
router.put('/contracts/:id', updateContract);
router.delete('/contracts/:id', deleteContract);

// Special routes
router.patch('/contracts/:id/status', updateContractStatus);
router.get('/properties/:propertyId/availability', checkAvailability);

module.exports = router;
