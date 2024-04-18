// import sequelize & schemas
const Sequelize = require('sequelize');
const db = require('../config/database');
const PropertyManagerModel = require('./PropertyManagerModel');
const PropertyManagerVerificationModel = require('./PropertyManagerVerificationModel');
const PropertyModel = require('./PropertyModel');
const GuestModel = require('./GuestModel');
const NearbyPlaceModel = require('./NearbyPlaceModel');

// create models
const PropertyManager = PropertyManagerModel(db, Sequelize);
const PropertyManagerVerification = PropertyManagerVerificationModel(
 db,
 Sequelize
);
const Property = PropertyModel(db, Sequelize);
const Guest = GuestModel(db, Sequelize);
const NearbyPlace = NearbyPlaceModel(db, Sequelize);

// define relationships
// Property & PropertyManager (one -> many)
PropertyManager.hasMany(Property, {
 foreignKey: 'propertyManagerId',
 as: 'properties',
});
Property.belongsTo(PropertyManager, {
 foreignKey: 'propertyManagerId',
 as: 'propertyManager',
});
// PropertyManager & Guest (one -> many)
PropertyManager.hasMany(Guest);
Guest.belongsTo(PropertyManager);

// generate tables in DB
db.sync({ force: false }).then(() => {
 console.log('Tables Created!');
});

module.exports = {
 PropertyManager,
 PropertyManagerVerification,
 Property,
 Guest,
 NearbyPlace,
};
