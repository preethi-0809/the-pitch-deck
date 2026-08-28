-- =========================================================
-- Government Exam AI Preparation Platform (PrepAI)
-- MySQL 8.x Enterprise Production Schema DDL
-- Storage Engine: InnoDB | Charset: utf8mb4
-- =========================================================

SET FOREIGN_KEY_CHECKS = 0;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(32) DEFAULT 'user',
  preferred_language VARCHAR(10) DEFAULT 'en',
  is_active SMALLINT DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. User Profiles Table
CREATE TABLE IF NOT EXISTS user_profiles (
  id VARCHAR(64) PRIMARY KEY,
  user_id VARCHAR(64) UNIQUE NOT NULL,
  user_type VARCHAR(64) NOT NULL,
  target_exam_id VARCHAR(64) NOT NULL,
  exam_date DATE NULL,
  preparation_level VARCHAR(32) DEFAULT 'beginner',
  previous_attempts INT DEFAULT 0,
  daily_hours_weekday DECIMAL(4,1) DEFAULT 2.0,
  daily_hours_weekend DECIMAL(4,1) DEFAULT 4.0,
  preferred_study_timings VARCHAR(128) DEFAULT 'morning,evening',
  learning_style VARCHAR(64) DEFAULT 'visual_practical',
  strong_subjects TEXT,
  weak_subjects TEXT,
  current_syllabus_completion DECIMAL(5,2) DEFAULT 0.0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_user_profiles_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Exams Table
CREATE TABLE IF NOT EXISTS exams (
  id VARCHAR(64) PRIMARY KEY,
  code VARCHAR(64) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(128) NOT NULL,
  description TEXT,
  total_marks INT DEFAULT 100,
  duration_minutes INT DEFAULT 60,
  is_active SMALLINT DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Subjects Table
CREATE TABLE IF NOT EXISTS subjects (
  id VARCHAR(64) PRIMARY KEY,
  exam_id VARCHAR(64) NOT NULL,
  name VARCHAR(255) NOT NULL,
  code VARCHAR(64) NOT NULL,
  description TEXT,
  icon VARCHAR(64),
  weightage_percentage DECIMAL(5,2) DEFAULT 0.0,
  display_order INT DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_subjects_exam FOREIGN KEY (exam_id) REFERENCES exams(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Topics Table
CREATE TABLE IF NOT EXISTS topics (
  id VARCHAR(64) PRIMARY KEY,
  subject_id VARCHAR(64) NOT NULL,
  name VARCHAR(255) NOT NULL,
  code VARCHAR(64),
  description TEXT,
  difficulty_level VARCHAR(32) DEFAULT 'medium',
  pyq_importance_score DECIMAL(3,1) DEFAULT 7.5,
  estimated_hours DECIMAL(4,1) DEFAULT 3.0,
  display_order INT DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_topics_subject FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. User Syllabus Progress Table
CREATE TABLE IF NOT EXISTS user_syllabus_progress (
  id VARCHAR(64) PRIMARY KEY,
  user_id VARCHAR(64) NOT NULL,
  topic_id VARCHAR(64) NOT NULL,
  status VARCHAR(32) DEFAULT 'pending',
  mastery_percentage DECIMAL(5,2) DEFAULT 0.0,
  hours_spent DECIMAL(6,2) DEFAULT 0.0,
  last_studied_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_user_topic (user_id, topic_id),
  CONSTRAINT fk_usp_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_usp_topic FOREIGN KEY (topic_id) REFERENCES topics(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Study Materials Table
CREATE TABLE IF NOT EXISTS study_materials (
  id VARCHAR(64) PRIMARY KEY,
  topic_id VARCHAR(64) NOT NULL,
  title VARCHAR(255) NOT NULL,
  content_type VARCHAR(64) DEFAULT 'notes',
  content LONGTEXT NOT NULL,
  language VARCHAR(10) DEFAULT 'en',
  source_authority VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_study_materials_topic FOREIGN KEY (topic_id) REFERENCES topics(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Questions Table
CREATE TABLE IF NOT EXISTS questions (
  id VARCHAR(64) PRIMARY KEY,
  topic_id VARCHAR(64) NOT NULL,
  exam_id VARCHAR(64) NOT NULL,
  question_text TEXT NOT NULL,
  question_type VARCHAR(32) DEFAULT 'mcq',
  difficulty_level VARCHAR(32) DEFAULT 'medium',
  explanation TEXT NOT NULL,
  tamil_text TEXT,
  tamil_explanation TEXT,
  is_pyq SMALLINT DEFAULT 0,
  pyq_year INT NULL,
  pyq_source VARCHAR(255),
  created_by VARCHAR(64) DEFAULT 'system',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_questions_topic FOREIGN KEY (topic_id) REFERENCES topics(id) ON DELETE CASCADE,
  CONSTRAINT fk_questions_exam FOREIGN KEY (exam_id) REFERENCES exams(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. Question Options Table
CREATE TABLE IF NOT EXISTS question_options (
  id VARCHAR(64) PRIMARY KEY,
  question_id VARCHAR(64) NOT NULL,
  option_key VARCHAR(8) NOT NULL,
  option_text TEXT NOT NULL,
  tamil_option_text TEXT,
  is_correct SMALLINT DEFAULT 0,
  explanation TEXT,
  CONSTRAINT fk_options_question FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. Tests Table
CREATE TABLE IF NOT EXISTS tests (
  id VARCHAR(64) PRIMARY KEY,
  exam_id VARCHAR(64) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  test_type VARCHAR(64) DEFAULT 'mock',
  duration_minutes INT DEFAULT 60,
  total_marks DECIMAL(6,2) DEFAULT 100.0,
  passing_marks DECIMAL(6,2) DEFAULT 40.0,
  pass_percentage DECIMAL(5,2) DEFAULT 40.0,
  is_adaptive SMALLINT DEFAULT 0,
  is_published SMALLINT DEFAULT 1,
  is_active SMALLINT DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_tests_exam FOREIGN KEY (exam_id) REFERENCES exams(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 11. Test Questions Map
CREATE TABLE IF NOT EXISTS test_questions (
  id VARCHAR(64) PRIMARY KEY,
  test_id VARCHAR(64) NOT NULL,
  question_id VARCHAR(64) NOT NULL,
  marks DECIMAL(4,2) DEFAULT 2.0,
  negative_marks DECIMAL(4,2) DEFAULT 0.66,
  display_order INT DEFAULT 1,
  CONSTRAINT fk_tq_test FOREIGN KEY (test_id) REFERENCES tests(id) ON DELETE CASCADE,
  CONSTRAINT fk_tq_question FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 12. Test Attempts Table
CREATE TABLE IF NOT EXISTS test_attempts (
  id VARCHAR(64) PRIMARY KEY,
  user_id VARCHAR(64) NOT NULL,
  test_id VARCHAR(64) NOT NULL,
  score DECIMAL(6,2) DEFAULT 0.0,
  total_marks DECIMAL(6,2) DEFAULT 0.0,
  percentage DECIMAL(5,2) DEFAULT 0.0,
  total_questions INT DEFAULT 0,
  attempted_count INT DEFAULT 0,
  correct_count INT DEFAULT 0,
  incorrect_count INT DEFAULT 0,
  unanswered_count INT DEFAULT 0,
  accuracy DECIMAL(5,2) DEFAULT 0.0,
  time_taken_seconds INT DEFAULT 0,
  completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_ta_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_ta_test FOREIGN KEY (test_id) REFERENCES tests(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 13. Test Answers Table
CREATE TABLE IF NOT EXISTS test_answers (
  id VARCHAR(64) PRIMARY KEY,
  attempt_id VARCHAR(64) NOT NULL,
  question_id VARCHAR(64) NOT NULL,
  selected_option_key VARCHAR(8),
  is_correct SMALLINT DEFAULT 0,
  time_spent_seconds INT DEFAULT 0,
  mistake_tag VARCHAR(64),
  CONSTRAINT fk_tans_attempt FOREIGN KEY (attempt_id) REFERENCES test_attempts(id) ON DELETE CASCADE,
  CONSTRAINT fk_tans_question FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 14. Performance Analytics Table
CREATE TABLE IF NOT EXISTS performance_analytics (
  id VARCHAR(64) PRIMARY KEY,
  user_id VARCHAR(64) NOT NULL,
  subject_id VARCHAR(64) NOT NULL,
  tests_taken INT DEFAULT 0,
  total_questions_attempted INT DEFAULT 0,
  total_correct INT DEFAULT 0,
  average_accuracy DECIMAL(5,2) DEFAULT 0.0,
  average_speed_seconds DECIMAL(6,2) DEFAULT 0.0,
  mastery_level VARCHAR(32) DEFAULT 'developing',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_user_subject (user_id, subject_id),
  CONSTRAINT fk_pa_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_pa_subject FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 15. User Mistakes Table
CREATE TABLE IF NOT EXISTS user_mistakes (
  id VARCHAR(64) PRIMARY KEY,
  user_id VARCHAR(64) NOT NULL,
  topic_id VARCHAR(64) NOT NULL,
  question_id VARCHAR(64) NULL,
  mistake_type VARCHAR(64) NOT NULL,
  notes TEXT,
  frequency_count INT DEFAULT 1,
  last_occurred_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(32) DEFAULT 'active',
  CONSTRAINT fk_um_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_um_topic FOREIGN KEY (topic_id) REFERENCES topics(id) ON DELETE CASCADE,
  CONSTRAINT fk_um_question FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 16. Study Plans Table
CREATE TABLE IF NOT EXISTS study_plans (
  id VARCHAR(64) PRIMARY KEY,
  user_id VARCHAR(64) NOT NULL,
  plan_date DATE NOT NULL,
  status VARCHAR(32) DEFAULT 'active',
  total_planned_minutes INT DEFAULT 120,
  total_completed_minutes INT DEFAULT 0,
  generated_by VARCHAR(64) DEFAULT 'ai_study_planner',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_sp_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 17. Study Tasks Table
CREATE TABLE IF NOT EXISTS study_tasks (
  id VARCHAR(64) PRIMARY KEY,
  plan_id VARCHAR(64) NOT NULL,
  topic_id VARCHAR(64) NOT NULL,
  task_type VARCHAR(64) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  planned_duration_minutes INT DEFAULT 30,
  completed_duration_minutes INT DEFAULT 0,
  is_completed SMALLINT DEFAULT 0,
  priority VARCHAR(32) DEFAULT 'high',
  due_time_slot VARCHAR(32) DEFAULT 'morning',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_st_plan FOREIGN KEY (plan_id) REFERENCES study_plans(id) ON DELETE CASCADE,
  CONSTRAINT fk_st_topic FOREIGN KEY (topic_id) REFERENCES topics(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 18. Revision Schedules Table
CREATE TABLE IF NOT EXISTS revision_schedules (
  id VARCHAR(64) PRIMARY KEY,
  user_id VARCHAR(64) NOT NULL,
  topic_id VARCHAR(64) NOT NULL,
  revision_interval_stage INT DEFAULT 1,
  scheduled_date DATE NOT NULL,
  status VARCHAR(32) DEFAULT 'pending',
  priority VARCHAR(32) DEFAULT 'normal',
  reason VARCHAR(64) DEFAULT 'spaced_repetition',
  completed_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_rs_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_rs_topic FOREIGN KEY (topic_id) REFERENCES topics(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 19. Current Affairs Table
CREATE TABLE IF NOT EXISTS current_affairs (
  id VARCHAR(64) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  summary TEXT NOT NULL,
  detailed_analysis LONGTEXT,
  category VARCHAR(128) NOT NULL,
  source_name VARCHAR(255) NOT NULL,
  source_url VARCHAR(512),
  is_verified SMALLINT DEFAULT 1,
  verification_notes TEXT,
  exam_relevance_tags TEXT,
  published_date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 20. Current Affairs to Topics Link Table
CREATE TABLE IF NOT EXISTS current_affairs_topics (
  id VARCHAR(64) PRIMARY KEY,
  current_affair_id VARCHAR(64) NOT NULL,
  topic_id VARCHAR(64) NOT NULL,
  CONSTRAINT fk_cat_ca FOREIGN KEY (current_affair_id) REFERENCES current_affairs(id) ON DELETE CASCADE,
  CONSTRAINT fk_cat_topic FOREIGN KEY (topic_id) REFERENCES topics(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 21. AI Coach Logs Table
CREATE TABLE IF NOT EXISTS ai_coach_logs (
  id VARCHAR(64) PRIMARY KEY,
  user_id VARCHAR(64) NOT NULL,
  agent_name VARCHAR(64) NOT NULL,
  message_type VARCHAR(64) NOT NULL,
  user_message TEXT,
  ai_response LONGTEXT NOT NULL,
  structured_data LONGTEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_acl_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 22. Email Preferences & Logs
CREATE TABLE IF NOT EXISTS email_preferences (
  id VARCHAR(64) PRIMARY KEY,
  user_id VARCHAR(64) UNIQUE NOT NULL,
  daily_study_plan_email SMALLINT DEFAULT 1,
  study_reminder_email SMALLINT DEFAULT 1,
  revision_reminder_email SMALLINT DEFAULT 1,
  upcoming_test_email SMALLINT DEFAULT 1,
  missed_session_email SMALLINT DEFAULT 1,
  current_affairs_digest_email SMALLINT DEFAULT 1,
  ai_recommendation_email SMALLINT DEFAULT 1,
  preferred_email_time VARCHAR(16) DEFAULT '07:00',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_ep_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS email_logs (
  id VARCHAR(64) PRIMARY KEY,
  user_id VARCHAR(64) NOT NULL,
  recipient_email VARCHAR(255) NOT NULL,
  subject VARCHAR(255) NOT NULL,
  email_type VARCHAR(64) NOT NULL,
  status VARCHAR(32) DEFAULT 'sent',
  retry_count INT DEFAULT 0,
  error_message TEXT,
  sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_el_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- High-Performance Indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_subjects_exam ON subjects(exam_id);
CREATE INDEX IF NOT EXISTS idx_topics_subject ON topics(subject_id);
CREATE INDEX IF NOT EXISTS idx_questions_topic ON questions(topic_id);
CREATE INDEX IF NOT EXISTS idx_questions_exam ON questions(exam_id);
CREATE INDEX IF NOT EXISTS idx_test_attempts_user ON test_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_test_attempts_test ON test_attempts(test_id);
CREATE INDEX IF NOT EXISTS idx_user_mistakes_user ON user_mistakes(user_id);
CREATE INDEX IF NOT EXISTS idx_study_plans_user_date ON study_plans(user_id, plan_date);
CREATE INDEX IF NOT EXISTS idx_study_tasks_plan ON study_tasks(plan_id);
CREATE INDEX IF NOT EXISTS idx_revision_schedules_user ON revision_schedules(user_id, scheduled_date);
CREATE INDEX IF NOT EXISTS idx_current_affairs_date ON current_affairs(published_date);

SET FOREIGN_KEY_CHECKS = 1;
