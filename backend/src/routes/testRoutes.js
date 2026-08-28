const express = require('express');
const router = express.Router();
const testController = require('../controllers/testController');
const { authMiddleware } = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/', testController.getTests);
router.get('/:testId', testController.getTestDetails);
router.post('/:testId/submit', testController.submitTest);
router.get('/attempts/:attemptId/analysis', testController.getAttemptAnalysis);

module.exports = router;
