const revisionService = require('../services/revisionService');

const revisionController = {
  async getRevisions(req, res, next) {
    try {
      const data = await revisionService.getRevisionQueue(req.user.id);
      res.json({ success: true, ...data });
    } catch (err) {
      next(err);
    }
  },

  async completeRevision(req, res, next) {
    try {
      const { revisionId } = req.params;
      await revisionService.completeRevision(revisionId);
      const data = await revisionService.getRevisionQueue(req.user.id);
      res.json({ success: true, message: 'Revision task completed!', ...data });
    } catch (err) {
      next(err);
    }
  },

  async generateRevisions(req, res, next) {
    try {
      const { examId, count = 4 } = req.body;
      const data = await revisionService.generateSpacedRevisions(req.user.id, examId, count);
      res.json({ success: true, message: 'New spaced revision deck generated!', ...data });
    } catch (err) {
      next(err);
    }
  },

  async rateFlashcard(req, res, next) {
    try {
      const { flashcardId, rating } = req.body; // 'hard' (1 day), 'good' (3 days), 'easy' (7 days)
      const data = await revisionService.recordFlashcardRating(req.user.id, flashcardId, rating);
      res.json({ success: true, message: 'Flashcard mastery recorded!', ...data });
    } catch (err) {
      next(err);
    }
  }
};

module.exports = revisionController;
