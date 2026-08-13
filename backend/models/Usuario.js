const mongoose = require("mongoose");

const usuarioSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String,
    required: true
  },

  telefono: {
    type: String,
    default: ""
  },

  avatar: {
    type: String,
    default: ""
  },

  emailVerificado: {
    type: Boolean,
    default: false
  },

  premium: {
    type: Boolean,
    default: false
  },

  favoritos: {
    type: Array,
    default: []
  }

}, {
  timestamps: true
});

module.exports = mongoose.model("Usuario", usuarioSchema);