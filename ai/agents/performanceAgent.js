const db = require('../../backend/src/config/database');
const performanceTool = require('../tools/performanceTool');

const performanceAgent = {
  name: 'PerformanceAgent',
  description: 'Deep performance analytics, speed-to-accuracy ratio computation, and high-impact diagnostic recommendations.',

  async analyzeAttempt(attemptId) {
    const attempt = db.get(`
      SELECT ta.*, t.title as test_title, t.test_type, t.exam_id, e.name as exam_name
      FROM test_attempts ta
      JOIN tests t ON ta.test_id = t.id
      JOIN exams e ON t.exam_id = e.id
      WHERE ta.id = ?
    `, [attemptId]);

    if (!attempt) return null;

    const answers = db.query(`
      SELECT ans.*, q.question_text, q.difficulty_level, q.explanation, t.name as topic_name, s.name as subject_name
      FROM test_answers ans
      JOIN questions q ON ans.question_id = q.id
      JOIN topics t ON q.topic_id = t.id
      JOIN subjects s ON t.subject_id = s.id
      WHERE ans.attempt_id = ?
    `, [attemptId]);

    // Subject-wise performance breakdown
    const subjectMap = {};
    const topicMap = {};
    let totalHardCorrect = 0;
    let totalHardCount = 0;

    answers.forEach(a => {
      // Subject grouping
      if (!subjectMap[a.subject_name]) {
        subjectMap[a.subject_name] = { total: 0, correct: 0, totalTime: 0 };
      }
      subjectMap[a.subject_name].total++;
      if (a.is_correct) subjectMap[a.subject_name].correct++;
      subjectMap[a.subject_name].totalTime += a.time_spent_seconds;

      // Topic grouping
      if (!topicMap[a.topic_name]) {
        topicMap[a.topic_name] = { total: 0, correct: 0, incorrect: 0 };
      }
      topicMap[a.topic_name].total++;
      if (a.is_correct) topicMap[a.topic_name].correct++;
      else topicMap[a.topic_name].incorrect++;

      if (a.difficulty_level === 'hard') {
        totalHardCount++;
        if (a.is_correct) totalHardCorrect++;
      }
    });

    const subjectBreakdown = Object.keys(subjectMap).map(subj => {
      const data = subjectMap[subj];
      return {
        subject: subj,
        totalQuestions: data.total,
        correct: data.correct,
        accuracy: Math.round((data.correct / data.total) * 100),
        avgTimePerQuestion: Math.round(data.totalTime / data.total)
      };
    });

    const topicBreakdown = Object.keys(topicMap).map(topic => {
      const data = topicMap[topic];
      return {
        topic,
        total: data.total,
        correct: data.correct,
        incorrect: data.incorrect,
        accuracy: Math.round((data.correct / data.total) * 100)
      };
    });

    // Compute actionable diagnostic insight
    let primaryRecommendation = '';
    const lowAccuracySubject = subjectBreakdown.find(s => s.accuracy < 50);
    const slowPacedSubject = subjectBreakdown.find(s => s.avgTimePerQuestion > 90);

    if (attempt.accuracy >= 75) {
      primaryRecommendation = `Outstanding performance with ${attempt.accuracy}% accuracy. To push for top percentiles, focus on speed optimization in Hard-difficulty questions.`;
    } else if (slowPacedSubject && slowPacedSubject.avgTimePerQuestion > 90) {
      primaryRecommendation = `Your score is ${attempt.percentage}%, but your bottleneck is pacing. You spent an average of ${slowPacedSubject.avgTimePerQuestion}s on ${slowPacedSubject.subject} questions. Practice timed elimination drills.`;
    } else if (lowAccuracySubject) {
      primaryRecommendation = `Your biggest scoring leak is in ${lowAccuracySubject.subject} (${lowAccuracySubject.accuracy}% accuracy). Revisit core notes and schedule a targeted revision before your next mock.`;
    } else {
      primaryRecommendation = `Balanced attempt with ${attempt.accuracy}% overall accuracy. Strengthen your weak topic clusters to eliminate careless errors.`;
    }

    return {
      attempt,
      answers,
      subjectBreakdown,
      topicBreakdown,
      hardQuestionAccuracy: totalHardCount > 0 ? Math.round((totalHardCorrect / totalHardCount) * 100) : 0,
      primaryRecommendation
    };
  }
};

module.exports = performanceAgent;
