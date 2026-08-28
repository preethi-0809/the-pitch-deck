const aiService = require('../../../ai/aiService');
const questionTool = require('../../../ai/tools/questionTool');
const pyqAnalysisAgent = require('../../../ai/agents/pyqAnalysisAgent');

const questionController = {
  async generateQuestions(req, res, next) {
    try {
      const { examId, topicId, count, difficulty, questionType } = req.body;
      const questions = await aiService.generateQuestions({
        examId: examId || req.user.profile?.target_exam_id,
        topicId,
        count: parseInt(count || 5),
        difficulty: difficulty || 'medium',
        questionType: questionType || 'mcq'
      });
      res.json({ success: true, questions });
    } catch (err) {
      next(err);
    }
  },

  async getAdaptiveNext(req, res, next) {
    try {
      const { examId, topicId, currentDifficulty, history } = req.body;
      const result = await aiService.getNextAdaptiveQuestion({
        examId: examId || req.user.profile?.target_exam_id,
        topicId,
        currentDifficulty,
        history
      });
      res.json({ success: true, ...result });
    } catch (err) {
      next(err);
    }
  },

  async getPYQs(req, res, next) {
    try {
      const { examId } = req.params;
      const data = await pyqAnalysisAgent.getPYQInsights(examId);
      res.json({ success: true, ...data });
    } catch (err) {
      next(err);
    }
  }
};

module.exports = questionController;
