const express = require('express');
const router = express.Router();
const examController = require('../controllers/examController');
const { authMiddleware } = require('../middleware/authMiddleware');

router.get('/', examController.getAllExams);
router.get('/materials', authMiddleware, examController.getStudyMaterials);
router.get('/:examId/syllabus', authMiddleware, examController.getExamSyllabus);
router.get('/:examId/syllabus-status', authMiddleware, examController.getUserSyllabusStatus);

module.exports = router;
