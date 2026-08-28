const ragCurrentAffairsService = require('../services/ragCurrentAffairsService');

const ragCurrentAffairsController = {
  async getFeed(req, res, next) {
    try {
      const { category, examId, month, search, limit } = req.query;
      const userId = req.user ? req.user.id : null;
      const feed = await ragCurrentAffairsService.getCuratedRAGFeed({
        category,
        examId,
        month,
        search,
        limit,
        userId
      });
      res.json({ success: true, count: feed.length, data: feed, feed });
    } catch (err) {
      next(err);
    }
  },

  async semanticSearch(req, res, next) {
    try {
      const { query, dateRange, examId } = req.body;
      const result = await ragCurrentAffairsService.semanticSearchCurrentAffairs(query, { dateRange, examId });
      res.json({ success: true, data: result, ...result });
    } catch (err) {
      next(err);
    }
  },

  async getDailyQuiz(req, res, next) {
    try {
      const { examId, date } = req.query;
      const quiz = await ragCurrentAffairsService.getDailyQuiz(examId, date);
      res.json({ success: true, data: quiz });
    } catch (err) {
      next(err);
    }
  },

  async getOneLiners(req, res, next) {
    try {
      const { month, category } = req.query;
      const oneLiners = await ragCurrentAffairsService.getOneLinerRevision(month, category);
      res.json({ success: true, count: oneLiners.length, data: oneLiners });
    } catch (err) {
      next(err);
    }
  },

  async toggleBookmark(req, res, next) {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'Authentication required' });
      }
      const { caId } = req.body;
      const userId = req.user.id;
      const result = await ragCurrentAffairsService.toggleBookmark(userId, caId);
      res.json(result);
    } catch (err) {
      next(err);
    }
  },

  async markAsRead(req, res, next) {
    try {
      const { caId } = req.body;
      const userId = req.user ? req.user.id : null;
      const result = await ragCurrentAffairsService.markAsRead(userId, caId);
      res.json(result);
    } catch (err) {
      next(err);
    }
  },

  // Admin Endpoints
  async adminGetSources(req, res, next) {
    try {
      const data = await ragCurrentAffairsService.adminGetSources();
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  },

  async adminTriggerIngestion(req, res, next) {
    try {
      const result = await ragCurrentAffairsService.adminTriggerIngestion();
      res.json(result);
    } catch (err) {
      next(err);
    }
  },

  async adminToggleSource(req, res, next) {
    try {
      const { sourceId, status } = req.body;
      const result = await ragCurrentAffairsService.adminToggleSource(sourceId, status);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }
};

module.exports = ragCurrentAffairsController;
