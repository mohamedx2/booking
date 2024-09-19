const mongoose = require('mongoose');
const Etablissement = require('./Etablissement'); // Assurez-vous d'avoir un schéma pour les établissements
const { required } = require('joi');

const MaisonSchema = new mongoose.Schema({
  // Champs spécifiques à l'hôtel

  idProp: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',

    required:true,
  },
  
  Nbetoil: {
    type: Number,
    required: true,
  },

  nom: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 100,  require:true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    minlength: 5,
    maxlength: 100,
    unique: true,  
  },
  number: {
    type: String,
    required: true,
    trim: true,
    minlength: 6,
    maxlength: 20,  require:true,
  },
  adress: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 50,  
  },

  prix: {
    
    type: Number,
    require:true,
  },
  
  nombreChambres: {
    
    type: Number,
    require:true,
  },
  capacity: {
    
    type: Number,
    default:1,
    require:true,
  },
  nbRev: {
    type : Number,
    required:true,
    default:0,
  },
  description: {
    type: String,
    required: true,
    trim: true,
    minlength: 100,
  },
  profilePhoto: {
    type: Object,
    default: {
      url: "https://www.marhba.com/images/alternatif/alternatif2020/gaied.jpg",
      publicId: null,
      url1: "https://www.marhba.com/images/alternatif/alternatif2020/gaied.jpg",
      publicId1: null,
      url3: "https://www.marhba.com/images/alternatif/alternatif2020/gaied.jpg",
      publicId3: null,
      url4:"https://www.marhba.com/images/alternatif/alternatif2020/gaied.jpg",
      publicId4: null,
      url5:"https://www.marhba.com/images/alternatif/alternatif2020/gaied.jpg",
    },
  },
});

const Maison = Etablissement.discriminator('Maison', MaisonSchema);


module.exports = Maison;
