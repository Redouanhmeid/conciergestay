// helpers/notificationMail.js
require('dotenv').config();
const nodemailer = require('nodemailer');

const sendNotificationMail = async ({ email, subject, html }) => {
 try {
  // Create transporter with your existing config
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
   subject: subject,
   html: html,
  };

  // Return promise for better error handling
  return await transporter.sendMail(mailOptions);
 } catch (error) {
  console.log('Email sending error:', error);
  throw error;
 }
};

module.exports = sendNotificationMail;
