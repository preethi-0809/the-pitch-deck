const express = require('express');
const router = express.Router();
const studyController = require('../controllers/studyController');
const { authMiddleware } = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/plan', studyController.getDailyPlan);
router.post('/tasks', studyController.addTask);
router.delete('/tasks/:taskId', studyController.deleteTask);
router.patch('/tasks/:taskId', studyController.toggleTask);
router.post('/plan/regenerate', studyController.regeneratePlan);
router.post('/plan/redistribute', studyController.redistributeMissed);

module.exports = router;
