const express = require('express');
const { signup, signin, createLesson, getAllLessons, updateLesson, getLesson, deleteLesson } = require('../../controllers/Admin/adminAuth.controller');
const { isAdminAuthenticated } = require('../../middleware/authMiddleware');
const router = express.Router();

router.post('/signup', signup);
router.post('/signin', signin);

//CRUD on the lessons
router.post('/createLesson', isAdminAuthenticated, createLesson)
router.post('/lesson/:id', isAdminAuthenticated, updateLesson);
router.get('/lessons', isAdminAuthenticated, getAllLessons);
router.get('/lesson/:id', isAdminAuthenticated, getLesson);
router.delete('/lesson/:id', isAdminAuthenticated, deleteLesson)
module.exports = router;