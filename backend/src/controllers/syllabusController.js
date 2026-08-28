const syllabusService = require('../services/syllabusService');

const syllabusController = {
  async getExamsForSyllabus(req, res, next) {
    try {
      const { category, search } = req.query;
      const userId = req.user ? req.user.id : null;
      const exams = await syllabusService.getExamsForSyllabus({ category, search, userId });
      res.json({ success: true, count: exams.length, data: exams });
    } catch (err) {
      next(err);
    }
  },

  async getExamSyllabusHierarchy(req, res, next) {
    try {
      const { examId } = req.params;
      const userId = req.user ? req.user.id : null;
      const hierarchy = await syllabusService.getExamSyllabusHierarchy(examId, userId);
      res.json({ success: true, data: hierarchy });
    } catch (err) {
      next(err);
    }
  },

  async getTopicDetailedNotes(req, res, next) {
    try {
      const { topicId } = req.params;
      const { examId } = req.query;
      const userId = req.user ? req.user.id : null;
      const notes = await syllabusService.getTopicDetailedNotes(topicId, examId, userId);
      res.json({ success: true, data: notes });
    } catch (err) {
      next(err);
    }
  },

  async updateTopicProgress(req, res, next) {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'Authentication required' });
      }
      const { examId, topicId, status, completion_percentage, notes_bookmarked } = req.body;
      const userId = req.user.id;
      const result = await syllabusService.updateTopicProgress(userId, examId, topicId, {
        status,
        completion_percentage,
        notes_bookmarked
      });
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  },

  async getNotesLibrary(req, res, next) {
    try {
      const { examId, subject, search, bookmarkedOnly } = req.query;
      const userId = req.user ? req.user.id : null;
      const notes = await syllabusService.getNotesLibrary(userId, { examId, subject, search, bookmarkedOnly });
      res.json({ success: true, count: notes.length, data: notes });
    } catch (err) {
      next(err);
    }
  }
};

module.exports = syllabusController;
