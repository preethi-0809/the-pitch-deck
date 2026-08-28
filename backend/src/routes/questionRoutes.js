const express = require('express');
const router = express.Router();
const questionController = require('../controllers/questionController');
const { authMiddleware } = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.post('/generate', questionController.generateQuestions);
router.post('/adaptive-next', questionController.getAdaptiveNext);
router.get('/pyqs/:examId', questionController.getPYQs);

module.exports = router;
