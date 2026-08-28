const agentOrchestrator = require('./orchestration/agentOrchestrator');
const workflowManager = require('./orchestration/workflowManager');
const db = require('../backend/src/config/database');

const aiService = {
  orchestrator: agentOrchestrator,
  workflow: workflowManager,

  // Direct AI Coach conversation
  async askCoach(userId, message) {
    const coachAgent = agentOrchestrator.getAgent('examCoach');
    const response = await coachAgent.handleUserQuery(userId, message);

    // Save to AI coach logs
    try {
      const logId = `log_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      db.run(`
        INSERT INTO ai_coach_logs (id, user_id, agent_name, message_type, user_message, ai_response, structured_data)
        VALUES (?, ?, 'ExamCoachAgent', 'user_query', ?, ?, ?)
      `, [logId, userId, message, response.reply, JSON.stringify(response)]);
    } catch (e) {
      console.warn('Failed to write coach log:', e.message);
    }

    return response;
  },

  // AI Doubt Solver / Tutor
  async solveDoubt({ query, topicId, explanationMode, language }) {
    const tutorAgent = agentOrchestrator.getAgent('tutor');
    return await tutorAgent.explainConcept({ query, topicId, explanationMode, language });
  },

  // Generate Questions
  async generateQuestions(params) {
    const questionAgent = agentOrchestrator.getAgent('questionGenerator');
    return await questionAgent.generateQuestions(params);
  },

  // Next Adaptive Question
  async getNextAdaptiveQuestion(params) {
    const adaptiveAgent = agentOrchestrator.getAgent('adaptiveTest');
    return await adaptiveAgent.getNextAdaptiveQuestion(params);
  },

  // Generate / Regenerate Study Plan
  async generateStudyPlan(userId, customHours = null) {
    const plannerAgent = agentOrchestrator.getAgent('studyPlanner');
    return await plannerAgent.generateDailyPlan(userId, null, customHours);
  },

  // Strategy & Roadmap
  async getExamStrategy(userId) {
    const strategyAgent = agentOrchestrator.getAgent('examStrategy');
    return await strategyAgent.generateStrategy(userId);
  },

  // Performance & Weakness
  async analyzeAttempt(attemptId, userId) {
    return await agentOrchestrator.executePostTestWorkflow(attemptId, userId);
  },

  async getUserWeaknesses(userId) {
    const weaknessAgent = agentOrchestrator.getAgent('weaknessAgent');
    return await weaknessAgent.analyzeUserWeaknesses(userId);
  },

  async getReadiness(userId) {
    const readinessAgent = agentOrchestrator.getAgent('examReadiness');
    return await readinessAgent.calculateReadiness(userId);
  }
};

module.exports = aiService;
