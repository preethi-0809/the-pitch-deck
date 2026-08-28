const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database');
const emailService = require('./emailService');

const JWT_SECRET = process.env.JWT_SECRET || 'super_secure_exam_ai_jwt_secret_key_2026_change_in_production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

const authService = {
  async register({ name, email, password, profileData = {} }) {
    const existing = db.get('SELECT id FROM users WHERE email = ?', [email.toLowerCase().trim()]);
    if (existing) {
      const err = new Error('An account with this email already exists.');
      err.statusCode = 400;
      throw err;
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);
    const userId = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const profileId = `prof_${userId}`;

    db.transaction(() => {
      db.run(`
        INSERT INTO users (id, name, email, password_hash, role, preferred_language)
        VALUES (?, ?, ?, ?, 'user', ?)
      `, [userId, name, email.toLowerCase().trim(), password_hash, profileData.preferred_language || 'en']);

      db.run(`
        INSERT INTO user_profiles (
          id, user_id, user_type, target_exam_id, exam_date, preparation_level,
          previous_attempts, daily_hours_weekday, daily_hours_weekend,
          preferred_study_timings, learning_style, strong_subjects, weak_subjects,
          current_syllabus_completion
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        profileId,
        userId,
        profileData.user_type || 'student',
        profileData.target_exam_id || 'exam_upsc_cse',
        profileData.exam_date || null,
        profileData.preparation_level || 'beginner',
        profileData.previous_attempts || 0,
        profileData.daily_hours_weekday || 2.0,
        profileData.daily_hours_weekend || 4.0,
        profileData.preferred_study_timings || 'morning,evening',
        profileData.learning_style || 'visual_practical',
        JSON.stringify(profileData.strong_subjects || []),
        JSON.stringify(profileData.weak_subjects || []),
        profileData.current_syllabus_completion || 0
      ]);

      // Initialize default email preferences
      db.run(`
        INSERT INTO email_preferences (
          id, user_id, daily_study_plan_email, study_reminder_email,
          revision_reminder_email, upcoming_test_email, missed_session_email,
          current_affairs_digest_email, ai_recommendation_email, preferred_email_time
        ) VALUES (?, ?, 1, 1, 1, 1, 1, 1, 1, '07:00')
      `, [`pref_${userId}`, userId]);

      // Initialize notification preferences with user's genuine email
      const userState = profileData.state || 'Tamil Nadu';
      db.run(`
        INSERT INTO user_notification_preferences (
          id, user_id, email, exam_notifications, deadline_notifications, exam_date_notifications,
          admit_card_notifications, result_notifications, current_affairs_notifications,
          recommendation_notifications, preferred_state, created_at, updated_at
        ) VALUES (?, ?, ?, 1, 1, 1, 1, 1, 1, 1, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      `, [`unp_${userId}`, userId, email.toLowerCase().trim(), userState]);
    });

    const token = jwt.sign({ id: userId, email, role: 'user' }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    const user = await this.getCurrentUser(userId);

    // Asynchronously dispatch welcome & onboarding email
    emailService.sendWelcomeNotification({
      user,
      targetExam: user?.targetExam,
      language: user?.preferred_language || 'en'
    }).catch(err => console.warn('⚠️ [Auth Welcome Email]:', err.message));

    return { token, user };
  },

  async login(email, password) {
    const user = db.get('SELECT * FROM users WHERE email = ?', [email.toLowerCase().trim()]);
    if (!user) {
      const err = new Error('Invalid email or password credentials.');
      err.statusCode = 401;
      throw err;
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      const err = new Error('Invalid email or password credentials.');
      err.statusCode = 401;
      throw err;
    }

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    const fullUser = await this.getCurrentUser(user.id);

    // Asynchronously dispatch sign-in notification email
    emailService.sendLoginNotification({
      user: fullUser,
      targetExam: fullUser?.targetExam,
      loginTime: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
    }).catch(err => console.warn('⚠️ [Auth Login Email]:', err.message));

    return { token, user: fullUser };
  },

  async getCurrentUser(userId) {
    const user = db.get('SELECT id, name, email, role, preferred_language, is_active, created_at FROM users WHERE id = ?', [userId]);
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
  }
};

module.exports = authService;
