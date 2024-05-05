// require important modules
require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const cors = require('cors');

// create our App
const app = express();
const port = process.env.PORT || 4000;

// Use helmet middleware to set the Content Security Policy (CSP) header
app.use(
 helmet.contentSecurityPolicy({
  directives: {
   defaultSrc: ["'self'"],
   scriptSrc: ["'self'", "'unsafe-inline'"],
   imgSrc: ["'self'"],
  },
 })
);

// Other middleware and route handlers
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

// require routes
const PropertyManagerRouter = require('./routes/propertymanager');
const GuestRouter = require('./routes/guest');
const PropertyRouter = require('./routes/property');
const NearbyPlaceRouter = require('./routes/nearbyplace');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Enable CORS for only frontend
const corsOptions = {
 origin: 'http://localhost:3000', // Replace with your frontend server's URL
 // origin: 'https://csapp.nextbedesign.com', // Replace with your frontend server's URL
};
app.use(cors(corsOptions));

// Home Page
app.get('/', (req, res) => {
 return res.send('Hello Backend Side');
});
// Start the server
app.listen(port, () => console.log(`server running on port ${port}`));

// require the connection (DB)
const db = require('./config/database');
// Testing the connection
db
 .authenticate()
 .then(() => {
  console.log('Connection has been established successfully.');
 })
 .catch((err) => {
  console.error('Unable to connect to the database:', err);
 });

// routes
// all of our routes will be prefixed with /api/v1/
app.use('/api/v1/propertymanagers', PropertyManagerRouter);
app.use('/api/v1/guests', GuestRouter);
app.use('/api/v1/properties', PropertyRouter);
app.use('/api/v1/nearbyplaces', NearbyPlaceRouter);

// Configure multer to store files in the 'uploads' directory
let counter = 1;
// Create a new Express app for the /upload route
const upload = multer({
 storage: multer.diskStorage({
  destination: (req, file, cb) => {
   cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
   const ext = path.extname(file.originalname);
   const name = path.basename(file.originalname, ext);
   const newName = `${name.replace(/\s+/g, '-')}-${counter}${ext}`;
   counter++;
   cb(null, newName);
  },
 }),
 limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
 fileFilter: function (req, file, cb) {
  checkFileType(file, cb);
 },
});
// Configure multer to store single file in the 'places' directory
const singleUpload = multer({
 storage: multer.diskStorage({
  destination: (req, file, cb) => {
   cb(null, 'places/');
  },
  filename: (req, file, cb) => {
   const ext = path.extname(file.originalname);
   const name = path.basename(file.originalname, ext);
   const newName = `${name.replace(/\s+/g, '-')}-${counter}${ext}`;
   counter++;
   cb(null, newName);
  },
 }),
 limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
 fileFilter: function (req, file, cb) {
  checkFileType(file, cb);
 },
});
// Configure multer to store single file in the 'avatars' directory
const avatars = multer({
 storage: multer.diskStorage({
  destination: (req, file, cb) => {
   cb(null, 'avatars/');
  },
  filename: (req, file, cb) => {
   const ext = path.extname(file.originalname);
   const name = path.basename(file.originalname, ext);
   const newName = `${name.replace(/\s+/g, '-')}-${counter}${ext}`;
   counter++;
   cb(null, newName);
  },
 }),
 limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
 fileFilter: function (req, file, cb) {
  checkFileType(file, cb);
 },
});
// Check file type
function checkFileType(file, cb) {
 // Allowed extensions
 const filetypes = /jpeg|jpg|png|gif/;
 // Check the extension
 const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
 // Check the MIME type
 const mimetype = filetypes.test(file.mimetype);

 if (mimetype && extname) {
  return cb(null, true);
 } else {
  cb('Error: Images only!');
 }
}
// Handle file upload
app.post('/upload', upload.array('photos', 8), (req, res) => {
 const files = req.files.map((file) => {
  return {
   filename: file.filename,
   url: `/uploads/${file.filename}`,
  };
 });

 res.json({ files: files });
});
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// Handle file upload for a single photo
app.post('/upload/single', singleUpload.single('photo'), (req, res) => {
 if (!req.file) {
  return res.status(400).json({ error: 'No file uploaded' });
 }

 const file = {
  filename: req.file.filename,
  url: `/places/${req.file.filename}`,
 };

 res.json({ file: file });
});
app.use('/places', express.static(path.join(__dirname, 'places')));

app.post('/upload/avatars', avatars.single('avatar'), (req, res) => {
 if (!req.file) {
  return res.status(400).json({ error: 'No file uploaded' });
 }

 const file = {
  filename: req.file.filename,
  url: `/avatars/${req.file.filename}`,
 };

 res.json({ file: file });
});
app.use('/avatars', express.static(path.join(__dirname, 'avatars')));
