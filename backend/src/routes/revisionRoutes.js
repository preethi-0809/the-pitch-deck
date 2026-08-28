const express = require('express');
const router = express.Router();
const revisionController = require('../controllers/revisionController');
const { authMiddleware } = require('../middleware/authMiddleware');

router.use(authMiddleware);
router.get('/', revisionController.getRevisions);
router.post('/generate', revisionController.generateRevisions);
router.post('/flashcard-rate', revisionController.rateFlashcard);
router.post('/:revisionId/complete', revisionController.completeRevision);

module.exports = router;
