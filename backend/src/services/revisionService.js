const revisionAgent = require('../../../ai/agents/revisionAgent');
const revisionTool = require('../../../ai/tools/revisionTool');
const db = require('../config/database');

const revisionService = {
  async getRevisionQueue(userId) {
    return await revisionAgent.getRevisionQueue(userId);
  },

  async completeRevision(revisionId) {
    return await revisionAgent.completeRevisionTask(revisionId);
  },

  async generateSpacedRevisions(userId, examId, count = 4) {
    let sql = 'SELECT id, topic as name, subject FROM syllabus_hierarchy';
    let params = [];
    if (examId && examId !== 'All') {
      sql += ' WHERE exam_id = ?';
      params.push(examId);
    }
    sql += ' ORDER BY RANDOM() LIMIT ?';
    params.push(count);

    let candidates = db.query(sql, params);
    if (!candidates || candidates.length === 0) {
      candidates = db.query('SELECT id, topic as name, subject FROM syllabus_hierarchy ORDER BY pyq_weightage DESC LIMIT ?', [count]);
    }

    for (const c of candidates) {
      await revisionTool.scheduleRevision(userId, c.id, 'ai_targeted_generation', 'high', 1);
    }

    return await revisionAgent.getRevisionQueue(userId);
  },

  async recordFlashcardRating(userId, flashcardId, rating) {
    // Stage mapping based on SM-2 spaced repetition response
    const stageMap = { hard: 1, good: 2, easy: 3 };
    const stage = stageMap[rating] || 2;
    const priority = rating === 'hard' ? 'urgent' : 'normal';

    // Look for matching topic or fallback
    const highTopic = db.get('SELECT id FROM syllabus_hierarchy ORDER BY RANDOM() LIMIT 1');
    if (highTopic) {
      await revisionTool.scheduleRevision(userId, highTopic.id, `flashcard_${rating}`, priority, stage);
    }

    return await revisionAgent.getRevisionQueue(userId);
  }
};

module.exports = revisionService;
