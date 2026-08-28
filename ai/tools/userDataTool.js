const db = require('../../backend/src/config/database');

const userDataTool = {
  name: 'userDataTool',
  description: 'Fetches user profile, preparation constraints, target exam, and learning style',

  async getUserContext(userId) {
    const user = db.get('SELECT id, name, email, preferred_language, role FROM users WHERE id = ?', [userId]);
    if (!user) return null;

    const profile = db.get('SELECT * FROM user_profiles WHERE user_id = ?', [userId]);
    let targetExam = null;
    if (profile && profile.target_exam_id) {
      targetExam = db.get('SELECT * FROM exams WHERE id = ?', [profile.target_exam_id]);
    }

    return {
      ...user,
      profile: profile ? {
        ...profile,
        strong_subjects: profile.strong_subjects ? JSON.parse(profile.strong_subjects) : [],
        weak_subjects: profile.weak_subjects ? JSON.parse(profile.weak_subjects) : []
      } : null,
      targetExam
    };
  },

  async updateProfile(userId, profileData) {
    if (profileData.name || profileData.preferred_language) {
      db.run(`
        UPDATE users SET
          name = COALESCE(?, name),
          preferred_language = COALESCE(?, preferred_language),
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `, [profileData.name, profileData.preferred_language, userId]);
    }

    const existing = db.get('SELECT id FROM user_profiles WHERE user_id = ?', [userId]);
    if (existing) {
      db.run(`
        UPDATE user_profiles SET
          user_type = COALESCE(?, user_type),
          target_exam_id = COALESCE(?, target_exam_id),
          exam_date = COALESCE(?, exam_date),
          preparation_level = COALESCE(?, preparation_level),
          daily_hours_weekday = COALESCE(?, daily_hours_weekday),
          daily_hours_weekend = COALESCE(?, daily_hours_weekend),
          preferred_study_timings = COALESCE(?, preferred_study_timings),
          learning_style = COALESCE(?, learning_style),
          strong_subjects = COALESCE(?, strong_subjects),
          weak_subjects = COALESCE(?, weak_subjects),
          state = COALESCE(?, state),
          updated_at = CURRENT_TIMESTAMP
        WHERE user_id = ?
      `, [
        profileData.user_type,
        profileData.target_exam_id,
        profileData.exam_date,
        profileData.preparation_level,
        profileData.daily_hours_weekday,
        profileData.daily_hours_weekend,
        profileData.preferred_study_timings,
        profileData.learning_style,
        profileData.strong_subjects ? JSON.stringify(profileData.strong_subjects) : null,
        profileData.weak_subjects ? JSON.stringify(profileData.weak_subjects) : null,
        profileData.state,
        userId
      ]);
    }
    return this.getUserContext(userId);
  }
};

module.exports = userDataTool;
