const db = require('../config/database');
const syllabusTool = require('../../../ai/tools/syllabusTool');

const examController = {
  async getAllExams(req, res, next) {
    try {
      const exams = db.query('SELECT * FROM exams WHERE is_active = 1 ORDER BY category, name');
      res.json({ success: true, exams });
    } catch (err) {
      next(err);
    }
  },

  async getExamSyllabus(req, res, next) {
    try {
      const { examId } = req.params;
      const syllabus = await syllabusTool.getExamSyllabus(examId);
      res.json({ success: true, syllabus });
    } catch (err) {
      next(err);
    }
  },

  async getUserSyllabusStatus(req, res, next) {
    try {
      const { examId } = req.params;
      const status = await syllabusTool.getUserSyllabusStatus(req.user.id, examId);
      res.json({ success: true, ...status });
    } catch (err) {
      next(err);
    }
  },

  async getStudyMaterials(req, res, next) {
    try {
      const { topicId, examId } = req.query;
      let sql = `
        SELECT sm.*, t.name as topic_name, s.name as subject_name, s.exam_id
        FROM study_materials sm
        JOIN topics t ON sm.topic_id = t.id
        JOIN subjects s ON t.subject_id = s.id
        WHERE 1=1
      `;
      const params = [];
      if (topicId) {
        sql += ' AND sm.topic_id = ?';
        params.push(topicId);
      }
      if (examId) {
        sql += ' AND s.exam_id = ?';
        params.push(examId);
      }
      sql += ' ORDER BY sm.created_at DESC';

      const materials = db.query(sql, params);
      res.json({ success: true, materials });
    } catch (err) {
      next(err);
    }
  }
};

module.exports = examController;
