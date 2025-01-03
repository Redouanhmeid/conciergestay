// routes/propertyRevenue.js
const express = require('express');
const router = express.Router();
const {
 addMonthlyRevenue,
 updateMonthlyRevenue,
 getPropertyRevenue,
 getAnnualRevenue,
 deleteRevenue,
} = require('../controllers/PropertyRevenueController');

router.post('/revenue', addMonthlyRevenue);
router.put('/revenue/:id', updateMonthlyRevenue);
router.get('/property/:propertyId/revenue', getPropertyRevenue);
router.get('/property/:propertyId/annual-revenue/:year', getAnnualRevenue);
router.delete('/revenue/:id', deleteRevenue);

module.exports = router;
