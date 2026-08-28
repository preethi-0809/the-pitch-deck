const db = require('../config/database');
const emailService = require('./emailService');

// Helper: Get Current Date String in IST (Asia/Kolkata)
function getISTDateString(offsetDays = 0) {
  const now = new Date();
  if (offsetDays !== 0) {
    now.setDate(now.getDate() + offsetDays);
  }
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(now);
}

// Helper: Calculate difference in whole days between two YYYY-MM-DD dates in IST
function getDaysDifference(targetDateStr, baseDateStr) {
  if (!targetDateStr || !baseDateStr) return null;
  const target = new Date(targetDateStr);
  const base = new Date(baseDateStr);
  const diffTime = target.getTime() - base.getTime();
  return Math.round(diffTime / (1000 * 60 * 60 * 24));
}

const notificationEngine = {
  // 1. Get or Create User Notification Preferences
  async getUserPreferences(userId) {
    const user = db.get('SELECT id, name, email, preferred_language FROM users WHERE id = ?', [userId]);
    if (!user) throw new Error('User not found');

    let prefs = db.get('SELECT * FROM user_notification_preferences WHERE user_id = ?', [userId]);
    if (!prefs) {
      let preferredState = 'Tamil Nadu';
      try {
        const userProfile = db.get('SELECT * FROM user_profiles WHERE user_id = ?', [userId]);
        if (userProfile?.state) preferredState = userProfile.state;
      } catch (e) {}

      const id = `unp_${userId}`;
      const userLang = user.preferred_language || 'en';

      db.run(`
        INSERT INTO user_notification_preferences (
          id, user_id, email, application_open_notifications, deadline_notifications, exam_date_notifications,
          exam_day_notifications, admit_card_notifications, result_notifications, current_affairs_notifications,
          recommended_notifications, preferred_state, preferred_language, created_at, updated_at
        ) VALUES (?, ?, ?, 1, 1, 1, 1, 1, 1, 1, 1, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      `, [id, userId, user.email, preferredState, userLang]);

      prefs = db.get('SELECT * FROM user_notification_preferences WHERE user_id = ?', [userId]);
    }
    return prefs;
  },

  // 2. Update User Notification Preferences
  async updateUserPreferences(userId, updateData) {
    await this.getUserPreferences(userId); // ensure exists

    const fields = [];
    const params = [];

    const allowed = [
      'application_open_notifications',
      'deadline_notifications',
      'exam_date_notifications',
      'exam_day_notifications',
      'admit_card_notifications',
      'result_notifications',
      'recommended_notifications',
      'current_affairs_notifications',
      'preferred_state',
      'preferred_language'
    ];

    for (const key of allowed) {
      if (updateData[key] !== undefined) {
        fields.push(`${key} = ?`);
        params.push(updateData[key]);
      }
    }

    if (fields.length > 0) {
      fields.push('updated_at = CURRENT_TIMESTAMP');
      params.push(userId);
      db.run(`UPDATE user_notification_preferences SET ${fields.join(', ')} WHERE user_id = ?`, params);
    }

    return db.get('SELECT * FROM user_notification_preferences WHERE user_id = ?', [userId]);
  },

  // 3. Toggle Per-Exam Alert Subscription (e.g. TNPSC Group 4 🔔 Email Alerts: ON/OFF)
  async toggleExamAlert(userId, examId, isEnabled = null) {
    const existing = db.get('SELECT * FROM user_exam_alerts WHERE user_id = ? AND exam_id = ?', [userId, examId]);
    let newStatus = 1;

    if (existing) {
      newStatus = isEnabled !== null ? (isEnabled ? 1 : 0) : (existing.is_enabled === 1 ? 0 : 1);
      db.run('UPDATE user_exam_alerts SET is_enabled = ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ? AND exam_id = ?', [newStatus, userId, examId]);
    } else {
      newStatus = isEnabled !== null ? (isEnabled ? 1 : 0) : 1;
      const id = `uea_${userId}_${examId}`;
      db.run('INSERT INTO user_exam_alerts (id, user_id, exam_id, is_enabled) VALUES (?, ?, ?, ?)', [id, userId, examId, newStatus]);
    }

    return {
      exam_id: examId,
      is_enabled: newStatus === 1,
      message: newStatus === 1 ? 'Email alerts enabled for this exam.' : 'Email alerts muted for this exam.'
    };
  },

  // 4. Get User's Per-Exam Alert Subscriptions
  async getUserExamAlerts(userId) {
    const alerts = db.query(`
      SELECT uea.exam_id, uea.is_enabled, e.name, e.code, e.organization
      FROM user_exam_alerts uea
      JOIN exams e ON e.id = uea.exam_id
      WHERE uea.user_id = ?
    `, [userId]);

    return alerts.map(a => ({
      ...a,
      is_enabled: a.is_enabled === 1
    }));
  },

  // 5. Check if User is Interested / Eligible for an Exam
  isUserInterestedInExam(user, profile, preferences, exam, explicitAlerts) {
    // 1. Explicit per-exam subscription
    const alertSetting = explicitAlerts.find(a => a.exam_id === exam.id);
    if (alertSetting) {
      return alertSetting.is_enabled === 1;
    }

    // 2. Saved / Shortlisted / Target Exam (explicit interest)
    const isSaved = db.get('SELECT id FROM saved_exams WHERE user_id = ? AND exam_id = ?', [user.id, exam.id]);
    if (isSaved) return true;

    const isTarget = db.get('SELECT id FROM target_exams WHERE user_id = ? AND exam_id = ?', [user.id, exam.id]);
    if (isTarget) return true;

    if (profile && profile.target_exam_id === exam.id) return true;

    // 3. Recommended Exam Match (if enabled in user preferences)
    if (preferences?.recommended_notifications === 1) {
      const preferredState = preferences.preferred_state || profile?.state || 'Tamil Nadu';
      const isStateMatch = exam.state === 'All India' || exam.state === preferredState;

      // Basic qualification compatibility check
      let qualMatch = true;
      if (profile?.qualification && exam.qualification) {
        if (exam.qualification.includes('MBBS') && !profile.qualification.includes('MBBS')) qualMatch = false;
        if (exam.qualification.includes('Law') && !profile.qualification.includes('Law')) qualMatch = false;
      }

      return isStateMatch && qualMatch;
    }

    return false;
  },

  // 6. Automated Date-Aware Lifecycle Scheduler (Main Engine Cycle)
  async runNotificationEngine() {
    const today = getISTDateString();
    console.log(`⚡ [Notification Engine] Running date-aware lifecycle checks for IST Date: ${today}...`);

    let dispatchedCount = 0;
    const errors = [];

    try {
      // Step A: Load active exam cycles
      const activeCycles = db.query(`
        SELECT ed.*, e.name as exam_name, e.code as exam_code, e.organization,
               e.qualification, e.state, e.category, e.official_url, e.in_hand_salary, e.pay_level
        FROM exam_dates ed
        JOIN exams e ON e.id = ed.exam_id
      `);

      // Step B: Load all registered users with their profiles and notification preferences
      const allUsers = db.query('SELECT id, name, email, preferred_language FROM users');
      
      for (const cycle of activeCycles) {
        const exam = {
          id: cycle.exam_id,
          name: cycle.exam_name,
          code: cycle.exam_code,
          organization: cycle.organization,
          qualification: cycle.qualification,
          state: cycle.state,
          category: cycle.category,
          official_url: cycle.official_url,
          in_hand_salary: cycle.in_hand_salary,
          pay_level: cycle.pay_level
        };

        // Determine event triggers for this cycle
        const eventsToTrigger = [];

        // 1. APPLICATION_OPEN
        if (cycle.application_start && cycle.application_start === today) {
          eventsToTrigger.push({
            type: 'APPLICATION_OPEN',
            channelKey: 'application_open_notifications',
            title: `📢 Applications Open — ${exam.name}`,
            inAppMessage: `Official applications for ${exam.name} (${exam.organization}) are now open.`
          });
        }

        // 2. DEADLINE COUNTDOWNS
        if (cycle.application_end) {
          const daysToDeadline = getDaysDifference(cycle.application_end, today);

          if (daysToDeadline === 7) {
            eventsToTrigger.push({
              type: 'DEADLINE_7_DAYS',
              channelKey: 'deadline_notifications',
              daysRemaining: 7,
              deadlineDate: cycle.application_end,
              title: `⏰ ${exam.name} Application Deadline in 7 Days`,
              inAppMessage: `Application deadline for ${exam.name} closes in 7 days on ${cycle.application_end}.`
            });
          } else if (daysToDeadline === 3) {
            eventsToTrigger.push({
              type: 'DEADLINE_3_DAYS',
              channelKey: 'deadline_notifications',
              daysRemaining: 3,
              deadlineDate: cycle.application_end,
              title: `⚠️ ${exam.name} Application Deadline in 3 Days`,
              inAppMessage: `Only 3 days remaining to complete your application for ${exam.name}.`
            });
          } else if (daysToDeadline === 1) {
            eventsToTrigger.push({
              type: 'DEADLINE_1_DAY',
              channelKey: 'deadline_notifications',
              daysRemaining: 1,
              deadlineDate: cycle.application_end,
              title: `🚨 ${exam.name} Application Closes Tomorrow`,
              inAppMessage: `Final 24 hours! Application gateway for ${exam.name} closes tomorrow.`
            });
          } else if (daysToDeadline < 0 && cycle.status !== 'Applications Closed') {
            // Automatically mark application as closed in DB
            db.run("UPDATE exams SET status = 'Applications Closed' WHERE id = ?", [exam.id]);
            db.run("UPDATE exam_dates SET status = 'Applications Closed' WHERE id = ?", [cycle.id]);
          }
        }

        // 3. ADMIT CARD RELEASED
        if (cycle.admit_card_date && cycle.admit_card_date === today) {
          eventsToTrigger.push({
            type: 'ADMIT_CARD_RELEASED',
            channelKey: 'admit_card_notifications',
            title: `🎫 ${exam.name} Admit Card Available`,
            inAppMessage: `Official hall tickets/admit cards for ${exam.name} have been published.`
          });
        }

        // 4. EXAM DATE COUNTDOWNS
        if (cycle.exam_date) {
          const daysToExam = getDaysDifference(cycle.exam_date, today);

          if (daysToExam === 7) {
            eventsToTrigger.push({
              type: 'EXAM_7_DAYS',
              channelKey: 'exam_date_notifications',
              daysRemaining: 7,
              examDate: cycle.exam_date,
              title: `📅 ${exam.name} Exam in 7 Days`,
              inAppMessage: `Your ${exam.name} examination is scheduled in 7 days on ${cycle.exam_date}.`
            });
          } else if (daysToExam === 1) {
            eventsToTrigger.push({
              type: 'EXAM_1_DAY',
              channelKey: 'exam_date_notifications',
              daysRemaining: 1,
              examDate: cycle.exam_date,
              title: `🚨 ${exam.name} Exam Tomorrow`,
              inAppMessage: `Final reminder: Your ${exam.name} examination takes place tomorrow.`
            });
          } else if (daysToExam === 0) {
            eventsToTrigger.push({
              type: 'EXAM_DAY',
              channelKey: 'exam_day_notifications',
              daysRemaining: 0,
              examDate: cycle.exam_date,
              title: `🎯 Your ${exam.name} Exam Is Today`,
              inAppMessage: `Best of luck for your ${exam.name} exam today! Stay confident and focused.`
            });
          }
        }

        // 5. RESULT RELEASED
        if (cycle.result_date && cycle.result_date === today) {
          eventsToTrigger.push({
            type: 'RESULT_RELEASED',
            channelKey: 'result_notifications',
            title: `📢 ${exam.name} Result Released`,
            inAppMessage: `Official scorecards and merit lists for ${exam.name} have been published.`
          });
        }

        // Process each detected event for candidate pool
        for (const ev of eventsToTrigger) {
          // Record or update event in exam_notification_events
          const eventRecordId = `ene_${exam.id}_${ev.type}_${today}`;
          db.run(`
            INSERT OR REPLACE INTO exam_notification_events (id, exam_id, event_type, event_date, status, updated_at)
            VALUES (?, ?, ?, ?, 'processed', CURRENT_TIMESTAMP)
          `, [eventRecordId, exam.id, ev.type, today]);

          // Find eligible candidates
          for (const user of allUsers) {
            const prefs = await this.getUserPreferences(user.id);
            const profile = db.get('SELECT * FROM user_profiles WHERE user_id = ?', [user.id]);
            const explicitAlerts = await this.getUserExamAlerts(user.id);

            // Check if user is interested
            const isInterested = this.isUserInterestedInExam(user, profile, prefs, exam, explicitAlerts);
            if (!isInterested) continue;

            // Check if notification channel is enabled
            if (prefs[ev.channelKey] === 0) continue;

            // Deduplication check: check if this event has already been sent to this user
            const alreadySent = db.get(`
              SELECT id FROM notification_logs
              WHERE user_id = ? AND exam_id = ? AND event_type = ? AND status = 'sent'
            `, [user.id, exam.id, ev.type]);

            if (alreadySent) continue;

            // Render localized email
            const userLang = prefs.preferred_language || user.preferred_language || 'en';
            let emailPayload = null;

            if (ev.type === 'APPLICATION_OPEN') {
              emailPayload = emailService.renderApplicationOpenEmail({ user, exam, language: userLang });
            } else if (ev.type.startsWith('DEADLINE_')) {
              emailPayload = emailService.renderDeadlineReminderEmail({
                user,
                exam,
                daysRemaining: ev.daysRemaining,
                deadlineDate: ev.deadlineDate,
                language: userLang
              });
            } else if (ev.type === 'ADMIT_CARD_RELEASED') {
              emailPayload = emailService.renderAdmitCardEmail({ user, exam, language: userLang });
            } else if (ev.type.startsWith('EXAM_')) {
              emailPayload = emailService.renderExamDateReminderEmail({
                user,
                exam,
                daysRemaining: ev.daysRemaining,
                examDate: ev.examDate,
                language: userLang
              });
            } else if (ev.type === 'RESULT_RELEASED') {
              emailPayload = emailService.renderResultEmail({ user, exam, language: userLang });
            }

            if (emailPayload) {
              await emailService.sendEmail({
                userId: user.id,
                recipientEmail: user.email,
                subject: emailPayload.subject,
                notificationType: ev.type,
                examId: exam.id,
                htmlContent: emailPayload.html,
                language: userLang
              });

              // Also create corresponding in-app notification
              const notifId = `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
              db.run(`
                INSERT INTO exam_notifications (id, user_id, exam_id, title, message, notification_type, urgency, action_url, is_read, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, CURRENT_TIMESTAMP)
              `, [
                notifId,
                user.id,
                exam.id,
                ev.title,
                ev.inAppMessage,
                ev.type.toLowerCase(),
                ev.type.includes('1_DAY') || ev.type === 'EXAM_DAY' ? 'urgent' : 'normal',
                exam.official_url || 'https://india.gov.in'
              ]);

              dispatchedCount++;
            }
          }
        }
      }

      console.log(`✅ [Notification Engine] Completed automated cycle. Dispatched ${dispatchedCount} targeted alerts.`);
      return {
        success: true,
        dispatched_count: dispatchedCount,
        ist_date: today,
        timestamp: new Date().toISOString()
      };
    } catch (err) {
      console.error('❌ [Notification Engine] Error running notification cycle:', err);
      return {
        success: false,
        error: err.message
      };
    }
  },

  // 7. Get User In-App Notification Center
  async getInAppNotifications(userId, { type, unreadOnly } = {}) {
    let sql = `
      SELECT en.*, e.name as exam_name, e.code as exam_code, e.organization
      FROM exam_notifications en
      LEFT JOIN exams e ON e.id = en.exam_id
      WHERE (en.user_id = ? OR en.user_id IS NULL)
    `;
    const params = [userId || 'anonymous'];

    if (type && type !== 'All') {
      if (type === 'Applications Opened') sql += " AND (en.notification_type = 'application_open' OR en.notification_type = 'notification_released')";
      else if (type === 'Deadlines') sql += " AND en.notification_type LIKE '%deadline%'";
      else if (type === 'Admit Cards') sql += " AND en.notification_type = 'admit_card_released' OR en.notification_type = 'admit_card'";
      else if (type === 'Exam Reminders') sql += " AND en.notification_type LIKE 'exam_%'";
      else if (type === 'Results') sql += " AND en.notification_type LIKE '%result%'";
      else if (type === 'Current Affairs') sql += " AND en.notification_type = 'current_affairs'";
    }

    if (unreadOnly === 'true' || unreadOnly === true) {
      sql += ' AND en.is_read = 0';
    }

    sql += ' ORDER BY en.created_at DESC LIMIT 50';
    const notifs = db.query(sql, params);

    const unreadCount = db.get(`
      SELECT COUNT(*) as count
      FROM exam_notifications
      WHERE (user_id = ? OR user_id IS NULL) AND is_read = 0
    `, [userId || 'anonymous'])?.count || 0;

    return {
      notifications: notifs.map(n => ({
        ...n,
        is_read: n.is_read === 1
      })),
      unread_count: unreadCount
    };
  },

  async markInAppNotificationRead(userId, notificationId) {
    db.run('UPDATE exam_notifications SET is_read = 1 WHERE id = ?', [notificationId]);
    return { success: true, id: notificationId };
  },

  async markAllInAppNotificationsRead(userId) {
    db.run('UPDATE exam_notifications SET is_read = 1 WHERE user_id = ? OR user_id IS NULL', [userId || 'anonymous']);
    return { success: true };
  },

  // 8. Get Delivery History Logs for Audit
  async getUserNotificationLogs(userId) {
    return db.query(`
      SELECT nl.id, nl.user_id, nl.exam_id,
             COALESCE(nl.event_type, nl.notification_type) as event_type,
             COALESCE(nl.recipient_email, nl.email) as recipient_email,
             nl.subject, nl.language, nl.sent_at, nl.status, nl.provider_message_id,
             e.name as exam_name, e.code as exam_code
      FROM notification_logs nl
      LEFT JOIN exams e ON e.id = nl.exam_id
      WHERE nl.user_id = ?
      ORDER BY nl.sent_at DESC
      LIMIT 100
    `, [userId]);
  },

  // 9. Admin Stats Overview
  async getAdminNotificationStats() {
    const today = getISTDateString();

    const todaySent = db.get(`
      SELECT COUNT(*) as count FROM notification_logs
      WHERE DATE(sent_at) = ? AND status = 'sent'
    `, [today])?.count || 0;

    const todayFailed = db.get(`
      SELECT COUNT(*) as count FROM notification_logs
      WHERE DATE(sent_at) = ? AND status = 'failed'
    `, [today])?.count || 0;

    const totalSubscribers = db.get(`
      SELECT COUNT(DISTINCT user_id) as count FROM user_notification_preferences
    `)?.count || 0;

    const upcomingEvents = db.query(`
      SELECT ene.*, e.name as exam_name, e.organization
      FROM exam_notification_events ene
      JOIN exams e ON e.id = ene.exam_id
      ORDER BY ene.event_date ASC
      LIMIT 10
    `);

    const recentLogs = db.query(`
      SELECT nl.id, nl.user_id, nl.exam_id,
             COALESCE(nl.event_type, nl.notification_type) as event_type,
             COALESCE(nl.recipient_email, nl.email) as recipient_email,
             nl.subject, nl.language, nl.sent_at, nl.status, nl.provider_message_id,
             e.name as exam_name
      FROM notification_logs nl
      LEFT JOIN exams e ON e.id = nl.exam_id
      ORDER BY nl.sent_at DESC
      LIMIT 25
    `);

    return {
      today_sent: todaySent,
      today_failed: todayFailed,
      total_subscribers: totalSubscribers,
      upcoming_events: upcomingEvents,
      recent_logs: recentLogs
    };
  },

  // 10. Dispatch Manual Test Notification to Authenticated User's Real Email
  async dispatchManualTestEmail(userId, alertType = 'deadline', customLang = null, explicitRecipientEmail = null) {
    let user = db.get('SELECT id, name, email, preferred_language FROM users WHERE id = ?', [userId]);
    if (!user) {
      user = {
        id: userId || 'usr_admin',
        name: 'Preethika',
        email: explicitRecipientEmail || process.env.ADMIN_NOTIFICATION_EMAIL || 'preethika0809@gmail.com',
        preferred_language: 'en'
      };
    }

    const sampleExam = db.get('SELECT * FROM exams WHERE id = ?', ['exam_ssc_cgl']) ||
                       db.get('SELECT * FROM exams LIMIT 1') ||
                       { id: 'exam_general', name: 'Government Examination', code: 'GOVT EXAM', organization: 'Recruitment Commission' };

    let lang = customLang || user.preferred_language || 'en';
    try {
      const prefs = await this.getUserPreferences(userId);
      if (prefs?.preferred_language) lang = prefs.preferred_language;
    } catch (e) {}

    let templateResult;
    let notifType = 'application_deadline';

    switch (alertType) {
      case 'application_open':
        templateResult = emailService.renderApplicationOpenEmail({ user, exam: sampleExam, language: lang });
        notifType = 'APPLICATION_OPEN';
        break;
      case 'deadline':
      case 'deadline_3_days':
        templateResult = emailService.renderDeadlineReminderEmail({ user, exam: sampleExam, daysRemaining: 3, deadlineDate: 'September 15, 2026', language: lang });
        notifType = 'DEADLINE_3_DAYS';
        break;
      case 'deadline_1_day':
        templateResult = emailService.renderDeadlineReminderEmail({ user, exam: sampleExam, daysRemaining: 1, deadlineDate: 'Tomorrow (11:59 PM)', language: lang });
        notifType = 'DEADLINE_1_DAY';
        break;
      case 'admit_card':
        templateResult = emailService.renderAdmitCardEmail({ user, exam: sampleExam, language: lang });
        notifType = 'ADMIT_CARD_RELEASED';
        break;
      case 'exam_date':
      case 'exam_7_days':
        templateResult = emailService.renderExamDateReminderEmail({ user, exam: sampleExam, daysRemaining: 7, examDate: 'October 10, 2026', language: lang });
        notifType = 'EXAM_7_DAYS';
        break;
      case 'exam_day':
        templateResult = emailService.renderExamDateReminderEmail({ user, exam: sampleExam, daysRemaining: 0, examDate: 'Today (Reporting: 08:30 AM)', language: lang });
        notifType = 'EXAM_DAY';
        break;
      case 'result':
        templateResult = emailService.renderResultEmail({ user, exam: sampleExam, language: lang });
        notifType = 'RESULT_RELEASED';
        break;
      case 'current_affairs':
        const recentArticles = db.query('SELECT * FROM ca_rag_documents ORDER BY published_date DESC LIMIT 5');
        templateResult = emailService.renderDailyCurrentAffairsEmail({ user, articles: recentArticles, language: lang });
        notifType = 'CURRENT_AFFAIRS_DIGEST';
        break;
      default:
        templateResult = emailService.renderDeadlineReminderEmail({ user, exam: sampleExam, daysRemaining: 3, deadlineDate: 'September 15, 2026', language: lang });
        notifType = 'DEADLINE_3_DAYS';
    }

    const recipient = explicitRecipientEmail || user.email || 'preethika0809@gmail.com';

    const dispatchResult = await emailService.sendEmail({
      userId: user.id,
      recipientEmail: recipient,
      subject: templateResult.subject,
      notificationType: notifType,
      examId: sampleExam.id,
      htmlContent: templateResult.html,
      language: lang
    });

    return {
      success: true,
      message: `Verified test alert [${templateResult.subject}] dispatched to ${recipient}`,
      dispatchResult
    };
  }
};

module.exports = notificationEngine;
