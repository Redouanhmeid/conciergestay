module.exports = (db, type) => {
 let propertymanagerverification = db.define('propertymanagerverification', {
  id: {
   type: type.INTEGER,
   autoIncrement: true,
   allowNull: false,
   primaryKey: true,
  },
  email: {
   type: type.STRING(50),
   allowNull: false,
   unique: true,
  },
  uniqueString: {
   type: type.STRING(190),
   allowNull: false,
  },
  createdAt: {
   type: type.DATE,
   allowNull: false,
  },
  expiresAt: {
   type: type.DATE,
   allowNull: false,
  },
 });

 propertymanagerverification.Create = async function (
  email,
  uniqueString,
  createdAt,
  expiresAt
 ) {
  const PropertyManagerVerification = await propertymanagerverification.create({
   email,
   uniqueString,
   createdAt,
   expiresAt,
  });
  return propertymanagerverification;
 };
 return propertymanagerverification;
};
