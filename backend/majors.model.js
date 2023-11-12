const mongoose = require('mongoose');

 
const majorSchema = new mongoose.Schema({
  index: Number,
  major: String,
});

const Major = mongoose.model('Majors', majorSchema);

module.exports = Major;