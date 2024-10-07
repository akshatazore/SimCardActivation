//schema for sim card information

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SimCardSchema = new Schema({
  sim_number: {
    type: String,
    required: true,
    unique: true
  },
  phone_number: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'inactive',
    required: true
  },
  activation_date: {
    type: Date
  }
});

module.exports = mongoose.model('simCard', SimCardSchema);
