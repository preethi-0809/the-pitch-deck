const testService = require('../services/testService');
const performanceAgent = require('../../../ai/agents/performanceAgent');

const testController = {
  async getTests(req, res, next) {
    try {
      const { examId } = req.query;
      const tests = await testService.getTestsForExam(examId || req.user.profile?.target_exam_id);
      res.json({ success: true, tests });
    } catch (err) {
      next(err);
    }
  },

  async getTestDetails(req, res, next) {
    try {
      const { testId } = req.params;
      const test = await testService.getTestDetails(testId);
      res.json({ success: true, test });
    } catch (err) {
      next(err);
    }
  },

  async submitTest(req, res, next) {
    try {
      const { testId } = req.params;
      const { answers, timeTakenSeconds } = req.body;
      const result = await testService.submitTest(req.user.id, testId, answers || [], timeTakenSeconds);
      res.json({ success: true, ...result });
    } catch (err) {
      next(err);
    }
  },

  async getAttemptAnalysis(req, res, next) {
    try {
      const { attemptId } = req.params;
      const analysis = await performanceAgent.analyzeAttempt(attemptId);
      res.json({ success: true, analysis });
    } catch (err) {
      next(err);
    }
  }
};

module.exports = testController;
