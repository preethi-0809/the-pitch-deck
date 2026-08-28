const db = require('../../backend/src/config/database');
const questionTool = require('../tools/questionTool');

const adaptiveTestAgent = {
  name: 'AdaptiveTestAgent',
  description: 'Conducts real-time adaptive testing, adjusting question difficulty on the fly and isolating concept gaps.',

  async getNextAdaptiveQuestion({ examId, topicId = null, currentDifficulty = 'medium', history = [] }) {
    // Determine performance on recent 2 questions
    const recentHistory = history.slice(-2);
    let nextDifficulty = currentDifficulty;

    if (recentHistory.length >= 2) {
      const correctCount = recentHistory.filter(h => h.isCorrect).length;
      if (correctCount === 2) {
        // Upgrade difficulty
        if (currentDifficulty === 'easy') nextDifficulty = 'medium';
        else if (currentDifficulty === 'medium') nextDifficulty = 'hard';
      } else if (correctCount === 0) {
        // Step down difficulty to verify concept roots
        if (currentDifficulty === 'hard') nextDifficulty = 'medium';
        else if (currentDifficulty === 'medium') nextDifficulty = 'easy';
      }
    }

    // Exclude previously attempted question IDs
    const attemptedIds = history.map(h => h.questionId).filter(Boolean);
    
    let candidateQuestions = [];
    if (topicId) {
      candidateQuestions = await questionTool.getQuestionsByTopic(topicId, nextDifficulty, 10);
    } else {
      candidateQuestions = await questionTool.getQuestionsByExam(examId, null, 15);
    }

    // Filter out already attempted questions
    const unattempted = candidateQuestions.filter(q => !attemptedIds.includes(q.id));

    if (unattempted.length > 0) {
      const selected = unattempted[0];
      return {
        question: selected,
        currentDifficulty: nextDifficulty,
        conceptGapDetected: nextDifficulty === 'easy' && currentDifficulty === 'medium',
        diagnosticNote: nextDifficulty === 'hard'
          ? 'Difficulty stepped up to Hard: Excellent mastery demonstrated on preceding questions.'
          : (nextDifficulty === 'easy' ? 'Adjusted to Foundational level to test core conceptual clarity.' : 'Balanced Standard Difficulty.')
      };
    }

    // Fallback: Pick any unattempted question
    const fallback = candidateQuestions.find(q => !attemptedIds.includes(q.id)) || candidateQuestions[0];
    return {
      question: fallback,
      currentDifficulty: nextDifficulty,
      conceptGapDetected: false,
      diagnosticNote: 'Standard Adaptive Question Progression.'
    };
  }
};

module.exports = adaptiveTestAgent;
