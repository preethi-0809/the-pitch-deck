const db = require('../../backend/src/config/database');

const questionTool = {
  name: 'questionTool',
  description: 'Retrieves, generates and checks practice questions, PYQs, and adaptive test questions',

  async getQuestionsByTopic(topicId, difficulty = null, limit = 10) {
    let sql = 'SELECT * FROM questions WHERE topic_id = ?';
    const params = [topicId];
    if (difficulty) {
      sql += ' AND difficulty_level = ?';
      params.push(difficulty);
    }
    sql += ' LIMIT ?';
    params.push(limit);

    const questions = db.query(sql, params);
    return questions.map(q => {
      const options = db.query('SELECT * FROM question_options WHERE question_id = ? ORDER BY option_key ASC', [q.id]);
      return { ...q, options };
    });
  },

  async getQuestionsByExam(examId, isPyq = null, limit = 20) {
    let sql = 'SELECT * FROM questions WHERE exam_id = ?';
    const params = [examId];
    if (isPyq !== null) {
      sql += ' AND is_pyq = ?';
      params.push(isPyq ? 1 : 0);
    }
    sql += ' ORDER BY RANDOM() LIMIT ?';
    params.push(limit);

    const questions = db.query(sql, params);
    return questions.map(q => {
      const options = db.query('SELECT * FROM question_options WHERE question_id = ? ORDER BY option_key ASC', [q.id]);
      return { ...q, options };
    });
  },

  async insertGeneratedQuestion(questionData) {
    const questionId = questionData.id || `gen_q_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    db.run(`
      INSERT INTO questions (
        id, topic_id, exam_id, question_text, question_type, difficulty_level,
        explanation, tamil_text, tamil_explanation, is_pyq, pyq_year, pyq_source, created_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'ai_generated')
    `, [
      questionId,
      questionData.topic_id,
      questionData.exam_id,
      questionData.question_text,
      questionData.question_type || 'mcq',
      questionData.difficulty_level || 'medium',
      questionData.explanation,
      questionData.tamil_text || '',
      questionData.tamil_explanation || '',
      questionData.is_pyq ? 1 : 0,
      questionData.pyq_year || null,
      questionData.pyq_source || ''
    ]);

    if (questionData.options && Array.isArray(questionData.options)) {
      for (const opt of questionData.options) {
        db.run(`
          INSERT INTO question_options (id, question_id, option_key, option_text, tamil_option_text, is_correct)
          VALUES (?, ?, ?, ?, ?, ?)
        `, [
          `opt_${questionId}_${opt.option_key}`,
          questionId,
          opt.option_key,
          opt.option_text,
          opt.tamil_option_text || '',
          opt.is_correct ? 1 : 0
        ]);
      }
    }

    return { id: questionId, ...questionData };
  }
};

module.exports = questionTool;
