// controllers/hotelController.js



const Etablissement = require('../models/Etablissement');

const parser = require('../config/multerConfig');

const uploadPhotos = async (req, res) => {
  try {
    const etablissement = await Etablissement.findById(req.params.id);

    if (!etablissement) {
      return res.status(404).json({ message: 'etablissement not found' });
    }

    // Ensure req.files is not undefined
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    // Check if the number of files is greater than 5
    if (req.files.length > 5) {
      return res.status(400).json({ message: 'Maximum of 5 files can be uploaded' });
    }

    const photoUrls = req.files.map((file, index) => ({
      url: file.path,
      publicId: file.filename,
    }));

    etablissement.profilePhoto = {
      url: photoUrls[0]?.url || etablissement.profilePhoto?.url,
      publicId: photoUrls[0]?.publicId || etablissement.profilePhoto?.publicId,
      url1: photoUrls[1]?.url || etablissement.profilePhoto?.url1,
      publicId1: photoUrls[1]?.publicId || etablissement.profilePhoto?.publicId1,
      url3: photoUrls[2]?.url || etablissement.profilePhoto?.url3,
      publicId3: photoUrls[2]?.publicId || etablissement.profilePhoto?.publicId3,
      url4: photoUrls[3]?.url || etablissement.profilePhoto?.url4,
      publicId4: photoUrls[3]?.publicId || etablissement.profilePhoto?.publicId4,
      url5: photoUrls[4]?.url || etablissement.profilePhoto?.url5,
      publicId5: photoUrls[4]?.publicId || etablissement.profilePhoto?.publicId5,
    };

    await etablissement.save();

    res.status(200).json({ message: 'Photos uploaded successfully', etablissement });
  } catch (error) {
    console.error('Error uploading photos:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};









































module.exports = {
  uploadPhotos,

  
  
};
