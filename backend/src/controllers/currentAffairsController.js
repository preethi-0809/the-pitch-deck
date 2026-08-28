const currentAffairsService = require('../services/currentAffairsService');

const currentAffairsController = {
  async getFeed(req, res, next) {
    try {
      const { category, limit } = req.query;
      const feed = await currentAffairsService.getFeed({
        category,
        limit: limit ? parseInt(limit) : 10,
        examCode: req.user.profile?.target_exam_id
      });
      res.json({ success: true, feed });
    } catch (err) {
      next(err);
    }
  },

  async generateQuestionsFromNews(req, res, next) {
    try {
      const { articleId, examId } = req.body;
      const question = await currentAffairsService.generateQuestionsFromArticle(articleId, examId || req.user.profile?.target_exam_id);
      res.json({ success: true, question });
    } catch (err) {
      next(err);
    }
  },

  async createArticle(req, res, next) {
    try {
      const article = await currentAffairsService.addArticle(req.body);
      res.status(201).json({ success: true, article });
    } catch (err) {
      next(err);
    }
  }
};

module.exports = currentAffairsController;
