const db = require('../../backend/src/config/database');

const performanceTool = {
  name: 'performanceTool',
  description: 'Calculates test metrics, speed analytics, mistake distributions, and weak topic clusters',

  async getUserPerformanceSummary(userId) {
    const attempts = db.query(`
      SELECT ta.*, t.title as test_title, t.test_type, t.exam_id
      FROM test_attempts ta
      JOIN tests t ON ta.test_id = t.id
      WHERE ta.user_id = ?
      ORDER BY ta.completed_at DESC
    `, [userId]);

    const mistakes = db.query(`
      SELECT um.*, t.name as topic_name, s.name as subject_name
      FROM user_mistakes um
      JOIN topics t ON um.topic_id = t.id
      JOIN subjects s ON t.subject_id = s.id
      WHERE um.user_id = ? AND um.status = 'active'
      ORDER BY um.frequency_count DESC
    `, [userId]);

    const totalTests = attempts.length;
    let totalScore = 0;
    let totalPossible = 0;
    let totalQuestions = 0;
    let totalCorrect = 0;
    let totalTime = 0;

    attempts.forEach(a => {
      totalScore += a.score;
      totalPossible += a.total_marks;
      totalQuestions += a.total_questions;
      totalCorrect += a.correct_count;
      totalTime += a.time_taken_seconds;
    });

    const averageAccuracy = totalQuestions > 0 ? ((totalCorrect / totalQuestions) * 100).toFixed(1) : 0;
    const averageScorePct = totalPossible > 0 ? ((totalScore / totalPossible) * 100).toFixed(1) : 0;
    const avgSpeedPerQuestion = totalQuestions > 0 ? (totalTime / totalQuestions).toFixed(1) : 0;

    // Mistake taxonomy count
    const mistakeTaxonomy = {
      concept_gap: 0,
      memory_issue: 0,
      confusion: 0,
      misreading: 0,
      careless: 0,
      guessing: 0,
      time_management: 0
    };

    mistakes.forEach(m => {
      if (mistakeTaxonomy[m.mistake_type] !== undefined) {
        mistakeTaxonomy[m.mistake_type] += m.frequency_count || 1;
      }
    });

    return {
      totalTests,
      averageAccuracy: Number(averageAccuracy),
      averageScorePct: Number(averageScorePct),
      avgSpeedPerQuestion: Number(avgSpeedPerQuestion),
      attempts: attempts.slice(0, 5),
      mistakes,
      mistakeTaxonomy
    };
  },

  async recordTestAttempt(userId, testId, resultData, answers) {
    const attemptId = `att_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    
    db.transaction(() => {
      db.run(`
        INSERT INTO test_attempts (
          id, user_id, test_id, score, total_marks, percentage, total_questions,
          attempted_count, correct_count, incorrect_count, unanswered_count,
          accuracy, time_taken_seconds
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        attemptId,
        userId,
        testId,
        resultData.score,
        resultData.total_marks,
        resultData.percentage,
        resultData.total_questions,
        resultData.attempted_count,
        resultData.correct_count,
        resultData.incorrect_count,
        resultData.unanswered_count,
        resultData.accuracy,
        resultData.time_taken_seconds
      ]);

      // Record answers and mistakes
      for (const ans of answers) {
        const answerId = `ans_${attemptId}_${ans.question_id}`;
        db.run(`
          INSERT INTO test_answers (
            id, attempt_id, question_id, selected_option_key, is_correct,
            time_spent_seconds, mistake_tag
          ) VALUES (?, ?, ?, ?, ?, ?, ?)
        `, [
          answerId,
          attemptId,
          ans.question_id,
          ans.selected_option_key || null,
          ans.is_correct ? 1 : 0,
          ans.time_spent_seconds || 0,
          ans.mistake_tag || null
        ]);

        // If incorrect, record in user_mistakes
        if (!ans.is_correct && ans.selected_option_key) {
          const q = db.get('SELECT topic_id FROM questions WHERE id = ?', [ans.question_id]);
          if (q) {
            const existingMistake = db.get('SELECT id, frequency_count FROM user_mistakes WHERE user_id = ? AND topic_id = ?', [userId, q.topic_id]);
            if (existingMistake) {
              db.run(`
                UPDATE user_mistakes SET
                  frequency_count = frequency_count + 1,
                  mistake_type = COALESCE(?, mistake_type),
                  last_occurred_at = CURRENT_TIMESTAMP,
                  status = 'active'
                WHERE id = ?
              `, [ans.mistake_tag || 'concept_gap', existingMistake.id]);
            } else {
              db.run(`
                INSERT INTO user_mistakes (
                  id, user_id, topic_id, question_id, mistake_type, notes, frequency_count, status
                ) VALUES (?, ?, ?, ?, ?, ?, 1, 'active')
              `, [
                `mst_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
                userId,
                q.topic_id,
                ans.question_id,
                ans.mistake_tag || 'concept_gap',
                'Recorded during mock test'
              ]);
            }
          }
        }
      }
    });

    return attemptId;
  }
};

module.exports = performanceTool;
