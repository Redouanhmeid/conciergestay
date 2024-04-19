module.exports = (db, type) => {
 let nearbyPlace = db.define('nearbyPlace', {
  id: {
   type: type.INTEGER,
   primaryKey: true,
   autoIncrement: true,
  },
  name: {
   type: type.STRING,
   allowNull: false,
  },
  address: {
   type: type.STRING,
   allowNull: false,
  },
  latitude: {
   type: type.FLOAT,
   allowNull: false,
  },
  longitude: {
   type: type.FLOAT,
   allowNull: false,
  },
  photo: {
   type: type.STRING,
   allowNull: true,
  },
  url: {
   type: type.STRING,
   allowNull: true,
  },
  rating: {
   type: type.FLOAT,
   allowNull: true,
  },
  rating: {
   type: type.JSON,
   allowNull: true,
  },
 });
 nearbyPlace.createNearbyPlace = async (nearbyPlaceData) => {
  return await nearbyPlace.create(nearbyPlaceData);
 };
 return nearbyPlace;
};