const { model } = require("mongoose");
const Course = require("./courses.model");
const { courses, majors } = require("./data");
const Major = require("./majors.model");

async function modCourses() {
    const data = courses
    try {
      const existingCourses = await Course.find({
        $or: data.map(item => ({
          course_number: item.course_number,
          major: item.major,
        })),
      });
  
      if (existingCourses.length === 0) {
      
        const insertedCourses = await Course.insertMany(data);
        return insertedCourses;
      } else {
        return existingCourses;  
      }
    } catch (error) {
      console.error('Error inserting data:', error);
      throw error;
    }
  }

async function modMajors() {
    const majorsData = majors
    try {
      
      const existingMajors = await Major.find();
      if (existingMajors.length === 0) {
        await Major.insertMany(majorsData);
        console.log('Majors data inserted successfully.');
      } else {
        console.log('Majors data already exists.');
      }
    } catch (error) {
      console.error('Error while checking/inserting majors data:', error);
    }
  }

module.exports = { modCourses,modMajors};    