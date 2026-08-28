const db = require('../../backend/src/config/database');

const notificationTool = {
  name: 'notificationTool',
  description: 'Manages user email preferences and notification queue logs',

  async getPreferences(userId) {
    let pref = db.get('SELECT * FROM email_preferences WHERE user_id = ?', [userId]);
    if (!pref) {
      const id = `pref_${userId}`;
      db.run(`
        INSERT INTO email_preferences (
          id, user_id, daily_study_plan_email, study_reminder_email,
          revision_reminder_email, upcoming_test_email, missed_session_email,
          current_affairs_digest_email, ai_recommendation_email, preferred_email_time
        ) VALUES (?, ?, 1, 1, 1, 1, 1, 1, 1, '07:00')
      `, [id, userId]);
      pref = db.get('SELECT * FROM email_preferences WHERE user_id = ?', [userId]);
    }
    return pref;
  },

  async updatePreferences(userId, updateData) {
    db.run(`
      UPDATE email_preferences SET
        daily_study_plan_email = COALESCE(?, daily_study_plan_email),
        study_reminder_email = COALESCE(?, study_reminder_email),
        revision_reminder_email = COALESCE(?, revision_reminder_email),
        upcoming_test_email = COALESCE(?, upcoming_test_email),
        missed_session_email = COALESCE(?, missed_session_email),
        current_affairs_digest_email = COALESCE(?, current_affairs_digest_email),
        ai_recommendation_email = COALESCE(?, ai_recommendation_email),
        preferred_email_time = COALESCE(?, preferred_email_time),
        updated_at = CURRENT_TIMESTAMP
      WHERE user_id = ?
    `, [
      updateData.daily_study_plan_email,
      updateData.study_reminder_email,
      updateData.revision_reminder_email,
      updateData.upcoming_test_email,
      updateData.missed_session_email,
      updateData.current_affairs_digest_email,
      updateData.ai_recommendation_email,
      updateData.preferred_email_time,
      userId
    ]);
    return this.getPreferences(userId);
  },

  async logEmail(userId, recipientEmail, subject, emailType, status = 'sent', errorMsg = null) {
    const id = `elog_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    db.run(`
      INSERT INTO email_logs (id, user_id, recipient_email, subject, email_type, status, error_message)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [id, userId, recipientEmail, subject, emailType, status, errorMsg]);
    return id;
  },

  async getRecentEmailLogs(userId, limit = 10) {
    return db.query('SELECT * FROM email_logs WHERE user_id = ? ORDER BY sent_at DESC LIMIT ?', [userId, limit]);
  }
};

module.exports = notificationTool;
