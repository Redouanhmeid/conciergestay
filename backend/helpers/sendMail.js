require('dotenv').config();
const nodemailer = require('nodemailer');

const sendMail = async (email, uniqueString, res) => {
 const currentURL = process.env.URI;
 try {
  // Nodemailer stuff
  const transporter = nodemailer.createTransport({
   host: 'mail.nextbedesign.com',
   port: 465,
   secure: true,
   auth: {
    user: process.env.AUTH_EMAIL,
    pass: process.env.AUTH_PASS,
   },
  });
  const mailOptions = {
   from: process.env.AUTH_EMAIL,
   to: email,
   subject: 'Vérifiez votre e-mail',
   html: `<p>Vérifiez votre adresse e-mail pour terminer l'inscription et connectez-vous à votre compte.</p>
        <p>Ce lien <b>expire dans 6 heures</b></p>
        <p><a href=${
         currentURL + '/api/v1/propertymanagers/verify/' + uniqueString
        }>Cliquez ici pour continuer</a></p>`,
  };

  transporter
   .sendMail(mailOptions)
   .then(() => {
    // email sent and verification record saved
    res.json({
     status: 'EN ATTENTE',
     message: 'Un email de vérification a été envoyé!',
    });
   })
   .catch((error) => {
    console.log(error);
    res.json({
     status: 'ÉCHOUÉ',
     message: "L'email de vérification a échoué!",
    });
   });
 } catch (error) {
  console.log(error.message);
  res.json({
   status: 'ÉCHOUÉ',
   message: "Impossible d'enregistrer l'email de vérification!",
  });
 }
};

module.exports = sendMail;
