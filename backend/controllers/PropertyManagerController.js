require('dotenv').config();
const bcrypt = require('bcryptjs');
const { PropertyManager, PropertyManagerVerification } = require('../models');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const sendMail = require('../helpers/sendMail');

const { v4: uuidv4 } = require('uuid');

// path for static verified page
const path = require('path');

// Nodemailer stuff
const transporter = nodemailer.createTransport({
 host: process.env.HOST,
 port: process.env.MAIL_PORT,
 secure: true,
 auth: {
  user: process.env.AUTH_EMAIL,
  pass: process.env.AUTH_PASS,
 },
 tls: {
  rejectUnauthorized: false,
 },
});

// testing success
transporter.verify((error, success) => {
 if (error) {
  console.log('Not Ready fo messages');
  console.log(error);
 } else {
  console.log('Ready fo messages');
  console.log(success);
 }
});

const createToken = (_id) => {
 return jwt.sign({ _id }, process.env.SECRET, { expiresIn: '3d' });
};
// find one PropertyManager
const getPropertyManager = async (req, res) => {
 PropertyManager.findOne({ where: { id: req.params.idpropertymanager } }).then(
  (propertymanager) => {
   res.json(propertymanager);
  }
 );
};
const getPropertyManagerByEmail = async (req, res) => {
 PropertyManager.findOne({ where: { email: req.params.email } }).then(
  (propertymanager) => {
   res.json(propertymanager);
  }
 );
};
// find all PropertyManagers
const getPropertyManagers = async (req, res) => {
 PropertyManager.findAll().then((propertymanagers) => {
  res.json(propertymanagers);
 });
};
// post a PropertyManager
const postPropertyManager = async (req, res) => {
 let body = req.body;
 let email = req.body.email;
 let password = req.body.password;
 let firstname = req.body.firstname;
 let lastname = req.body.lastname;
 let phone = req.body.phone;

 const createdAt = Date.now();
 const expiresAt = Date.now() + 21600000;
 try {
  const user = await PropertyManager.ValidateCreate(
   email,
   password,
   firstname,
   lastname,
   phone
  );

  // create a token
  const token = createToken(user._id);

  // handle email verification
  const uniqueString = uuidv4() + token;

  sendMail(email, uniqueString, res)
   .then(() => {
    const newVerification = PropertyManagerVerification.Create(
     email,
     uniqueString,
     createdAt,
     expiresAt
    );
   })
   .catch((error) => {
    console.log(error);
    res.json({
     status: 'ÉCHOUÉ',
     message: 'la vérification a échoué!',
    });
   });
 } catch (error) {
  res.status(400).json({ error: error.message });
 }
};
// PropertyManager Login
const loginPropertyManager = async (req, res) => {
 let email = req.body.email;
 let password = req.body.password;
 try {
  const user = await PropertyManager.Login(email, password);

  // create a token
  const token = createToken(user._id);

  res.status(200).json({ email, token });
 } catch (error) {
  res.status(400).json({ error: error.message });
 }
};

//verify email
const verifyEmail = async (req, res) => {
 try {
  let uniqueString = req.params.uniqueString;

  const PMV = await PropertyManagerVerification.findOne({
   where: { uniqueString: uniqueString },
  });

  if (!PMV) {
   return res.status(400).send({
    msg: 'Votre lien de vérification a peut-être expiré. Veuillez cliquer sur renvoyer pour vérifier votre e-mail.',
   });

   //if token exist, find the user with that token
  } else {
   let email = PMV.email;
   const PM = await PropertyManager.findOne({ where: { email: email } });
   if (!PM) {
    return res.status(401).send({
     msg: "Nous n'avons pas pu trouver d'utilisateur pour cette vérification. Inscrivez vous s'il vous plait!",
    });

    //if user is already verified, tell the user to login
   } else if (PM.isVerified) {
    return res
     .status(200)
     .send("L'utilisateur a déjà été vérifié. Veuillez vous connecter");

    //if user is not verified, change the verified to true by updating the field
   } else {
    const updated = PropertyManager.update(
     { isVerified: 1 },
     {
      where: { email: email },
     }
    );
    //if not updated send error message
    if (!updated) {
     return res.status(500).send({ msg: err.message });
     //else send status of 200
    } else {
     const PMV = await PropertyManagerVerification.destroy({
      where: { email: email },
     });
     return res
      .sendFile(path.join(__dirname, '../views/verified.html'))
      .status(200)
      .send('Votre compte a été vérifié avec succès');
    }
   }
  }
 } catch (error) {
  console.log(error);
 }
};

// Update property manager's firstname, lastname, and phone
const updatePropertyManagerDetails = async (req, res) => {
 const { id } = req.params; // Assuming the id of the property manager is passed in the URL
 const { firstname, lastname, phone } = req.body;

 try {
  const propertyManager = await PropertyManager.findByPk(id);
  if (!propertyManager) {
   return res.status(404).json({ message: 'Property manager not found' });
  }

  // Update the property manager's details
  await propertyManager.update({
   firstname,
   lastname,
   phone,
  });

  return res.status(200).json({ message: 'Détails mis à jour avec succès' });
 } catch (error) {
  console.error('Erreur lors de la mise à jour des détails:', error);
  return res.status(500).json({ message: 'Internal server error' });
 }
};

// Update property manager's avatar
const updatePropertyManagerAvatar = async (req, res) => {
 const { id } = req.params;
 const { avatar } = req.body;

 try {
  const propertyManager = await PropertyManager.findByPk(id);
  if (!propertyManager) {
   return res.status(404).json({ message: 'Property manager not found' });
  }

  // Update the property manager's avatar
  await propertyManager.update({
   avatar,
  });

  return res
   .status(200)
   .json({ message: 'Property manager avatar updated successfully' });
 } catch (error) {
  console.error('Error updating property manager avatar:', error);
  return res.status(500).json({ message: 'Internal server error' });
 }
};

// Controller function to update the password
const updatePassword = async (req, res) => {
 const { id } = req.params;
 const { currentPassword, newPassword } = req.body;

 try {
  // Check if the propertyManager exists
  const propertyManager = await PropertyManager.findByPk(id);
  if (!propertyManager) {
   return res.status(404).json({ message: 'Manager introuvable' });
  }

  // Check if the current password matches the propertyManager's password
  const isMatch = await propertyManager.comparePassword(currentPassword);
  if (!isMatch) {
   return res.status(400).json({ message: 'Mot de passe actuel invalide' });
  }
  // Encrypt the new password
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(newPassword, salt);

  // Update the password
  propertyManager.password = hash;
  await propertyManager.save();

  res.status(200).json({ message: 'Mot de passe mis à jour avec succès' });
 } catch (error) {
  console.error('Erreur lors de la mise à jour du mot de passe:', error);
  res.status(500).json({ message: 'Erreur interne du serveur' });
 }
};

module.exports = {
 getPropertyManager,
 getPropertyManagerByEmail,
 getPropertyManagers,
 postPropertyManager,
 loginPropertyManager,
 verifyEmail,
 updatePropertyManagerDetails,
 updatePropertyManagerAvatar,
 updatePassword,
};
