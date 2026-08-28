const examCoachAgent = require('../agents/examCoachAgent');
const examStrategyAgent = require('../agents/examStrategyAgent');
const studyPlannerAgent = require('../agents/studyPlannerAgent');
const tutorAgent = require('../agents/tutorAgent');
const questionGeneratorAgent = require('../agents/questionGeneratorAgent');
const adaptiveTestAgent = require('../agents/adaptiveTestAgent');
const performanceAgent = require('../agents/performanceAgent');
const weaknessAgent = require('../agents/weaknessAgent');
const revisionAgent = require('../agents/revisionAgent');
const currentAffairsAgent = require('../agents/currentAffairsAgent');
const pyqAnalysisAgent = require('../agents/pyqAnalysisAgent');
const syllabusTrackingAgent = require('../agents/syllabusTrackingAgent');
const timeManagementAgent = require('../agents/timeManagementAgent');
const accountabilityAgent = require('../agents/accountabilityAgent');
const examReadinessAgent = require('../agents/examReadinessAgent');

const agents = {
  examCoach: examCoachAgent,
  examStrategy: examStrategyAgent,
  studyPlanner: studyPlannerAgent,
  tutor: tutorAgent,
  questionGenerator: questionGeneratorAgent,
  adaptiveTest: adaptiveTestAgent,
  performance: performanceAgent,
  weakness: weaknessAgent,
  revision: revisionAgent,
  currentAffairs: currentAffairsAgent,
  pyqAnalysis: pyqAnalysisAgent,
  syllabusTracking: syllabusTrackingAgent,
  timeManagement: timeManagementAgent,
  accountability: accountabilityAgent,
  examReadiness: examReadinessAgent
};

const agentOrchestrator = {
  getAgent(agentName) {
    return agents[agentName] || null;
  },

  getAllAgents() {
    return Object.keys(agents).map(key => ({
      key,
      name: agents[key].name,
      description: agents[key].description
    }));
  },

  /**
   * Main Autonomous Workflow Pipeline:
   * Test Completed -> Performance Agent -> Mistake Agent -> Weakness Agent -> Auto-Revision -> Planner Adaptation
   */
  async executePostTestWorkflow(attemptId, userId) {
    console.log(`🤖 Starting Autonomous Post-Test Workflow for attempt: ${attemptId}`);
    
    // 1. Performance Analysis
    const performanceAnalysis = await performanceAgent.analyzeAttempt(attemptId);
    
    // 2. Weakness & Mistake Analysis
    const weaknessAnalysis = await weaknessAgent.analyzeUserWeaknesses(userId);

    // 3. Auto-trigger Revision for repeated mistakes
    if (weaknessAnalysis.repeatedMistakes && weaknessAnalysis.repeatedMistakes.length > 0) {
      const topMistake = weaknessAnalysis.repeatedMistakes[0];
      await weaknessAgent.triggerAutoRemediation(userId, topMistake.topic_id, topMistake.mistake_type);
    }

    // 4. Update Exam Readiness
    const readiness = await examReadinessAgent.calculateReadiness(userId);

    return {
      performanceAnalysis,
      weaknessAnalysis,
      readiness,
      workflowStatus: 'Completed and synced with study plan & revision schedule'
    };
  }
};

module.exports = agentOrchestrator;
