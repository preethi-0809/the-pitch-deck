const db = require('../config/database');

const adminController = {
  async getStats(req, res, next) {
    try {
      const userCount = db.get('SELECT COUNT(*) as c FROM users WHERE role = "user"').c;
      const examCount = db.get('SELECT COUNT(*) as c FROM exams').c;
      const questionCount = db.get('SELECT COUNT(*) as c FROM questions').c;
      const attemptCount = db.get('SELECT COUNT(*) as c FROM test_attempts').c;
      const currentAffairsCount = db.get('SELECT COUNT(*) as c FROM current_affairs').c;
      const materialsCount = db.get('SELECT COUNT(*) as c FROM study_materials').c;

      res.json({
        success: true,
        stats: {
          users: userCount,
          exams: examCount,
          questions: questionCount,
          attempts: attemptCount,
          currentAffairs: currentAffairsCount,
          studyMaterials: materialsCount
        }
      });
    } catch (err) {
      next(err);
    }
  },

  async getAllUsers(req, res, next) {
    try {
      const users = db.query(`
        SELECT u.id, u.name, u.email, u.role, u.preferred_language, u.created_at,
               up.user_type, up.target_exam_id, up.preparation_level, up.daily_hours_weekday
        FROM users u
        LEFT JOIN user_profiles up ON u.id = up.user_id
        ORDER BY u.created_at DESC
      `);
      res.json({ success: true, users });
    } catch (err) {
      next(err);
    }
  },

  async createQuestion(req, res, next) {
    try {
      const q = req.body;
      const qId = `q_admin_${Date.now()}`;
      db.transaction(() => {
        db.run(`
          INSERT INTO questions (id, topic_id, exam_id, question_text, question_type, difficulty_level, explanation, tamil_text, tamil_explanation, is_pyq, pyq_year, pyq_source, created_by)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'admin')
        `, [
          qId, q.topic_id, q.exam_id, q.question_text, q.question_type || 'mcq',
          q.difficulty_level || 'medium', q.explanation, q.tamil_text || '',
          q.tamil_explanation || '', q.is_pyq ? 1 : 0, q.pyq_year || null, q.pyq_source || ''
        ]);

        if (q.options && Array.isArray(q.options)) {
          for (const opt of q.options) {
            db.run(`
              INSERT INTO question_options (id, question_id, option_key, option_text, is_correct)
              VALUES (?, ?, ?, ?, ?)
            `, [`opt_${qId}_${opt.option_key}`, qId, opt.option_key, opt.option_text, opt.is_correct ? 1 : 0]);
          }
        }
      });

      res.status(201).json({ success: true, message: 'Question created successfully', questionId: qId });
    } catch (err) {
      next(err);
    }
  }
};

module.exports = adminController;
