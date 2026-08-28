const agentOrchestrator = require('./agentOrchestrator');
const db = require('../../backend/src/config/database');

const workflowManager = {
  async runDailyOrchestration(userId) {
    const planner = agentOrchestrator.getAgent('studyPlanner');
    const accountability = agentOrchestrator.getAgent('accountability');
    const readiness = agentOrchestrator.getAgent('examReadiness');

    // 1. Rebalance any missed tasks
    const rebalance = await accountability.checkAdherenceAndRedistribute(userId);

    // 2. Ensure active daily plan exists
    const dailyPlan = await planner.generateDailyPlan(userId);

    // 3. Compute readiness
    const readinessData = await readiness.calculateReadiness(userId);

    return {
      rebalance,
      dailyPlan,
      readinessData
    };
  }
};

module.exports = workflowManager;
