const express = require('express');
const router = express.Router();
const coachController = require('../controllers/coachController');
const { authMiddleware } = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.post('/chat', coachController.chat);
router.post('/tutor', coachController.askTutor);
router.get('/strategy', coachController.getStrategy);
router.get('/logs', coachController.getCoachLogs);

module.exports = router;
