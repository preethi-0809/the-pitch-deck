const discoveryService = require('../services/discoveryService');

/**
 * Controller for India Government Exam Discovery Platform
 */
class DiscoveryController {
  async getExams(req, res, next) {
    try {
      const exams = await discoveryService.getExams(req.query);
      res.json({ success: true, count: exams.length, data: exams });
    } catch (err) {
      next(err);
    }
  }

  async getExamById(req, res, next) {
    try {
      const exam = await discoveryService.getExamById(req.params.id);
      if (!exam) {
        return res.status(404).json({ success: false, message: 'Exam not found' });
      }
      res.json({ success: true, data: exam });
    } catch (err) {
      next(err);
    }
  }

  async getPersonalizedRecommendations(req, res, next) {
    try {
      const recommendations = await discoveryService.getPersonalizedRecommendations(req.body);
      res.json({ success: true, count: recommendations.length, data: recommendations });
    } catch (err) {
      next(err);
    }
  }

  async compareExams(req, res, next) {
    try {
      const { exam_ids } = req.body;
      const userProfile = req.user || null;
      const comparison = await discoveryService.compareExams(exam_ids, userProfile);
      res.json({ success: true, data: comparison });
    } catch (err) {
      next(err);
    }
  }

  async getCalendarEvents(req, res, next) {
    try {
      const events = await discoveryService.getCalendarEvents(req.query);
      res.json({ success: true, count: events.length, data: events });
    } catch (err) {
      next(err);
    }
  }

  async checkNaturalLanguageEligibility(req, res, next) {
    try {
      const { query } = req.body;
      const result = await discoveryService.checkNaturalLanguageEligibility(query);
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  async getStudyRoadmap(req, res, next) {
    try {
      const { examId, durationDays } = req.body;
      const roadmap = await discoveryService.generateStudyRoadmap(examId, durationDays);
      res.json({ success: true, data: roadmap });
    } catch (err) {
      next(err);
    }
  }

  async getUserTargetExams(req, res, next) {
    try {
      const userId = req.user ? req.user.id : null;
      if (!userId) {
        return res.json({ success: true, count: 0, data: [] });
      }
      const targets = await discoveryService.getUserTargetExams(userId);
      res.json({ success: true, count: targets.length, data: targets });
    } catch (err) {
      next(err);
    }
  }

  async toggleTargetExam(req, res, next) {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'Authentication required' });
      }
      const userId = req.user.id;
      const { examId, priority } = req.body;
      const result = await discoveryService.toggleTargetExam(userId, examId, priority);
      res.json({ success: true, ...result });
    } catch (err) {
      next(err);
    }
  }

  async getUserSavedExams(req, res, next) {
    try {
      const userId = req.user ? req.user.id : null;
      if (!userId) {
        return res.json({ success: true, count: 0, data: [] });
      }
      const saved = await discoveryService.getUserSavedExams(userId);
      res.json({ success: true, count: saved.length, data: saved });
    } catch (err) {
      next(err);
    }
  }

  async toggleSavedExam(req, res, next) {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'Authentication required' });
      }
      const userId = req.user.id;
      const { examId } = req.body;
      const result = await discoveryService.toggleSavedExam(userId, examId);
      res.json({ success: true, ...result });
    } catch (err) {
      next(err);
    }
  }

  async getNotifications(req, res, next) {
    try {
      const userId = req.user ? req.user.id : null;
      const notifications = await discoveryService.getNotifications(userId);
      res.json({ success: true, count: notifications.length, data: notifications });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new DiscoveryController();
