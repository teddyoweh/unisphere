const express = require('express');
const { logincontroller, registercontroller } = require('./auth.controller');
const { sendThread, getThread, getThreadMajors, getThreadCourses } = require('./threads.controller');
const router = express.Router();
router.post('/auth/login', logincontroller);
router.post('/auth/register', registercontroller);
router.post('/threads/send', sendThread);
router.post('/threads/get', getThread);
router.post('/threads/getmajors', getThreadMajors);
router.post('/threads/getcourses', getThreadCourses);

module.exports = router;