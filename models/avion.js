let mongoose = require('mongoose');

// Schema avion
let avionSchema = mongoose.Schema({

  NumVol:{
    type: String,
    required: true
  },
  DateDepart:{
    type: Date, 
    required: true
  },
  DateArriv:{
    type: Date, 
    required: true
  },
  type:{
    type: String,
    required: true
  },
  transporteur:{
    type: String,
    required: true
  },
  pisteDecol:{
    type: String,
    required: true
  },
  pisteAtterri:{
    type: String,
    required: true
  },
  Altitude:{
    type: Number,
    default:0,
    required: false
  },
  isDeparted:{
    type: Boolean,
    default: false,
    required: false
  },
  isLanded:{
    type: Boolean,
    default: false,
    required: false
  }

});

let Avion = module.exports = mongoose.model('Avion', avionSchema);
