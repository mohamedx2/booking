const mongoose = require('mongoose');
const Etablissement = require('./Etablissement'); // Assurez-vous d'avoir un schéma pour les établissements

const HotelSchema = new mongoose.Schema({
  // Champs spécifiques à l'hôtel

  idProp: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    require:true,
    
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
    maxlength: 100,
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
  description: {
    type: String,
    required: true,
    trim: true,
    minlength: 100,
    
  },
  nombreChambres: {
    
    type: Number,  require:true,
    
  },
  nbRev: {
    type : Number,
    required:true,
    default:0,
  },
  
  prix: {
    
    type: Number,  require:true,
  },
  



  profilePhoto: {
    type: Object,
    default: {
      url: "https://costar.brightspotcdn.com/dims4/default/06e49f6/2147483647/strip/true/crop/2100x1400+0+0/resize/2100x1400!/quality/100/?url=http%3A%2F%2Fcostar-brightspot.s3.us-east-1.amazonaws.com%2F47%2F49%2Fc026a37c42b5b43b6ce387a0c14c%2F20220912-ownership-mixedusedevelopment.jpg",
      publicId: null,
      url1: "https://costar.brightspotcdn.com/dims4/default/06e49f6/2147483647/strip/true/crop/2100x1400+0+0/resize/2100x1400!/quality/100/?url=http%3A%2F%2Fcostar-brightspot.s3.us-east-1.amazonaws.com%2F47%2F49%2Fc026a37c42b5b43b6ce387a0c14c%2F20220912-ownership-mixedusedevelopment.jpg",
      publicId1: null,
      url3: "https://costar.brightspotcdn.com/dims4/default/06e49f6/2147483647/strip/true/crop/2100x1400+0+0/resize/2100x1400!/quality/100/?url=http%3A%2F%2Fcostar-brightspot.s3.us-east-1.amazonaws.com%2F47%2F49%2Fc026a37c42b5b43b6ce387a0c14c%2F20220912-ownership-mixedusedevelopment.jpg",
      publicId3: null,
      url4: "https://costar.brightspotcdn.com/dims4/default/06e49f6/2147483647/strip/true/crop/2100x1400+0+0/resize/2100x1400!/quality/100/?url=http%3A%2F%2Fcostar-brightspot.s3.us-east-1.amazonaws.com%2F47%2F49%2Fc026a37c42b5b43b6ce387a0c14c%2F20220912-ownership-mixedusedevelopment.jpg",
      publicId4: null,
      url5:"https://costar.brightspotcdn.com/dims4/default/06e49f6/2147483647/strip/true/crop/2100x1400+0+0/resize/2100x1400!/quality/100/?url=http%3A%2F%2Fcostar-brightspot.s3.us-east-1.amazonaws.com%2F47%2F49%2Fc026a37c42b5b43b6ce387a0c14c%2F20220912-ownership-mixedusedevelopment.jpg",
      publicId5: null,
    },
  },
});

const Hotel = Etablissement.discriminator('Hotel', HotelSchema);


module.exports = Hotel;
