// import sequelize & schemas
const Sequelize = require('sequelize');
const db = require('../config/database');
const PropertyManagerModel = require('./PropertyManagerModel');
const PropertyManagerVerificationModel = require('./PropertyManagerVerificationModel');
const PropertyModel = require('./PropertyModel');
const NearbyPlaceModel = require('./NearbyPlaceModel');
const AmenityModel = require('./AmenityModel');
const PasswordResetModel = require('./PasswordResetModel');

// create models
const PropertyManager = PropertyManagerModel(db, Sequelize);
const PropertyManagerVerification = PropertyManagerVerificationModel(
 db,
 Sequelize
);
const Property = PropertyModel(db, Sequelize);
const NearbyPlace = NearbyPlaceModel(db, Sequelize);
const Amenity = AmenityModel(db, Sequelize);
const PasswordReset = PasswordResetModel(db, Sequelize);

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
Property.hasMany(Amenity, {
 foreignKey: 'propertyId', // Specify the name of the foreign key in the Amenity model
 allowNull: false, // Make the foreign key required
 onDelete: 'CASCADE', // Delete associated amenities when a property is deleted
});
Amenity.belongsTo(Property, {
 foreignKey: 'propertyId', // Specify the name of the foreign key in the Amenity model
});

// generate tables in DB
db.sync({ alter: false }).then(() => {
 console.log('Tables Altered and Synced!');
});

module.exports = {
 PropertyManager,
 PropertyManagerVerification,
 Property,
 NearbyPlace,
 Amenity,
 PasswordReset,
};
