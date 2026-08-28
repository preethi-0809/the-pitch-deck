const db = require('../config/database');
const performanceTool = require('../../../ai/tools/performanceTool');
const agentOrchestrator = require('../../../ai/orchestration/agentOrchestrator');

const testService = {
  async getTestsForExam(examId) {
    let sql = 'SELECT * FROM tests WHERE is_active = 1';
    const params = [];
    if (examId) {
      sql += ' AND exam_id = ?';
      params.push(examId);
    }
    sql += ' ORDER BY created_at DESC';
    return db.query(sql, params);
  },

  async getTestDetails(testId) {
    const test = db.get('SELECT * FROM tests WHERE id = ?', [testId]);
    if (!test) throw new Error('Test not found');

    const testQuestions = db.query(`
      SELECT tq.marks, tq.negative_marks, tq.display_order,
             q.id as question_id, q.topic_id, q.exam_id, q.question_text,
             q.question_type, q.difficulty_level, q.explanation, q.tamil_text,
             q.tamil_explanation, q.is_pyq, q.pyq_year, q.pyq_source,
             t.name as topic_name, s.name as subject_name
      FROM test_questions tq
      JOIN questions q ON tq.question_id = q.id
      JOIN topics t ON q.topic_id = t.id
      JOIN subjects s ON t.subject_id = s.id
      WHERE tq.test_id = ?
      ORDER BY tq.display_order ASC
    `, [testId]);

    // Attach options for each question
    const fullQuestions = testQuestions.map(tq => {
      const options = db.query('SELECT id, question_id, option_key, option_text, tamil_option_text FROM question_options WHERE question_id = ? ORDER BY option_key ASC', [tq.question_id]);
      return {
        ...tq,
        options
      };
    });

    return { ...test, questions: fullQuestions };
  },

  async submitTest(userId, testId, answers, timeTakenSeconds) {
    const test = db.get('SELECT * FROM tests WHERE id = ?', [testId]);
    if (!test) throw new Error('Test not found');

    // Retrieve correct options for all questions in this test
    const correctOptions = db.query(`
      SELECT qo.question_id, qo.option_key
      FROM question_options qo
      JOIN test_questions tq ON qo.question_id = tq.question_id
      WHERE tq.test_id = ? AND qo.is_correct = 1
    `, [testId]);

    const correctMap = {};
    correctOptions.forEach(co => {
      correctMap[co.question_id] = co.option_key;
    });

    let correctCount = 0;
    let incorrectCount = 0;
    let attemptedCount = 0;
    let totalScore = 0;
    const totalQuestions = answers.length;

    const evaluatedAnswers = answers.map(ans => {
      const correctKey = correctMap[ans.question_id];
      const isAttempted = Boolean(ans.selected_option_key);
      const isCorrect = isAttempted && ans.selected_option_key === correctKey;

      let mistakeTag = null;
      if (isAttempted) {
        attemptedCount++;
        if (isCorrect) {
          correctCount++;
          totalScore += 2.0; // +2 marks
        } else {
          incorrectCount++;
          totalScore = Math.max(0, totalScore - 0.66); // -0.66 negative mark
          // Classify mistake based on time spent
          if (ans.time_spent_seconds && ans.time_spent_seconds < 15) {
            mistakeTag = 'careless';
          } else if (ans.time_spent_seconds && ans.time_spent_seconds > 80) {
            mistakeTag = 'confusion';
          } else {
            mistakeTag = 'concept_gap';
          }
        }
      }

      return {
        ...ans,
        is_correct: isCorrect,
        correct_option_key: correctKey,
        mistake_tag: mistakeTag
      };
    });

    const unansweredCount = totalQuestions - attemptedCount;
    const accuracy = attemptedCount > 0 ? ((correctCount / attemptedCount) * 100).toFixed(1) : 0;
    const maxMarks = totalQuestions * 2.0;
    const percentage = maxMarks > 0 ? ((totalScore / maxMarks) * 100).toFixed(1) : 0;

    const resultData = {
      score: Number(totalScore.toFixed(2)),
      total_marks: maxMarks,
      percentage: Number(percentage),
      total_questions: totalQuestions,
      attempted_count: attemptedCount,
      correct_count: correctCount,
      incorrect_count: incorrectCount,
      unanswered_count: unansweredCount,
      accuracy: Number(accuracy),
      time_taken_seconds: timeTakenSeconds || 1800
    };

    // Record in DB
    const attemptId = await performanceTool.recordTestAttempt(userId, testId, resultData, evaluatedAnswers);

    // Execute Autonomous Post-Test Agentic Workflow
    const workflowResult = await agentOrchestrator.executePostTestWorkflow(attemptId, userId);

    return {
      attemptId,
      result: resultData,
      evaluatedAnswers,
      postTestWorkflow: workflowResult
    };
  }
};

module.exports = testService;
