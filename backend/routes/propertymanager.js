const express = require('express');
const router = express.Router();
const {
 verifyEmail,
 getPropertyManager,
 getPropertyManagerByEmail,
 getPropertyManagers,
 postPropertyManager,
 verifyPropertyManager,
 loginPropertyManager,
 updatePropertyManagerDetails,
 updatePropertyManagerAvatar,
 updatePassword,
 deletePropertyManager,
 resetPasswordRequest,
 verifyResetCode,
 resetPassword,
} = require('../controllers/PropertyManagerController');

router.get('/:idpropertymanager', getPropertyManager);
router.get('/email/:email', getPropertyManagerByEmail);
router.get('/', getPropertyManagers);
router.post('/', postPropertyManager);
router.post('/login', loginPropertyManager);
router.get('/verify/:uniqueString', verifyEmail);
router.put('/:id', updatePropertyManagerDetails);
router.put('/avatar/:id', updatePropertyManagerAvatar);
router.put('/password/:id', updatePassword);
router.delete('/:id', deletePropertyManager);
router.patch('/:id/verify', verifyPropertyManager);

// New routes for password reset functionality
router.post('/reset-password-request', resetPasswordRequest);
router.post('/verify-reset-code', verifyResetCode);
router.post('/reset-password', resetPassword);

module.exports = router;
