
const mongoose = require('mongoose');
const User = require('./User'); // Assurez-vous d'avoir un schéma pour les établissements

const evalSchema = new mongoose.Schema({
  // Champs spécifiques à l'hôtel

  idClient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  idEtab: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Etablissement',
  },
  Comment:{
    type:String
  },
}, {
  timestamps: true
});

const eval = mongoose.model('eval',evalSchema);

module.exports = eval;
