module.exports = (db, type) => {
 let amenity = db.define('amenity', {
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
   allowNull: true,
  },
  media: {
   type: type.STRING, // URL to image or video
   allowNull: true,
  },
  wifiName: {
   type: type.STRING,
   allowNull: true,
  },
  wifiPassword: {
   type: type.STRING,
   allowNull: true,
  },
 });

 amenity.createAmenity = async (amenityData) => {
  return await amenity.create(amenityData);
 };

 return amenity;
};
