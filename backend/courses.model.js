const mongoose = require('mongoose');

 
const courseSchema = new mongoose.Schema({
  course_number: {
    type: String,
    required: true,
  },
  course_name: {
    type: String,
    required: true,
  },
  major: {
    type: String,
    required: true,
  },
});
const Course = mongoose.model('Course', courseSchema);

module.exports = Course;