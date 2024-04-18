const express = require('express')
const router = express.Router()
const { verifyEmail, getPropertyManager, getPropertyManagerByEmail, getPropertyManagers, postPropertyManager, loginPropertyManager } = require('../controllers/PropertyManagerController')

router.get('/:idpropertymanager', getPropertyManager)
router.get('/email/:email', getPropertyManagerByEmail)
router.get('/', getPropertyManagers)
router.post('/', postPropertyManager)
router.post('/login', loginPropertyManager)
router.get('/verify/:uniqueString', verifyEmail)

module.exports = router