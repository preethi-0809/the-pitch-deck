const userDataTool = require('../tools/userDataTool');
const syllabusTool = require('../tools/syllabusTool');
const performanceTool = require('../tools/performanceTool');
const revisionTool = require('../tools/revisionTool');

const examReadinessAgent = {
  name: 'ExamReadinessAgent',
  description: 'Calculates the holistic 0-100% Exam Readiness Index, combining syllabus coverage, accuracy, and revision hygiene.',

  async calculateReadiness(userId) {
    const userContext = await userDataTool.getUserContext(userId);
    if (!userContext || !userContext.profile) {
      return { readinessScore: 50, breakdown: {}, guidance: 'Complete your profile setup.' };
    }

    const { profile, targetExam } = userContext;
    const syllabusStatus = await syllabusTool.getUserSyllabusStatus(userId, profile.target_exam_id);
    const perfSummary = await performanceTool.getUserPerformanceSummary(userId);
    const revisions = await revisionTool.getUpcomingRevisions(userId);

    // Component weights
    // 1. Syllabus Completion (35% weight)
    const syllabusScore = (syllabusStatus.completionRate || 0) * 0.35;

    // 2. Mock Test Accuracy (35% weight)
    const accuracyScore = (perfSummary.averageAccuracy > 0 ? perfSummary.averageAccuracy : 50) * 0.35;

    // 3. Mistake Hygiene & Revision Discipline (30% weight)
    const urgentRevisionsCount = revisions.filter(r => r.priority === 'urgent').length;
    let hygiene = 85;
    if (urgentRevisionsCount > 2) hygiene -= 25;
    else if (urgentRevisionsCount > 0) hygiene -= 10;
    if (perfSummary.mistakes.length > 5) hygiene -= 15;
    const revisionScore = Math.max(20, hygiene) * 0.30;

    const totalReadiness = Math.min(99, Math.round(syllabusScore + accuracyScore + revisionScore));

    let readinessBand = 'Developing Stage';
    if (totalReadiness >= 75) readinessBand = 'Exam Ready / High Confidence';
    else if (totalReadiness >= 55) readinessBand = 'Intermediate / Moderate Confidence';

    return {
      readinessScore: totalReadiness,
      readinessBand,
      examName: targetExam ? targetExam.name : 'Target Exam',
      breakdown: {
        syllabusContribution: Math.round(syllabusScore),
        accuracyContribution: Math.round(accuracyScore),
        revisionContribution: Math.round(revisionScore)
      },
      metrics: {
        syllabusCompletionRate: syllabusStatus.completionRate,
        averageMockAccuracy: perfSummary.averageAccuracy,
        activeMistakesCount: perfSummary.mistakes.length,
        urgentRevisionsPending: urgentRevisionsCount
      },
      readinessAdvice: totalReadiness >= 75
        ? 'You are in a prime position. Maintain test rhythm and prioritize high-yield revisions.'
        : 'Focus on eliminating high-frequency mistake topics to rapidly elevate your readiness score by 15-20 points.'
    };
  }
};

module.exports = examReadinessAgent;
