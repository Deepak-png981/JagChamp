const express = require('express');
const { signup, signin, getAllLessons, getLessonByID } = require('../../controllers/User/userAuth.controller');
const { isUserAuthenticated } = require('../../middleware/authMiddleware');
const router = express.Router();

router.post('/signup', signup);
router.post('/signin', signin);
router.get('/lessons', isUserAuthenticated, getAllLessons);
router.get('/lessons/:id', isUserAuthenticated, getLessonByID);


module.exports = router;