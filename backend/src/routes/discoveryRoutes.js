const express = require('express');
const router = express.Router();
const discoveryController = require('../controllers/discoveryController');
const { optionalAuth, requireAuth } = require('../middleware/authMiddleware');

// Public Discovery Endpoints
router.get('/exams', discoveryController.getExams);
router.get('/exams/:id', discoveryController.getExamById);
router.post('/finder', discoveryController.getPersonalizedRecommendations);
router.post('/compare', optionalAuth, discoveryController.compareExams);
router.get('/calendar', discoveryController.getCalendarEvents);
router.post('/ai-eligibility', discoveryController.checkNaturalLanguageEligibility);
router.post('/roadmap', discoveryController.getStudyRoadmap);
router.get('/notifications', optionalAuth, discoveryController.getNotifications);

// Aspirant Target & Saved Exams (User specific)
router.get('/targets', optionalAuth, discoveryController.getUserTargetExams);
router.post('/targets', optionalAuth, discoveryController.toggleTargetExam);
router.post('/targets/toggle', optionalAuth, discoveryController.toggleTargetExam);
router.get('/saved', optionalAuth, discoveryController.getUserSavedExams);
router.post('/saved', optionalAuth, discoveryController.toggleSavedExam);
router.post('/saved/toggle', optionalAuth, discoveryController.toggleSavedExam);

module.exports = router;
