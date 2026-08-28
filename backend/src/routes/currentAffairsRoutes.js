const express = require('express');
const router = express.Router();
const ragCurrentAffairsController = require('../controllers/ragCurrentAffairsController');
const { optionalAuth, adminMiddleware } = require('../middleware/authMiddleware');

// Public / Aspirant Endpoints
router.get('/', optionalAuth, ragCurrentAffairsController.getFeed);
router.post('/search', optionalAuth, ragCurrentAffairsController.semanticSearch);
router.get('/quiz/daily', optionalAuth, ragCurrentAffairsController.getDailyQuiz);
router.get('/one-liners', optionalAuth, ragCurrentAffairsController.getOneLiners);
router.post('/bookmark', optionalAuth, ragCurrentAffairsController.toggleBookmark);
router.post('/read', optionalAuth, ragCurrentAffairsController.markAsRead);

// Admin Management Endpoints
router.get('/admin/sources', optionalAuth, ragCurrentAffairsController.adminGetSources);
router.post('/admin/ingest', optionalAuth, ragCurrentAffairsController.adminTriggerIngestion);
router.post('/admin/toggle-source', optionalAuth, ragCurrentAffairsController.adminToggleSource);

module.exports = router;
