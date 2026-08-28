const express = require('express');
const router = express.Router();
const syllabusController = require('../controllers/syllabusController');
const { optionalAuth } = require('../middleware/authMiddleware');

router.get('/exams', optionalAuth, syllabusController.getExamsForSyllabus);
router.get('/hierarchy/:examId', optionalAuth, syllabusController.getExamSyllabusHierarchy);
router.get('/topic/:topicId', optionalAuth, syllabusController.getTopicDetailedNotes);
router.post('/progress', optionalAuth, syllabusController.updateTopicProgress);
router.get('/library', optionalAuth, syllabusController.getNotesLibrary);

module.exports = router;
