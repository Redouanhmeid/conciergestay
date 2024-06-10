module.exports = (db, type) => {
 let property = db.define('property', {
  id: {
   type: type.INTEGER,
   primaryKey: true,
   autoIncrement: true,
  },
  name: {
   type: type.STRING(50),
   allowNull: false,
  },
  description: {
   type: type.TEXT,
   allowNull: false,
  },
  type: {
   type: type.STRING(50),
   allowNull: false,
  },
  basicAmenities: {
   type: type.JSON,
   allowNull: true,
  },
  safetyFeatures: {
   type: type.JSON,
   allowNull: true,
  },
  price: {
   type: type.INTEGER,
   allowNull: true,
  },
  capacity: {
   type: type.INTEGER,
   allowNull: true,
  },
  rooms: {
   type: type.INTEGER,
   allowNull: true,
  },
  beds: {
   type: type.INTEGER,
   allowNull: true,
  },
  elements: {
   type: type.JSON,
   allowNull: true,
  },
  houseRules: {
   type: type.JSON,
   allowNull: true,
  },
  checkInTime: {
   type: type.DATE,
   allowNull: true,
  },
  earlyCheckIn: {
   type: type.JSON,
   allowNull: true,
  },
  accessToProperty: {
   type: type.JSON,
   allowNull: true,
  },
  guestAccessInfo: {
   type: type.STRING,
   allowNull: true,
  },
  checkOutTime: {
   type: type.DATE,
   allowNull: true,
  },
  lateCheckOutPolicy: {
   type: type.JSON,
   allowNull: true,
  },
  beforeCheckOut: {
   type: type.JSON,
   allowNull: true,
  },
  additionalCheckOutInfo: {
   type: type.STRING,
   allowNull: true,
  },
  latitude: {
   type: type.FLOAT,
   allowNull: false,
  },
  longitude: {
   type: type.FLOAT,
   allowNull: false,
  },
  placeName: {
   type: type.STRING,
   allowNull: false,
  },
  photos: {
   type: type.JSON,
   allowNull: true,
  },
 });

 property.createProperty = async (propertyData) => {
  return await property.create(propertyData);
 };

 return property;
};
