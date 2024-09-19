const express = require('express');
const router = express.Router();
const etablissementController = require('../controllers/etablissementController');
const auth = require('../middleware/auth');

const hotelController = require('../controllers/hotolController');
const parser = require('../config/multerConfig');
const protect  = require("../middleware/auth");






router.post('/addMaison',etablissementController.addMaison); // Assurez-vous qu'il n'y a pas de double déclaration ici

router.post('/addHotel',protect, etablissementController.addHotel); // Assurez-vous qu'il n'y a pas de double déclaration ici

router.post('/addRestaurant',protect, etablissementController.addRestaurant);
router.post('/uploadPhotos/:id', parser.array('profilePhotos', 5), hotelController.uploadPhotos);  
// router.post('/',  [
//   auth] ,etablissementController.addEtablissement);  






router.route("/countEtablisement").get( etablissementController.getEtablisementCountCtrl);

router.get('/getEtablissement',protect,etablissementController.getEtablissementById);
router.delete('/deleteEtablissement/:id',etablissementController.deleteEtablissementById);
router.get('/',etablissementController.getEtablissement);
  
  
  
  
  


  
















module.exports = router;
