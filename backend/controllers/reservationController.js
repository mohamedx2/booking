const Reservation = require('../models/Reservation');
const User = require('../models/User');

const Etablissement = require('../models/Etablissement');
const Hotel = require('../models/hotel');
const Restaurant = require('../models/Restaurant');






const addReservation = async (req, res) => {
  const { nbChomber, idProp, idEtab, nbPers, dateDepart, dateFin } = req.body;
  const idClient = req.params.id; 
  try {
    // Check if there are any existing reservations for the specified establishment and time range
    const existingReservations = await Reservation.find({
      idEtab: idEtab,
      dateDepart: { $lt: dateFin }, // Check if existing reservation's end date is after the new reservation's start date
      dateFin: { $gt: dateDepart } // Check if existing reservation's start date is before the new reservation's end date
    });

    // Calculate the total number of reserved rooms for the specified time range
    


    // Assuming `capacity` is a property of the establishment representing the total number of rooms
    const establishment = await Etablissement.findById(idEtab);

    // Check if the total number of reserved rooms exceeds the establishment's capacity
    if ((nbChomber) >( establishment.capacity- establishment.nbRev)) {
      return res.status(400).json({ message: "The establishment does not have enough available rooms for the specified time range." });
    }

    // Proceed with creating the reservation since the establishment has enough available rooms
    const reservation = new Reservation({ nbChomber, idProp, idEtab, idClient, nbPers, dateDepart, dateFin });
    await reservation.save();
    res.status(201).json(reservation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};









const getReservations = async (req, res) => {
  try {
    // Fetch all reservations and populate necessary fields
    const reservations = await Reservation.find({idProp:req.user.id,isAccept:false}).populate();

    // Use Promise.all to handle multiple asynchronous operations concurrently
    const data = await Promise.all(
      reservations.map(async (reservation) => {
        const etablissement = await Etablissement.findById(reservation.idEtab);
        const user = await User.findById(reservation.idClient);
        return { [reservation._id]: { reservation, user,etablissement } };
      })
    );

    // Merge the array of objects into a single object
    const result = data.reduce((acc, curr) => Object.assign(acc, curr), {});

    // Send the response with status 200 and the result data
    res.status(200).json(result);
  } catch (error) {
    // Handle errors and send a response with status 500 and the error message
    res.status(500).json({ error: error.message });
  }
};




const getReservationById = async (req, res) => {
  try {
    // Fetch all reservations and populate necessary fields
    const reservations = await Reservation.find({idClient:req.user.id});

    // Use Promise.all to handle multiple asynchronous operations concurrently
    const data = await Promise.all(
      reservations.map(async (reservation) => {
        const etablissement = await Etablissement.findById(reservation.idEtab);
        const user = await User.findById(reservation.idClient);
        return { [reservation._id]: { reservation, user,etablissement } };
      })
    );

    // Merge the array of objects into a single object
    const result = data.reduce((acc, curr) => Object.assign(acc, curr), {});

    // Send the response with status 200 and the result data
    res.status(200).json(result);
  } catch (error) {
    // Handle errors and send a response with status 500 and the error message
    res.status(500).json({ error: error.message });
  }
};





const deleteReservation = async (req, res) => {
  
  const reservationId = req.params.id;
  try {
    const reservation = await Reservation.findById(reservationId);
    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }
    if (reservation.isAccept) {
      const etablissement = await Etablissement.findById(reservation.idEtab);
       const updatedEtablissement = await Etablissement.findByIdAndUpdate(
        etablissement._id,
        { nbRev: etablissement.nbRev - reservation.nbChomber },
        { new: true }
      )
      
      await Reservation.findByIdAndDelete(reservationId);  
      res.status(200).json({ message: 'Reservation deleted successfully',});
    }
    if(!reservation.isAccept){
       await Reservation.findByIdAndDelete(reservationId);
       return res.status(200).json({ message: 'Reservation deleted successfully' });
    }
  } catch (error) {
    
    res.status(500).json({ error: error.message });
  }
};








const accepteReservation = async (req, res) => {
  const reservationId = req.params.id;
  try {
    // Trouver la réservation sans la modifier
    const reservation = await Reservation.findById(reservationId);
    if (!reservation) {
      return res.status(404).json({ message: 'Réservation non trouvée' });
    }

    // Trouver l'établissement lié à la réservation
    const etablissement = await Etablissement.findById(reservation.idEtab);
    if (!etablissement) {
      return res.status(404).json({ message: 'Établissement non trouvé' });
    }

    // Vérifier si l'établissement a suffisamment de chambres disponibles
    if (reservation.nbChomber > (etablissement.capacity - etablissement.nbRev)) {
      return res.status(400).json({ message: "L'établissement n'a pas assez de chambres disponibles pour la plage horaire spécifiée." });
    }

    // Mettre à jour la réservation pour indiquer qu'elle est acceptée
    const updatedReservation = await Reservation.findByIdAndUpdate(
      reservationId,
      { isAccept: true },
      { new: true }
    );

    // Mettre à jour le nombre de chambres réservées dans l'établissement
    const updatedEtablissement = await Etablissement.findByIdAndUpdate(
      reservation.idEtab,
      { nbRev: etablissement.nbRev + reservation.nbChomber },
      { new: true }
    );

    
    // Renvoyer la réponse avec les détails de la réservation et de l'établissement
    res.status(200).json({
      message: 'Réservation acceptée avec succès',
      reservation: updatedReservation,
      etablissement: updatedEtablissement
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const updateReservation = async (req, res) => {
  const reservationId = req.params.id;
  try {
    // Trouver la réservation sans la modifier
    const reservation = await Reservation.findById(reservationId);
    if (!reservation) {
      return res.status(404).json({ message: 'Réservation non trouvée' });
    }

    // Trouver l'établissement lié à la réservation
    const etablissement = await Etablissement.findById(reservation.idEtab);
    if (!etablissement) {
      return res.status(404).json({ message: 'Établissement non trouvé' });
    }

  

    // Mettre à jour la réservation pour indiquer qu'elle est acceptée
    const updatedReservation = await Reservation.findByIdAndUpdate(
      reservationId,
      req.body,
      { new: true }
    );

    // Mettre à jour le nombre de chambres réservées dans l'établissement
    const updatedEtablissement = await Etablissement.findByIdAndUpdate(
      reservation.idEtab,
      { nbRev: etablissement.nbRev + reservation.nbChomber },
      { new: true }
    );

    // Renvoyer la réponse avec les détails de la réservation et de l'établissement
    res.status(200).json({
      message: 'Réservation acceptée avec succès',
      reservation: updatedReservation,
      etablissement: updatedEtablissement
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



















module.exports = { addReservation,getReservationById,updateReservation, getReservations,accepteReservation,deleteReservation };
