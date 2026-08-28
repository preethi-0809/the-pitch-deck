const studyPlanTool = require('../tools/studyPlanTool');

const accountabilityAgent = {
  name: 'AccountabilityAgent',
  description: 'Monitors study plan adherence, detects missed sessions, and automatically redistributes pending workload.',

  async checkAdherenceAndRedistribute(userId) {
    const todayPlan = await studyPlanTool.getTodayPlan(userId);
    const redistributionResult = await studyPlanTool.redistributeMissedTasks(userId);

    const completionRate = todayPlan && todayPlan.total_planned_minutes > 0
      ? Math.round((todayPlan.total_completed_minutes / todayPlan.total_planned_minutes) * 100)
      : 0;

    return {
      todayCompletionRate: completionRate,
      redistributionResult,
      accountabilityStatus: completionRate >= 80 ? 'Excellent Adherence' : (completionRate >= 40 ? 'Moderate Progress' : 'Action Needed')
    };
  }
};

module.exports = accountabilityAgent;
