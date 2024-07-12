require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const axios = require('axios');

// Create our App
const app = express();
const port = process.env.PORT || 3000;

console.log('Starting server setup...');

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

// Enable CORS for both local and production frontend
const corsOptions = {
 origin: ['http://localhost:3000', 'https://conciergestay.pro'],
};
app.use(cors(corsOptions));

console.log('CORS setup complete.');

// Other middleware and route handlers
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Configure multer to store files in the 'uploads' directory
let counter = 1;
const storage = (directory) =>
 multer.diskStorage({
  destination: (req, file, cb) => {
   cb(null, directory);
  },
  filename: (req, file, cb) => {
   const ext = path.extname(file.originalname);
   const name = path.basename(file.originalname, ext);
   const newName = `${name.replace(/\s+/g, '-')}-${counter}${ext}`;
   counter++;
   cb(null, newName);
  },
 });

// Determine the correct path based on the environment
const UPLOADS_PATH =
 process.env.UPLOADS_PATH || path.join(__dirname, 'uploads');
const PLACES_PATH = process.env.PLACES_PATH || path.join(__dirname, 'places');
const AVATARS_PATH =
 process.env.AVATARS_PATH || path.join(__dirname, 'avatars');

// Configure multer instances
const upload = multer({
 storage: storage(UPLOADS_PATH),
 limits: { fileSize: 15 * 1024 * 1024 },
 fileFilter: function (req, file, cb) {
  checkFileType(file, cb);
 },
});
const singleUpload = multer({
 storage: storage(PLACES_PATH),
 limits: { fileSize: 15 * 1024 * 1024 },
 fileFilter: function (req, file, cb) {
  checkFileType(file, cb);
 },
});
const avatars = multer({
 storage: storage(AVATARS_PATH),
 limits: { fileSize: 15 * 1024 * 1024 },
 fileFilter: function (req, file, cb) {
  checkFileType(file, cb);
 },
});

console.log('Multer configuration complete.');

// Check file type
function checkFileType(file, cb) {
 const filetypes = /jpeg|jpg|png|gif/;
 const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
 const mimetype = filetypes.test(file.mimetype);

 if (mimetype && extname) {
  return cb(null, true);
 } else {
  cb('Error: Images only!');
 }
}

console.log('File type check setup complete.');

// Handle file upload
app.post('/upload', upload.array('photos', 8), (req, res) => {
 const files = req.files.map((file) => ({
  filename: file.filename,
  url: `/uploads/${file.filename}`,
 }));

 res.json({ files: files });
});
app.use('/uploads', express.static(UPLOADS_PATH));

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
app.use('/places', express.static(PLACES_PATH));

// Handle file upload for avatars
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
app.use('/avatars', express.static(AVATARS_PATH));

console.log('Server setup complete.');

// require routes
const PropertyManagerRouter = require('./routes/propertymanager');
const PropertyRouter = require('./routes/property');
const NearbyPlaceRouter = require('./routes/nearbyplace');
const AmenityRouter = require('./routes/amenity');

// Routes
// All of our routes will be prefixed with /api/v1/
app.use('/api/v1/propertymanagers', PropertyManagerRouter);
app.use('/api/v1/properties', PropertyRouter);
app.use('/api/v1/nearbyplaces', NearbyPlaceRouter);
app.use('/api/v1/amenities', AmenityRouter);

console.log('Routes setup complete.');

// Serve static files from the React app
const REACT_APP_PATH =
 process.env.REACT_APP_PATH || path.join(__dirname, 'client/build');
app.use(express.static(REACT_APP_PATH));

console.log('Middleware setup complete.');

// Proxy route for handling cross-origin images
app.get('/proxy', async (req, res) => {
 const imageUrl = req.query.url;
 try {
  const response = await axios.get(imageUrl, { responseType: 'stream' });
  res.set('Content-Type', response.headers['content-type']);
  response.data.pipe(res);
 } catch (error) {
  console.error('Error fetching image:', error);
  res.status(500).send('Error fetching image');
 }
});

console.log('Proxy route setup complete.');

// Catch-all handler to serve index.html for any other routes
app.get('*', (req, res) => {
 res.sendFile(path.join(REACT_APP_PATH, 'index.html'));
});

console.log('Home route setup complete.');

// Start the server
app.listen(port, () => console.log(`Server running on port ${port}`));

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

console.log('Database connection setup complete.');
