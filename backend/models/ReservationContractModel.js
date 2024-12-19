module.exports = (db, type) => {
 let reservationcontract = db.define('reservationcontract', {
  id: {
   type: type.INTEGER,
   primaryKey: true,
   autoIncrement: true,
  },
  firstname: {
   type: type.STRING(50),
   allowNull: false,
  },
  lastname: {
   type: type.STRING(50),
   allowNull: false,
  },
  birthDate: {
   type: type.DATEONLY,
   allowNull: false,
  },
  sex: {
   type: type.ENUM('MALE', 'FEMALE'),
   allowNull: false,
  },
  nationality: {
   type: type.STRING(50),
   allowNull: false,
  },
  email: {
   type: type.STRING(50),
   allowNull: false,
  },
  phone: {
   type: type.STRING(50),
  },
  startDate: {
   type: type.DATE,
   allowNull: false,
  },
  endDate: {
   type: type.DATE,
   allowNull: false,
  },
  residenceCountry: {
   type: type.STRING(50),
   allowNull: false,
  },
  residenceCity: {
   type: type.STRING(50),
   allowNull: false,
  },
  residenceAddress: {
   type: type.STRING(200),
   allowNull: false,
  },
  residencePostalCode: {
   type: type.STRING(20),
   allowNull: false,
  },
  totalPrice: {
   type: type.DECIMAL(10, 2),
   allowNull: false,
  },
  status: {
   type: type.ENUM('DRAFT', 'SENT', 'SIGNED', 'REJECTED', 'COMPLETED'),
   allowNull: false,
   defaultValue: 'DRAFT',
  },
  signatureImageUrl: {
   type: type.STRING(500),
   allowNull: false,
  },
  identityDocumentUrl: {
   type: type.STRING(500),
   allowNull: false,
  },
 });

 // Static methods
 reservationcontract.createContract = async (contractData) => {
  return await reservationcontract.create(contractData);
 };

 reservationcontract.findContractsByProperty = async (propertyId) => {
  return await reservationcontract.findAll({
   where: { propertyId: propertyId },
   order: [['createdAt', 'DESC']],
  });
 };

 return reservationcontract;
};
