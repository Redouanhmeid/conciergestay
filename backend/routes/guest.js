const express = require('express')
const router = express.Router()
const { getGuest, getGuests, postGuest, guestsofpropertymanager } = require('../controllers/GuestController')
const requireAuth = require('../middleware/requireAuth')

// require auth for all property managers
/* router.use(requireAuth) */

router.get('//:idguest', getGuest)
router.get('/', getGuests)
router.post('/', postGuest)
router.get('/propertymanagers/:propertymanagerid/', guestsofpropertymanager)

module.exports = router