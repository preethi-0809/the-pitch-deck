const notificationEngine = require('../services/notificationEngine');

const notificationController = {
  // 1. Get In-App Notifications
  async getNotifications(req, res, next) {
    try {
      const { type, unreadOnly } = req.query;
      const userId = req.user ? req.user.id : null;
      const data = await notificationEngine.getInAppNotifications(userId, { type, unreadOnly });
      res.json({ success: true, ...data });
    } catch (err) {
      next(err);
    }
  },

  // 2. Mark In-App Notification Read
  async markRead(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user ? req.user.id : null;
      const result = await notificationEngine.markInAppNotificationRead(userId, id);
      res.json(result);
    } catch (err) {
      next(err);
    }
  },

  // 3. Mark All In-App Notifications Read
  async markAllRead(req, res, next) {
    try {
      const userId = req.user ? req.user.id : null;
      const result = await notificationEngine.markAllInAppNotificationsRead(userId);
      res.json(result);
    } catch (err) {
      next(err);
    }
  },

  // 4. Get Email Preferences & Logs
  async getPreferences(req, res, next) {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'Authentication required' });
      }
      const userId = req.user.id;
      const preferences = await notificationEngine.getUserPreferences(userId);
      const logs = await notificationEngine.getUserNotificationLogs(userId);
      const examAlerts = await notificationEngine.getUserExamAlerts(userId);
      res.json({ success: true, preferences, logs, examAlerts });
    } catch (err) {
      next(err);
    }
  },

  // 5. Update Email Preferences
  async updatePreferences(req, res, next) {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'Authentication required' });
      }
      const userId = req.user.id;
      const updated = await notificationEngine.updateUserPreferences(userId, req.body);
      res.json({ success: true, preferences: updated, message: 'Notification preferences saved successfully!' });
    } catch (err) {
      next(err);
    }
  },

  // 6. Get Email Delivery History Logs
  async getLogs(req, res, next) {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'Authentication required' });
      }
      const userId = req.user.id;
      const logs = await notificationEngine.getUserNotificationLogs(userId);
      res.json({ success: true, logs });
    } catch (err) {
      next(err);
    }
  },

  // 7. Get Per-Exam Alert Subscriptions
  async getExamAlerts(req, res, next) {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'Authentication required' });
      }
      const userId = req.user.id;
      const alerts = await notificationEngine.getUserExamAlerts(userId);
      res.json({ success: true, alerts });
    } catch (err) {
      next(err);
    }
  },

  // 8. Toggle Per-Exam Alert Subscription
  async toggleExamAlert(req, res, next) {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'Authentication required' });
      }
      const userId = req.user.id;
      const { examId, isEnabled } = req.body;
      if (!examId) {
        return res.status(400).json({ success: false, message: 'examId is required' });
      }
      const result = await notificationEngine.toggleExamAlert(userId, examId, isEnabled);
      res.json({ success: true, ...result });
    } catch (err) {
      next(err);
    }
  },

  // 9. Trigger Manual Test Email to Registered User Email
  async triggerTestEmail(req, res, next) {
    try {
      const { alertType, language, recipientEmail } = req.body;
      const db = require('../config/database');
      
      let userId = req.user ? req.user.id : null;
      if (!userId) {
        const targetEmail = recipientEmail || process.env.ADMIN_NOTIFICATION_EMAIL || 'preethika0809@gmail.com';
        const u = db.get('SELECT id FROM users WHERE email = ?', [targetEmail]) || db.get('SELECT id FROM users LIMIT 1');
        userId = u ? u.id : 'usr_default';
      }

      const result = await notificationEngine.dispatchManualTestEmail(userId, alertType, language, recipientEmail);
      const logs = await notificationEngine.getUserNotificationLogs(userId);
      res.json({ ...result, logs });
    } catch (err) {
      next(err);
    }
  },

  // 10. Admin Notification Overview Dashboard
  async getAdminStats(req, res, next) {
    try {
      const stats = await notificationEngine.getAdminNotificationStats();
      res.json({ success: true, ...stats });
    } catch (err) {
      next(err);
    }
  },

  // 11. Run Automated Notification Engine Cycle
  async runEngineCycle(req, res, next) {
    try {
      const result = await notificationEngine.runNotificationEngine();
      res.json(result);
    } catch (err) {
      next(err);
    }
  }
};

module.exports = notificationController;
