const db = require('../../backend/src/config/database');
const syllabusTool = require('../tools/syllabusTool');

const syllabusTrackingAgent = {
  name: 'SyllabusTrackingAgent',
  description: 'Tracks topic-by-topic syllabus completion, study time allocation, and topic mastery score.',

  async getTrackedSyllabus(userId, examId) {
    const status = await syllabusTool.getUserSyllabusStatus(userId, examId);
    return status;
  },

  async updateTopicMastery(userId, topicId, status = 'completed', hoursSpent = 1.0, masteryDelta = 20) {
    const existing = db.get('SELECT * FROM user_syllabus_progress WHERE user_id = ? AND topic_id = ?', [userId, topicId]);
    if (existing) {
      const newMastery = Math.min(100, (existing.mastery_percentage || 0) + masteryDelta);
      const newHours = (existing.hours_spent || 0) + hoursSpent;
      db.run(`
        UPDATE user_syllabus_progress SET
          status = ?,
          mastery_percentage = ?,
          hours_spent = ?,
          last_studied_at = CURRENT_TIMESTAMP,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `, [status, newMastery, newHours, existing.id]);
    } else {
      const id = `prog_${userId}_${topicId}`;
      db.run(`
        INSERT INTO user_syllabus_progress (id, user_id, topic_id, status, mastery_percentage, hours_spent, last_studied_at)
        VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
      `, [id, userId, topicId, status, masteryDelta, hoursSpent]);
    }

    return true;
  }
};

module.exports = syllabusTrackingAgent;
