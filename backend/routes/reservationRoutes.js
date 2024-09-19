const express = require('express');
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const Reservation = require('../models/Reservation');
const validateReservation=require('../controllers/reservationController')
const protect  = require("../middleware/auth");

const router = express.Router();

// Créer une réservation
router.post(
  '/:id',validateReservation.addReservation


);



router.put('/accepte/:id',validateReservation.accepteReservation);
router.put('/:id',validateReservation.updateReservation);

router.get('/',protect,validateReservation.getReservations)
router.get('/getReservation/',protect  ,validateReservation.getReservationById)


router.delete('/deletReservation/:id', validateReservation.deleteReservation)

module.exports = router;
