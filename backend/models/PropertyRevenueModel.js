// models/PropertyRevenueModel.js
module.exports = (db, type) => {
 const propertyRevenue = db.define('propertyrevenue', {
  id: {
   type: type.INTEGER,
   primaryKey: true,
   autoIncrement: true,
  },
  propertyId: {
   type: type.INTEGER,
   allowNull: false,
   references: {
    model: 'properties',
    key: 'id',
   },
  },
  amount: {
   type: type.DECIMAL(10, 2),
   allowNull: false,
  },
  month: {
   type: type.INTEGER,
   allowNull: false,
   validate: {
    min: 1,
    max: 12,
   },
  },
  year: {
   type: type.INTEGER,
   allowNull: false,
  },
  notes: {
   type: type.STRING(500),
   allowNull: true,
  },
  createdBy: {
   type: type.INTEGER,
   allowNull: false,
  },
 });

 return propertyRevenue;
};
