const express = require('express');
const { register, login,getUserAllUserNonValidate, updateUser,getUserAllUser,ValidateUser, getUsersCountCtrlAdmin,getUsersCountCtrl,deleteUser,getUserProfileCtrl ,profilePhotoUploadCtrl} = require('../controllers/authController');
const validateObjectId =require("../middleware/validateObjectId");
const photoUpload = require("../middleware/photoUpload");
const auth = require('../middleware/auth');
const protect  = require("../middleware/auth");


const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.put('/update',protect, updateUser);
router.put('/validate/:id',protect, ValidateUser);
router.delete('/delete/:id',protect, deleteUser);

// /api/auth/profile/:id
router.route("/profile/:id")
    .get(validateObjectId, getUserProfileCtrl);

    // /api/auth/profiles
router.route("/profiles")
    .get(protect, getUserAllUser);
    // /api/auth/profiles
router.route("/profiles/Nvalidate")
    .get(protect, getUserAllUserNonValidate);

// /api/auth/profile-photo-upload/
router.route("/profile-photo-upload")
    .post(protect, photoUpload.single("image"),profilePhotoUploadCtrl);
  
  
  router.route("/countUser").get( getUsersCountCtrl);
  router.route("/countAdmin").get( getUsersCountCtrlAdmin);


module.exports = router;
