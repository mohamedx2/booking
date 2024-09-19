// config/multerConfig.js
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const cloudinary = require('./cloudinaryConfig');

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'hotel_photos',
    format: async (req, file) => 'png',
    public_id: (req, file) => file.originalname,
  },
});

const parser = multer({ storage: storage });

module.exports = parser;
