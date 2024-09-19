const Etablissement = require('../models/Etablissement');
const Hotel =require('../models/hotel');
const Maison = require('../models/maison');
const Restaurant =require('../models/Restaurant');
const Reservation =require('../models/Reservation');











const addMaison = async (req, res) => {
  let maison1 = await Maison.findOne({ email: req.body.email });
      if (maison1) {
        return res.status(400).json({ message: 'Maison already exists' });
      }  
  const { idProp, nom, email,description,prix, number,capacity, adress ,Nbetoil,nombreChambres} = req.body;
  try {
    const maison = new Maison({ idProp,prix, description,nom, email,capacity, number, adress,Nbetoil ,nombreChambres});
    await maison.save();
    res.status(201).json(maison);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};








//hotel
const addHotel = async (req, res) => {
  const idProp=req.user.id
  let hotel1 = await Hotel.findOne({ email: req.body.email });
      if (hotel1) {
        return res.status(400).json({ message: 'Hotel already exists' });
      }  
  const { nom, email,prix, number,description, capacity,adress ,Nbetoil} = req.body;
  try {
    const hotel = new Hotel({ idProp, prix,nom,description, email,capacity, number, adress,Nbetoil });
    await hotel.save();
    res.status(201).json(hotel);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};








//Restaurant
const addRestaurant = async (req, res) => {
  const idProp=req.user.id
  let restaurant1 = await Restaurant.findOne({ email: req.body.email });
  if (restaurant1) {
    return res.status(400).json({ message: 'res already exists' });
  }  
  const {  nom, email, number,prix,description, adress,capacity,Nbetoil } = req.body;
  try {
    const restaurant = new Restaurant({prix, description,idProp, nom, email,capacity, number,Nbetoil, adress });
    await restaurant.save();
    res.status(201).json(restaurant);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};






const getEtablisementCountCtrl = async (req, res) => {
  try {
    // Count the total number of Etablissement documents
    const etablissementCount = await Etablissement.countDocuments();
    
    // Send the count as a JSON response
    res.status(200).json(etablissementCount);
  } catch (error) {
    // Handle potential errors
    if (!res.headersSent) {
      res.status(500).json({ message: 'Server error', error: error.message });
    } else {
      console.error('Error after headers sent:', error);
    }
  }
};






const getEtablissementById = async (req, res) => {
  try {
    const etablissement = await Etablissement.find({idProp:req.user.id});
    res.status(200).json(etablissement);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



const deleteEtablissementById = async (req, res) => {
  const EtabId = req.params.id;
  try {
    // Find and delete the etablissement by ID
    const etablissement = await Etablissement.findByIdAndDelete(EtabId);
    if (!etablissement) {
      return res.status(404).json({ message: 'Etablissement not found' });
    }

    // Find all reservations associated with the etablissement ID
    const reservations = await Reservation.find({ idEtab: EtabId });
    if (reservations && reservations.length > 0) {
      // Loop through each reservation and delete it
      for (const reservation of reservations) {
        await Reservation.findByIdAndDelete(reservation._id);
      }
    }

    res.status(200).json({ message: 'Etablissement and associated reservations deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getEtablissement = async (req, res) => {
  try {
    const data = await Etablissement.find().populate();

    console.log(data);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};





module.exports = {  addRestaurant,getEtablisementCountCtrl,deleteEtablissementById, addHotel,getEtablissement,addMaison, getEtablissementById  };
