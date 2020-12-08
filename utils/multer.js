const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const {CloudinaryStorage} = require('multer-storage-cloudinary');

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      format: async (req, file) => 'png', // supports promises as well
    },
  });
  module.exports = multer({ storage:storage });
