const bcrypt = require('bcryptjs');

module.exports = (db, type) => {
 let propertymanager = db.define('propertymanager', {
  id: {
   type: type.INTEGER,
   autoIncrement: true,
   primaryKey: true,
  },
  email: {
   type: type.STRING(50),
   allowNull: false,
   unique: true,
  },
  password: {
   type: type.STRING,
   allowNull: false,
  },
  firstname: {
   type: type.STRING(50),
   allowNull: false,
  },
  lastname: {
   type: type.STRING(50),
   allowNull: false,
  },
  phone: {
   type: type.STRING(50),
  },
  avatar: {
   type: type.STRING,
   defaultValue: '/avatars/default.png',
   allowNull: true,
  },
  role: {
   type: type.STRING(50),
   defaultValue: 'manager',
   allowNull: false,
  },
  //isVerified is set to default false once a user signs up
  //this will change later after email has been verified
  isVerified: {
   type: type.BOOLEAN,
   defaultValue: false,
   allowNull: false,
  },
 });

 propertymanager.ValidateCreate = async function (
  email,
  password,
  firstname,
  lastname,
  phone,
  avatar,
  role,
  isVerified
 ) {
  const emailExists = await this.findOne({ where: { email } });
  if (emailExists) {
   throw Error('Cette adresse email est déjà enregistré!');
  }

  // Check if the phone already exists, but skip the check if phone is "N/A"
  if (phone !== 'N/A') {
   const phoneExists = await this.findOne({ where: { phone } });
   if (phoneExists) {
    throw Error('Ce numéro de téléphone est déjà utilisé!');
   }
  }

  // Hash  password
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  const propertyManager = await propertymanager.create({
   email,
   password: hash,
   firstname,
   lastname,
   phone,
   avatar,
   role,
   isVerified,
  });

  return propertyManager;
 };

 propertymanager.Login = async function (email, password) {
  const user = await this.findOne({ where: { email } });
  if (!user) {
   throw Error('Adresse Email incorrecte!');
  }
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
   throw Error('Mot de passe incorrecte!');
  }
  return user;
 };

 propertymanager.prototype.comparePassword = async function (
  candidatePassword
 ) {
  return bcrypt.compare(candidatePassword, this.password);
 };

 return propertymanager;
};
