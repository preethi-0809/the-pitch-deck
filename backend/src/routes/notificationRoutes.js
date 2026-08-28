const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { optionalAuth, authMiddleware } = require('../middleware/authMiddleware');

// In-App Notification Center
router.get('/', optionalAuth, notificationController.getNotifications);
router.post('/:id/read', optionalAuth, notificationController.markRead);
router.post('/read-all', optionalAuth, notificationController.markAllRead);

// Email Notification Settings & Logs
router.get('/preferences', optionalAuth, notificationController.getPreferences);
router.put('/preferences', optionalAuth, notificationController.updatePreferences);
router.get('/logs', optionalAuth, notificationController.getLogs);

// Per-Exam Alert Subscriptions
router.get('/exam-alerts', optionalAuth, notificationController.getExamAlerts);
router.post('/exam-alerts/toggle', optionalAuth, notificationController.toggleExamAlert);

// Admin Notification Stats
router.get('/admin-stats', optionalAuth, notificationController.getAdminStats);

// Test Email Dispatch & Engine Trigger
router.post('/send-test', optionalAuth, notificationController.triggerTestEmail);
router.post('/test-email', optionalAuth, notificationController.triggerTestEmail);
router.post('/run-engine', optionalAuth, notificationController.runEngineCycle);

module.exports = router;
