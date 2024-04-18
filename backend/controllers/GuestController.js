const { Guest, PropertyManager } = require('../models')

// find one guest
const getGuest = async (req, res) => {
    Guest
    .findOne({ where: { id: req.params.idguest } })
    .then(guest => {
      res.json(guest)
    })
  }
// find all guests
const getGuests = async (req, res) => {
  Guest.findAll()
    .then(guests => {
        res.json(guests)
    })
}
// post a guest
const postGuest = async (req, res) => {
    let body = req.body
    Guest
    .create(body)
    .then(guest => {
      res.json(guest)
    })
    .catch((e) => console.log(e.message))
  }

// find guests belongs to a specific propertymanager
const guestsofpropertymanager = async (req, res) => {
    PropertyManager
    .findAll({
      where: {id: req.params.propertymanagerid},
      include: [Guest]
    })
    .then(result => {
      res.json(result)
    })
}

module.exports = {
    getGuest,
    getGuests,
    postGuest,
    guestsofpropertymanager
}