const aiService = require('../../../ai/aiService');
const db = require('../config/database');

const coachController = {
  async chat(req, res, next) {
    try {
      const { message } = req.body;
      if (!message) {
        return res.status(400).json({ success: false, message: 'Message cannot be empty.' });
      }
      const response = await aiService.askCoach(req.user.id, message);
      res.json({ success: true, ...response });
    } catch (err) {
      next(err);
    }
  },

  async askTutor(req, res, next) {
    try {
      const { query, topicId, explanationMode, language } = req.body;
      const result = await aiService.solveDoubt({
        query,
        topicId,
        explanationMode: explanationMode || 'exam_oriented',
        language: language || req.user.preferred_language || 'en'
      });
      res.json({ success: true, ...result });
    } catch (err) {
      next(err);
    }
  },

  async getStrategy(req, res, next) {
    try {
      const strategy = await aiService.getExamStrategy(req.user.id);
      res.json({ success: true, strategy });
    } catch (err) {
      next(err);
    }
  },

  async getCoachLogs(req, res, next) {
    try {
      const logs = db.query('SELECT * FROM ai_coach_logs WHERE user_id = ? ORDER BY created_at DESC LIMIT 20', [req.user.id]);
      res.json({ success: true, logs });
    } catch (err) {
      next(err);
    }
  }
};

module.exports = coachController;
