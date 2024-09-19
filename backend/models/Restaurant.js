const mongoose = require('mongoose');
const Etablissement = require('./Etablissement'); // Assurez-vous d'avoir un schéma pour les établissements
const { required } = require('joi');

const RestaurantSchema = new mongoose.Schema({
  // Champs spécifiques à l'hôtel

  idProp: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',

    required:true,
  },
  
  nom: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 100,
    required:true,
  },
  prix: {
    
    type: Number,  required:true,
    
  },
  number: {
    type: String,
    required: true,
    trim: true,
    minlength: 6,
    maxlength: 20,
    required:true,
  },
  adress: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 50,
    required:true,
  },
  capacity: {
    
    type: Number,
    required:true,
    
  },


  Nbetoil: {
    type: Number,
    required: true,
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
      url: "https://media-cdn.tripadvisor.com/media/photo-w/11/34/8e/cf/facade-du-resto.jpg",
      publicId: null,
      url1: "https://media-cdn.tripadvisor.com/media/photo-w/11/34/8e/cf/facade-du-resto.jpg",
      publicId1: null,
      url3: "https://media-cdn.tripadvisor.com/media/photo-w/11/34/8e/cf/facade-du-resto.jpg",
      publicId3: null,
      url4:"https://media-cdn.tripadvisor.com/media/photo-w/11/34/8e/cf/facade-du-resto.jpg",
      publicId4: null,
      url5:"https://media-cdn.tripadvisor.com/media/photo-w/11/34/8e/cf/facade-du-resto.jpg",
    },
  },
});

const Restaurant = Etablissement.discriminator('Restaurant', RestaurantSchema);

module.exports = Restaurant;
