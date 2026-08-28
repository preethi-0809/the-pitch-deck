const db = require('../../backend/src/config/database');

const revisionTool = {
  name: 'revisionTool',
  description: 'Manages spaced repetition schedules, mistake-triggered revisions, and interval promotions',

  async getUpcomingRevisions(userId, dateStr = null) {
    const targetDate = dateStr || new Date().toISOString().split('T')[0];
    let revisions = db.query(`
      SELECT rs.*, 
             COALESCE(t.name, sh.topic, 'High-Yield Core Module') as topic_name, 
             COALESCE(s.name, sh.subject, 'General Studies') as subject_name, 
             COALESCE(s.code, 'GS') as subject_code
      FROM revision_schedules rs
      LEFT JOIN topics t ON rs.topic_id = t.id
      LEFT JOIN subjects s ON t.subject_id = s.id
      LEFT JOIN syllabus_hierarchy sh ON rs.topic_id = sh.id
      WHERE rs.user_id = ? AND rs.status = 'pending'
      ORDER BY 
        CASE rs.priority WHEN 'urgent' THEN 1 WHEN 'high' THEN 2 ELSE 3 END,
        rs.scheduled_date ASC
    `, [userId]);

    // If queue is empty, auto-seed 4 high-yield smart revision items so the user is never greeted with a blank screen
    if (revisions.length === 0 && userId) {
      const highYieldTopics = db.query(`
        SELECT id, topic as name, subject, exam_id
        FROM syllabus_hierarchy
        ORDER BY pyq_weightage DESC, display_order ASC
        LIMIT 4
      `);

      const reasons = ['initial_diagnostic', 'high_weightage_pyq', 'weakness_reinforcement', 'spaced_interval_boost'];
      const priorities = ['urgent', 'high', 'normal', 'normal'];
      const stages = [1, 2, 1, 3];

      for (let i = 0; i < highYieldTopics.length; i++) {
        const top = highYieldTopics[i];
        await this.scheduleRevision(userId, top.id, reasons[i % reasons.length], priorities[i % priorities.length], stages[i % stages.length]);
      }

      revisions = db.query(`
        SELECT rs.*, 
               COALESCE(t.name, sh.topic, 'High-Yield Core Module') as topic_name, 
               COALESCE(s.name, sh.subject, 'General Studies') as subject_name, 
               COALESCE(s.code, 'GS') as subject_code
        FROM revision_schedules rs
        LEFT JOIN topics t ON rs.topic_id = t.id
        LEFT JOIN subjects s ON t.subject_id = s.id
        LEFT JOIN syllabus_hierarchy sh ON rs.topic_id = sh.id
        WHERE rs.user_id = ? AND rs.status = 'pending'
        ORDER BY 
          CASE rs.priority WHEN 'urgent' THEN 1 WHEN 'high' THEN 2 ELSE 3 END,
          rs.scheduled_date ASC
      `, [userId]);
    }

    return revisions;
  },

  async scheduleRevision(userId, topicId, reason = 'spaced_repetition', priority = 'normal', stage = 1) {
    const today = new Date();
    const intervalDays = [0, 1, 3, 7, 21, 60];
    const daysToAdd = intervalDays[stage] || 3;
    const scheduledDate = new Date(today.getTime() + daysToAdd * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    // Ensure topic exists in topics table to satisfy foreign key constraint
    let existingTopic = db.get('SELECT id FROM topics WHERE id = ?', [topicId]);
    if (!existingTopic) {
      const sh = db.get('SELECT * FROM syllabus_hierarchy WHERE id = ?', [topicId]);
      let subjectId = 'sub_gs_core';
      const existingSub = db.get('SELECT id FROM subjects WHERE name = ? LIMIT 1', [sh?.subject || 'General Studies']);
      if (existingSub) {
        subjectId = existingSub.id;
      } else {
        const subRow = db.get('SELECT id FROM subjects LIMIT 1');
        if (subRow) subjectId = subRow.id;
      }

      try {
        db.run(`
          INSERT OR IGNORE INTO topics (id, subject_id, name, code, description, difficulty_level, pyq_importance_score, estimated_hours, display_order)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          topicId,
          subjectId,
          sh?.topic || 'High-Yield Revision Module',
          'REV_' + topicId.substring(0, 10).toUpperCase(),
          sh?.description || 'Curated high-yield revision topic',
          'medium',
          sh?.pyq_weightage || 9.0,
          2.0,
          sh?.display_order || 1
        ]);
      } catch (e) {
        // ignore
      }
    }

    const revId = `rev_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    db.run(`
      INSERT INTO revision_schedules (
        id, user_id, topic_id, revision_interval_stage, scheduled_date, status, priority, reason
      ) VALUES (?, ?, ?, ?, ?, 'pending', ?, ?)
    `, [revId, userId, topicId, stage, scheduledDate, priority, reason]);

    return { id: revId, topic_id: topicId, scheduled_date: scheduledDate, priority, reason };
  },

  async completeRevision(revisionId) {
    const rev = db.get('SELECT * FROM revision_schedules WHERE id = ?', [revisionId]);
    if (!rev) return null;

    db.run(`
      UPDATE revision_schedules
      SET status = 'completed', completed_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [revisionId]);

    // Schedule next spaced repetition stage if not at max stage
    if (rev.revision_interval_stage < 5) {
      await this.scheduleRevision(
        rev.user_id,
        rev.topic_id,
        'spaced_repetition',
        'normal',
        rev.revision_interval_stage + 1
      );
    }

    return true;
  }
};

module.exports = revisionTool;
