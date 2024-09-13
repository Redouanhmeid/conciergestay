require('dotenv').config();
const bcrypt = require('bcryptjs');
const {
 PropertyManager,
 PropertyManagerVerification,
 PasswordReset,
} = require('../models');
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
 const { email, password, firstname, lastname, phone, avatar, isVerified } =
  req.body;

 try {
  // Check if the user already exists
  let user = await PropertyManager.findOne({ where: { email } });

  if (user) {
   // If the user exists and isVerified is true, update user details
   if (isVerified) {
    user.firstname = firstname;
    user.lastname = lastname;
    user.phone = phone || user.phone; // Retain existing phone if new phone is empty
    user.avatar = avatar || user.avatar;
    user.isVerified = true;
    await user.save();

    // Directly return success response
    console.log('User updated:', JSON.stringify(user, null, 2));
    return res.status(200).json(user);
   } else {
    return res
     .status(400)
     .json({ error: "L'utilisateur existe déjà et n'est pas vérifié" });
   }
  } else {
   // Create a new user
   const createdAt = Date.now();
   const expiresAt = Date.now() + 21600000;

   user = await PropertyManager.ValidateCreate(
    email,
    password,
    firstname,
    lastname,
    phone || 'N/A', // Set default phone if empty
    avatar || '/avatars/default.png', // Set default avatar if not provided
    'manager',
    isVerified || false // Set default isVerified to false if not provided
   );

   // Ensure user is properly created
   if (!user) {
    return res.status(500).json({ error: 'User creation failed.' });
   }

   if (!isVerified) {
    // Handle email verification if the user is not verified
    const token = createToken(user._id);
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
      res.json({
       status: 'ÉCHOUÉ',
       message: 'la vérification a échoué!',
      });
     });
   } else {
    // Log and return success response if verified via Google Sign-In
    console.log(
     'User created via Google Sign-In:',
     JSON.stringify(user, null, 2)
    );
    return res.status(201).json({
     email: user.email,
     password: user.password,
     firstname: user.firstname,
     lastname: user.lastname,
     phone: user.phone,
     isVerified: user.isVerified,
     avatar: user.avatar,
    });
   }
  }
 } catch (error) {
  console.error('Error in postPropertyManager:', error);
  return res.status(400).json({ error: error.message });
 }
};

const verifyPropertyManager = async (req, res) => {
 const { id } = req.params;

 try {
  const propertyManager = await PropertyManager.findByPk(id);

  if (!propertyManager) {
   return res.status(404).json({ message: 'Manager non trouvé' });
  }

  // Update the isVerified status to true
  await propertyManager.update({ isVerified: true });

  return res.status(200).json({ message: 'Manager vérifié avec succès' });
 } catch (error) {
  console.error('Erreur lors de la vérification du manager:', error);
  return res.status(500).json({ message: 'Erreur interne du serveur' });
 }
};

// Delete a property manager
const deletePropertyManager = async (req, res) => {
 const { id } = req.params;

 try {
  const propertyManager = await PropertyManager.findByPk(id);

  if (!propertyManager) {
   return res.status(404).json({ message: 'Manager non trouvé' });
  }

  await propertyManager.destroy();
  return res.status(200).json({ message: 'Manager supprimé avec succès' });
 } catch (error) {
  console.error('Erreur lors de la suppression du Manager:', error);
  return res.status(500).json({ message: 'Internal server error' });
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
  console.error(error);
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

// Function to generate a random code
const generateCode = () => {
 return Math.floor(100000 + Math.random() * 900000).toString(); // 6 digit code
};

// Request password reset
const resetPasswordRequest = async (req, res) => {
 const { email } = req.body;

 try {
  const user = await PropertyManager.findOne({ where: { email } });
  if (!user) {
   return res.status(404).json({ message: 'Email not found' });
  }

  const resetCode = generateCode();
  const expiresAt = Date.now() + 3600000; // 1 hour expiry

  await PasswordReset.create({ email, code: resetCode, expiresAt });

  const transporter = nodemailer.createTransport({
   host: process.env.HOST,
   port: process.env.MAIL_PORT,
   secure: true,
   auth: {
    user: process.env.AUTH_EMAIL,
    pass: process.env.AUTH_PASS,
   },
  });

  const mailOptions = {
   from: process.env.AUTH_EMAIL,
   to: email,
   subject: 'Password Reset Code',
   html: `<p>Your password reset code is: <b>${resetCode}</b></p>`,
  };

  await transporter.sendMail(mailOptions);

  res.status(200).json({ message: 'Password reset code sent' });
 } catch (error) {
  console.error('Error requesting password reset:', error);
  res.status(500).json({ message: 'Internal server error' });
 }
};

// Verify reset code
const verifyResetCode = async (req, res) => {
 const { email, code } = req.body;

 try {
  const resetRecord = await PasswordReset.findOne({ where: { email, code } });
  if (!resetRecord) {
   return res.status(400).json({ message: 'Invalid code' });
  }

  if (resetRecord.expiresAt < Date.now()) {
   return res.status(400).json({ message: 'Code has expired' });
  }

  res.status(200).json({ message: 'Code verified' });
 } catch (error) {
  console.error('Error verifying reset code:', error);
  res.status(500).json({ message: 'Internal server error' });
 }
};

// Reset password
const resetPassword = async (req, res) => {
 const { email, code, newPassword } = req.body;

 try {
  const resetRecord = await PasswordReset.findOne({ where: { email, code } });
  if (!resetRecord) {
   return res.status(400).json({ message: 'Invalid code' });
  }

  if (resetRecord.expiresAt < Date.now()) {
   return res.status(400).json({ message: 'Code has expired' });
  }

  const user = await PropertyManager.findOne({ where: { email } });
  if (!user) {
   return res.status(404).json({ message: 'User not found' });
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(newPassword, salt);

  user.password = hash;
  await user.save();

  await PasswordReset.destroy({ where: { email, code } });

  res.status(200).json({ message: 'Password reset successful' });
 } catch (error) {
  console.error('Error resetting password:', error);
  res.status(500).json({ message: 'Internal server error' });
 }
};

module.exports = {
 getPropertyManager,
 getPropertyManagerByEmail,
 getPropertyManagers,
 postPropertyManager,
 verifyPropertyManager,
 loginPropertyManager,
 verifyEmail,
 updatePropertyManagerDetails,
 updatePropertyManagerAvatar,
 updatePassword,
 deletePropertyManager,
 resetPasswordRequest,
 verifyResetCode,
 resetPassword,
};
