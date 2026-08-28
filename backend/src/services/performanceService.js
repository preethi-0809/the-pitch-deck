const performanceTool = require('../../../ai/tools/performanceTool');
const weaknessAgent = require('../../../ai/agents/weaknessAgent');
const timeManagementAgent = require('../../../ai/agents/timeManagementAgent');
const examReadinessAgent = require('../../../ai/agents/examReadinessAgent');

const performanceService = {
  async getPerformanceDashboard(userId) {
    const summary = await performanceTool.getUserPerformanceSummary(userId);
    const weaknessAnalysis = await weaknessAgent.analyzeUserWeaknesses(userId);
    const timeAnalysis = await timeManagementAgent.analyzePacing(userId);
    const readiness = await examReadinessAgent.calculateReadiness(userId);

    return {
      summary,
      weaknessAnalysis,
      timeAnalysis,
      readiness
    };
  }
};

module.exports = performanceService;
