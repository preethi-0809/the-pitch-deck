const studyPlanTool = require('../../../ai/tools/studyPlanTool');
const studyPlannerAgent = require('../../../ai/agents/studyPlannerAgent');

const studyPlanService = {
  async getTodayPlan(userId, dateStr) {
    let plan = await studyPlanTool.getTodayPlan(userId, dateStr);
    if (!plan || !plan.tasks || plan.tasks.length === 0) {
      plan = await studyPlannerAgent.generateDailyPlan(userId, dateStr);
    }
    return plan;
  },

  async toggleTask(taskId, isCompleted) {
    return await studyPlanTool.toggleTaskCompletion(taskId, isCompleted);
  },

  async addCustomTask(userId, taskData) {
    return await studyPlanTool.addCustomTask(userId, taskData);
  },

  async deleteTask(userId, taskId) {
    return await studyPlanTool.deleteTask(userId, taskId);
  },

  async regeneratePlan(userId, customHours, strategy) {
    return await studyPlannerAgent.generateDailyPlan(userId, null, customHours, strategy);
  },

  async redistributeMissed(userId) {
    return await studyPlanTool.redistributeMissedTasks(userId);
  }
};

module.exports = studyPlanService;
