-- =========================================================
-- PrepAI - Complete MySQL Database Migration & Seed Dump
-- Engine: InnoDB | Charset: utf8mb4 | Auto-generated
-- =========================================================

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


-- =========================================================
-- SEED DATA INSERTION (MySQL Compatible)
-- =========================================================

SET FOREIGN_KEY_CHECKS = 0;

-- 1. Exams
INSERT IGNORE INTO exams (id, code, name, category, description, total_marks, duration_minutes) VALUES ('exam_upsc_cse', 'UPSC_CSE', 'UPSC Civil Services Examination (CSE)', 'Civil Services', 'National competitive exam for recruitment to IAS, IPS, IFS, and Central Group A/B Services.', 200, 120);
INSERT IGNORE INTO exams (id, code, name, category, description, total_marks, duration_minutes) VALUES ('exam_ssc_cgl', 'SSC_CGL', 'SSC Combined Graduate Level (CGL Tier-I)', 'Staff Selection', 'Recruitment examination for Group B and C posts across Ministries and Departments of Govt of India.', 200, 60);
INSERT IGNORE INTO exams (id, code, name, category, description, total_marks, duration_minutes) VALUES ('exam_tnpsc_grp2', 'TNPSC_GRP2', 'TNPSC Group II / II-A Combined Civil Services', 'State PSC', 'Tamil Nadu Public Service Commission executive and non-executive posts examination.', 300, 180);
INSERT IGNORE INTO exams (id, code, name, category, description, total_marks, duration_minutes) VALUES ('exam_bank_po', 'BANK_PO', 'Banking Probationary Officer (IBPS / SBI PO)', 'Banking', 'All India entrance test for Scale-I Officer positions across Public Sector Banks.', 100, 60);
INSERT IGNORE INTO exams (id, code, name, category, description, total_marks, duration_minutes) VALUES ('exam_rrb_ntpc', 'RRB_NTPC', 'Railway RRB Non-Technical Popular Categories (NTPC)', 'Railways', 'Recruitment for Station Master, Goods Guard, Commercial Apprentice, and Traffic Assistant.', 100, 90);
INSERT IGNORE INTO exams (id, code, name, category, description, total_marks, duration_minutes) VALUES ('exam_state_psc', 'STATE_PSC', 'General State PSC Prelims (State Services)', 'State PSC', 'Comprehensive State Civil Services prelims foundation syllabus applicable for State administrative exams.', 200, 120);

-- 2. Subjects
INSERT IGNORE INTO subjects (id, exam_id, name, code, description, icon, weightage_percentage, display_order) VALUES ('subj_upsc_polity', 'exam_upsc_cse', 'Indian Polity & Governance', 'GS2_POLITY', 'Constitution, Political System, Panchayati Raj, Public Policy, Rights Issues.', 'Landmark', 22, 1);
INSERT IGNORE INTO subjects (id, exam_id, name, code, description, icon, weightage_percentage, display_order) VALUES ('subj_upsc_economy', 'exam_upsc_cse', 'Indian Economy & Development', 'GS3_ECONOMY', 'Macroeconomics, Banking, Inflation, Fiscal Policy, Agriculture, External Sector.', 'TrendingUp', 20, 2);
INSERT IGNORE INTO subjects (id, exam_id, name, code, description, icon, weightage_percentage, display_order) VALUES ('subj_upsc_history', 'exam_upsc_cse', 'History of India & National Movement', 'GS1_HISTORY', 'Ancient, Medieval, Modern Indian History & Indian National Freedom Movement.', 'BookOpen', 18, 3);
INSERT IGNORE INTO subjects (id, exam_id, name, code, description, icon, weightage_percentage, display_order) VALUES ('subj_upsc_env', 'exam_upsc_cse', 'Environment, Ecology & Geography', 'GS1_3_ENV_GEO', 'Biodiversity, Climate Change, World & Indian Physical and Economic Geography.', 'Globe', 20, 4);
INSERT IGNORE INTO subjects (id, exam_id, name, code, description, icon, weightage_percentage, display_order) VALUES ('subj_upsc_csat', 'exam_upsc_cse', 'CSAT (Aptitude & Reasoning)', 'CSAT_PAPER2', 'Comprehension, Logical Reasoning, Basic Numeracy, Data Interpretation.', 'Calculator', 20, 5);
INSERT IGNORE INTO subjects (id, exam_id, name, code, description, icon, weightage_percentage, display_order) VALUES ('subj_tnpsc_polity', 'exam_tnpsc_grp2', 'Indian Polity & Constitution', 'TN_POLITY', 'Preamble, Salient Features, Union Executive, Legislature, Judiciary, TN Governance.', 'Landmark', 18, 1);
INSERT IGNORE INTO subjects (id, exam_id, name, code, description, icon, weightage_percentage, display_order) VALUES ('subj_tnpsc_economy', 'exam_tnpsc_grp2', 'Indian & Tamil Nadu Economy', 'TN_ECONOMY', 'Five Year Plans, NITI Aayog, Sources of Revenue, Tamil Nadu Social Welfare Schemes.', 'TrendingUp', 16, 2);
INSERT IGNORE INTO subjects (id, exam_id, name, code, description, icon, weightage_percentage, display_order) VALUES ('subj_tnpsc_history_tn', 'exam_tnpsc_grp2', 'History, Culture & Heritage of TN (Unit 8)', 'TN_UNIT8', 'Sangam Era, Thirukkural, Dravidian Movement, Self-Respect Movement, Freedom Struggle in TN.', 'Scroll', 25, 3);
INSERT IGNORE INTO subjects (id, exam_id, name, code, description, icon, weightage_percentage, display_order) VALUES ('subj_tnpsc_admin', 'exam_tnpsc_grp2', 'Development Administration in TN (Unit 9)', 'TN_UNIT9', 'Human Development Indicators, Social Justice, Economic Growth in TN, E-Governance.', 'Building2', 18, 4);
INSERT IGNORE INTO subjects (id, exam_id, name, code, description, icon, weightage_percentage, display_order) VALUES ('subj_tnpsc_aptitude', 'exam_tnpsc_grp2', 'Aptitude & Mental Ability', 'TN_APTITUDE', 'Simplification, Percentage, HCF & LCM, Ratio, Simple & Compound Interest, Area, Volume.', 'Calculator', 23, 5);
INSERT IGNORE INTO subjects (id, exam_id, name, code, description, icon, weightage_percentage, display_order) VALUES ('subj_ssc_quant', 'exam_ssc_cgl', 'Quantitative Aptitude', 'SSC_QUANT', 'Arithmetic, Algebra, Geometry, Mensuration, Trigonometry, Data Interpretation.', 'Calculator', 25, 1);
INSERT IGNORE INTO subjects (id, exam_id, name, code, description, icon, weightage_percentage, display_order) VALUES ('subj_ssc_reasoning', 'exam_ssc_cgl', 'General Intelligence & Reasoning', 'SSC_REASON', 'Analogies, Syllogisms, Series, Coding-Decoding, Non-Verbal Reasoning.', 'Brain', 25, 2);
INSERT IGNORE INTO subjects (id, exam_id, name, code, description, icon, weightage_percentage, display_order) VALUES ('subj_ssc_english', 'exam_ssc_cgl', 'English Comprehension', 'SSC_ENG', 'Spotting Errors, Fill in the blanks, Synonyms/Antonyms, Idioms, Active/Passive voice.', 'Type', 25, 3);
INSERT IGNORE INTO subjects (id, exam_id, name, code, description, icon, weightage_percentage, display_order) VALUES ('subj_ssc_ga', 'exam_ssc_cgl', 'General Awareness', 'SSC_GA', 'History, Culture, Geography, Economic Scene, General Policy & Scientific Research.', 'Compass', 25, 4);
INSERT IGNORE INTO subjects (id, exam_id, name, code, description, icon, weightage_percentage, display_order) VALUES ('subj_bank_quant', 'exam_bank_po', 'Quantitative Aptitude', 'BANK_QUANT', 'Data Interpretation, Quadratic Equations, Number Series, Approximation, Arithmetic.', 'Calculator', 35, 1);
INSERT IGNORE INTO subjects (id, exam_id, name, code, description, icon, weightage_percentage, display_order) VALUES ('subj_bank_reasoning', 'exam_bank_po', 'Reasoning Ability', 'BANK_REASON', 'Puzzles, Seating Arrangements, Inequality, Syllogism, Blood Relations, Coding.', 'Brain', 35, 2);
INSERT IGNORE INTO subjects (id, exam_id, name, code, description, icon, weightage_percentage, display_order) VALUES ('subj_bank_english', 'exam_bank_po', 'English Language', 'BANK_ENG', 'Reading Comprehension, Cloze Test, Para Jumbles, Error Detection.', 'Type', 30, 3);

-- 3. Topics
INSERT IGNORE INTO topics (id, subject_id, name, code, description, difficulty_level, pyq_importance_score, estimated_hours, display_order) VALUES ('top_fr_dpsp', 'subj_upsc_polity', 'Fundamental Rights & DPSP (Articles 12-51A)', 'POL_01', 'Writs (Art 32), Right to Equality, Freedom of Speech (19), Liberty (21), DPSP vs FR balance.', 'hard', 9.8, 4.5, 1);
INSERT IGNORE INTO topics (id, subject_id, name, code, description, difficulty_level, pyq_importance_score, estimated_hours, display_order) VALUES ('top_parliament', 'subj_upsc_polity', 'Union Parliament & Legislative Procedures', 'POL_02', 'Money Bills, Financial Bills, Joint Sitting, Parliamentary Committees, Speaker powers.', 'medium', 9.2, 5, 2);
INSERT IGNORE INTO topics (id, subject_id, name, code, description, difficulty_level, pyq_importance_score, estimated_hours, display_order) VALUES ('top_judiciary', 'subj_upsc_polity', 'Supreme Court, High Courts & Judicial Review', 'POL_03', 'Collegium system, Basic Structure Doctrine, Original & Appellate Jurisdiction, PIL.', 'medium', 8.9, 3.5, 3);
INSERT IGNORE INTO topics (id, subject_id, name, code, description, difficulty_level, pyq_importance_score, estimated_hours, display_order) VALUES ('top_fed_emergency', 'subj_upsc_polity', 'Federal Structure & Emergency Provisions', 'POL_04', 'Centre-State Relations (7th Schedule), National/State/Financial Emergency (Arts 352, 356, 360).', 'hard', 8.5, 3, 4);
INSERT IGNORE INTO topics (id, subject_id, name, code, description, difficulty_level, pyq_importance_score, estimated_hours, display_order) VALUES ('top_monetary_rbi', 'subj_upsc_economy', 'Monetary Policy, RBI Tools & Inflation', 'ECO_01', 'Repo Rate, Reverse Repo, SDF, CRR, SLR, Open Market Operations, CPI vs WPI inflation.', 'hard', 9.6, 4, 1);
INSERT IGNORE INTO topics (id, subject_id, name, code, description, difficulty_level, pyq_importance_score, estimated_hours, display_order) VALUES ('top_fiscal_budget', 'subj_upsc_economy', 'Fiscal Policy, Union Budget & Taxation (GST)', 'ECO_02', 'Revenue vs Capital Deficit, Fiscal Deficit, FRBM Act, GST Council, Direct vs Indirect Taxes.', 'medium', 9, 3.5, 2);
INSERT IGNORE INTO topics (id, subject_id, name, code, description, difficulty_level, pyq_importance_score, estimated_hours, display_order) VALUES ('top_banking_npa', 'subj_upsc_economy', 'Banking Sector, NPAs & Insolvency (IBC)', 'ECO_03', 'Asset Reconstruction Companies (NARCL), PCA framework, Prompt Corrective Action, Basel III.', 'medium', 8.2, 3, 3);
INSERT IGNORE INTO topics (id, subject_id, name, code, description, difficulty_level, pyq_importance_score, estimated_hours, display_order) VALUES ('top_freedom_struggle', 'subj_upsc_history', 'Indian National Movement (1885–1947)', 'HIS_01', 'Moderate vs Extremist Phase, Swadeshi Movement, Gandhian Movements (NCM, CDM, QIM), INA.', 'medium', 9.5, 6, 1);
INSERT IGNORE INTO topics (id, subject_id, name, code, description, difficulty_level, pyq_importance_score, estimated_hours, display_order) VALUES ('top_ancient_art', 'subj_upsc_history', 'Ancient India: Harappan Civilization & Mauryan Empire', 'HIS_02', 'Town planning, Ashokan Edicts, Buddhism & Jainism councils, Sangam literature.', 'medium', 8.7, 4, 2);
INSERT IGNORE INTO topics (id, subject_id, name, code, description, difficulty_level, pyq_importance_score, estimated_hours, display_order) VALUES ('top_tn_thirukkural', 'subj_tnpsc_history_tn', 'Thirukkural as a Secular Literature', 'TN_01', 'Relevance to Socio-Politico-Economic affairs, Philosophical ideals, Universal values.', 'medium', 9.7, 3.5, 1);
INSERT IGNORE INTO topics (id, subject_id, name, code, description, difficulty_level, pyq_importance_score, estimated_hours, display_order) VALUES ('top_tn_dravidian_move', 'subj_tnpsc_history_tn', 'Self-Respect Movement & Justice Party Rule', 'TN_02', 'Periyar E.V.R., Non-Brahmin manifesto, Women empowerment reforms, Communal G.O. 1921.', 'medium', 9.4, 4, 2);
INSERT IGNORE INTO topics (id, subject_id, name, code, description, difficulty_level, pyq_importance_score, estimated_hours, display_order) VALUES ('top_tn_hdi_welfare', 'subj_tnpsc_admin', 'Human Development & Social Welfare in Tamil Nadu', 'TN_03', 'Midday Meal scheme evolution, Public Distribution System (Universal PDS), Health indicators.', 'easy', 9.1, 3, 1);
INSERT IGNORE INTO topics (id, subject_id, name, code, description, difficulty_level, pyq_importance_score, estimated_hours, display_order) VALUES ('top_tnpsc_ratio_perc', 'subj_tnpsc_aptitude', 'Percentages, Profit & Loss, Simple/Compound Interest', 'TN_APT_01', 'Effective interest rates, ratio-based shortcut methods, mixture & alligation.', 'easy', 9.5, 3, 1);
INSERT IGNORE INTO topics (id, subject_id, name, code, description, difficulty_level, pyq_importance_score, estimated_hours, display_order) VALUES ('top_ssc_percentage_profit', 'subj_ssc_quant', 'Arithmetic: Percentage, Profit, Loss & Discount', 'SSC_Q_01', 'Successive percentage changes, marked price vs cost price, faulty balance problems.', 'medium', 9.5, 4, 1);
INSERT IGNORE INTO topics (id, subject_id, name, code, description, difficulty_level, pyq_importance_score, estimated_hours, display_order) VALUES ('top_ssc_algebra_geom', 'subj_ssc_quant', 'Advanced Math: Geometry, Triangles & Circles', 'SSC_Q_02', 'Tangent theorems, circumcentre, incentre, similarity of triangles, cyclic quadrilaterals.', 'hard', 9.2, 5, 2);
INSERT IGNORE INTO topics (id, subject_id, name, code, description, difficulty_level, pyq_importance_score, estimated_hours, display_order) VALUES ('top_ssc_syllogism', 'subj_ssc_reasoning', 'Syllogisms & Logical Deductions', 'SSC_R_01', 'Only a few, Some not, Possibility cases, Venn diagram method.', 'medium', 9, 3, 1);
INSERT IGNORE INTO topics (id, subject_id, name, code, description, difficulty_level, pyq_importance_score, estimated_hours, display_order) VALUES ('top_ssc_grammar_error', 'subj_ssc_english', 'English Grammar Rules & Error Spotting', 'SSC_E_01', 'Subject-Verb agreement, Preposition rules, Conditionals, Modifiers.', 'medium', 9.3, 3.5, 1);
INSERT IGNORE INTO topics (id, subject_id, name, code, description, difficulty_level, pyq_importance_score, estimated_hours, display_order) VALUES ('top_bank_puzzles', 'subj_bank_reasoning', 'Floor, Box & Flat Puzzles with Multiple Variables', 'BNK_R_01', 'Complex variable arrangement, circular table with facing inside/outside.', 'hard', 9.9, 6, 1);
INSERT IGNORE INTO topics (id, subject_id, name, code, description, difficulty_level, pyq_importance_score, estimated_hours, display_order) VALUES ('top_bank_di', 'subj_bank_quant', 'Data Interpretation: Caselet & Radar Charts', 'BNK_Q_01', 'Missing DI, Arithmetic-based DI, Caselet passage decoding.', 'hard', 9.8, 5, 1);

-- 4. Study Materials
INSERT IGNORE INTO study_materials (id, topic_id, title, content_type, content, language, source_authority) VALUES ('mat_pol_fr', 'top_fr_dpsp', 'Comprehensive Master Notes: Fundamental Rights (Articles 12 to 35)', 'notes', '# Fundamental Rights (Part III, Articles 12-35)

## 1. Classification of Fundamental Rights
- **Right to Equality (Arts 14-18)**: Equality before law, prohibition of discrimination, equality of opportunity in public employment (Art 16), abolition of untouchability (Art 17), and titles (Art 18).
- **Right to Freedom (Arts 19-22)**: 6 freedoms under Art 19(1), protection in respect of conviction (Art 20), protection of life and personal liberty (Art 21 - includes privacy, clean environment, speedy trial via *Maneka Gandhi* & *Puttaswamy* cases), right to education (Art 21A), protection against arrest & detention (Art 22).
- **Right against Exploitation (Arts 23-24)**: Prohibition of human trafficking & forced labor (Art 23), prohibition of employment of children in hazardous industries (Art 24).
- **Right to Freedom of Religion (Arts 25-28)**: Freedom of conscience, profession, practice, and propagation.
- **Cultural & Educational Rights (Arts 29-30)**: Protection of interests of minorities.
- **Right to Constitutional Remedies (Art 32)**: Called the "Heart and Soul of the Constitution" by Dr. B.R. Ambedkar.

## 2. Writs Jurisdiction (Art 32 vs Art 226)
| Feature | Supreme Court (Art 32) | High Court (Art 226) |
|---|---|---|
| Scope | Only Fundamental Rights | Fundamental Rights + Any Legal Right |
| Territorial Jurisdiction | All India | Within State / Cause of Action |
| Discretionary | Mandatory Remedy (FR itself) | Discretionary Power |

### Five Types of Writs:
1. **Habeas Corpus**: "To have the body of" (Against illegal detention by State or Private entity).
2. **Mandamus**: "We Command" (To compel a public official/body to perform statutory duty).
3. **Prohibition**: Issued by Higher Court to Lower Court/Tribunal to prevent exceeding jurisdiction.
4. **Certiorari**: "To be certified" (Quashing an order issued without jurisdiction or in violation of natural justice).
5. **Quo-Warranto**: "By what authority" (Prevents illegal usurpation of a public office).', 'en', 'Constitution of India & Supreme Court Precedents');
INSERT IGNORE INTO study_materials (id, topic_id, title, content_type, content, language, source_authority) VALUES ('mat_eco_monetary', 'top_monetary_rbi', 'RBI Monetary Policy Framework, Liquidity Adjustment Facility & Inflation Targeting', 'notes', '# RBI Monetary Policy & Liquidity Management

## 1. Flexible Inflation Targeting (FIT) Framework
- Under Section 45ZB of RBI Act (amended in 2016), the central government in consultation with RBI sets the CPI headline inflation target: **4% with a tolerance band of +/- 2% (2% to 6%)**.
- **MPC Composition**: 6 members (3 from RBI including Governor with casting vote, 3 external independent experts appointed by Central Govt).

## 2. Quantitative / Direct & Indirect Tools
- **Repo Rate**: Rate at which RBI lends short-term funds to commercial banks against government securities.
- **Standing Deposit Facility (SDF)**: Floor of the policy corridor introduced in 2022. Allows RBI to absorb uncollateralized excess liquidity from banks without providing government securities.
- **Marginal Standing Facility (MSF)**: Ceiling of policy corridor. Overnight borrowing for banks against approved SLR quota with penal rate.
- **Cash Reserve Ratio (CRR)**: Percentage of Net Demand and Time Liabilities (NDTL) banks must hold in cash reserves with RBI. Earns 0% interest.
- **Statutory Liquidity Ratio (SLR)**: Percentage of NDTL banks must maintain in liquid assets (Gold, G-Secs, Cash) with themselves.', 'en', 'RBI Act 1934 & Monetary Policy Committee (MPC) Guidelines');
INSERT IGNORE INTO study_materials (id, topic_id, title, content_type, content, language, source_authority) VALUES ('mat_tn_thirukkural', 'top_tn_thirukkural', 'Thirukkural: Governance, Economic Administration & Universal Ethics', 'notes', '# Thirukkural in Governance and Administration

## 1. The Ideal State and King (Irai Matchi - Kural 385)
> "இயற்றலும் ஈட்டலும் காத்தலும் காத்த
> வகுத்தலும் வல்ல தரசு."
> *(An able government is one that creates revenue sources, collects them efficiently, safeguards the wealth, and allocates/distributes it justly for public welfare.)*

## 2. Universal and Secular Character
- Contains 1330 couplets across 133 chapters in 3 sections: Aram (Virtue), Porul (Wealth/Governance), Inbam (Love).
- Does not invoke any sectarian deity, caste hierarchy, or dogmatic creed.
- Focuses on righteousness, anti-corruption (*Koodaa Ozhukkam*), human dignity, and righteous taxation (*Kudi Thazhuvai*).', 'en', 'TN SCERT Unit 8 Official Reference & Sangam Canon');

-- 5. Questions & Options
INSERT IGNORE INTO questions (id, topic_id, exam_id, question_text, question_type, difficulty_level, is_pyq, pyq_year, pyq_source, explanation, tamil_text, tamil_explanation) VALUES ('q_pol_01', 'top_fr_dpsp', 'exam_upsc_cse', 'Which one of the following statements regarding the Writ of Mandamus in India is correct?', 'mcq', 'medium', 1, 2022, 'UPSC CSE Prelims GS-I', 'Mandamus cannot be granted against the President of India or the Governor of a State for the exercise and performance of the powers and duties of his office (Article 361). It also does not lie against a private individual or private body without public statutory duties.', 'இந்தியாவில் செயலுறுத்தும் நீதிப்பேராணை (Mandamus) பற்றிய பின்வரும் கூற்றுகளில் எது சரியானது?', 'இந்தியக் குடியரசுத் தலைவர் அல்லது மாநில ஆளுநருக்கு எதிராக அவர்களின் அதிகாரங்கள் மற்றும் கடமைகளைச் செயல்படுத்துவதற்காக மாண்டமஸ் ஆணை பிறப்பிக்க முடியாது (சரத்து 361).');
INSERT IGNORE INTO question_options (id, question_id, option_key, option_text, is_correct, explanation) VALUES ('opt_q1_a', 'q_pol_01', 'A', 'It can be issued against private individuals to enforce private contracts.', 0, NULL);
INSERT IGNORE INTO question_options (id, question_id, option_key, option_text, is_correct, explanation) VALUES ('opt_q1_b', 'q_pol_01', 'B', 'It cannot be issued against the President of India or State Governors in the discharge of official duties.', 1, NULL);
INSERT IGNORE INTO question_options (id, question_id, option_key, option_text, is_correct, explanation) VALUES ('opt_q1_c', 'q_pol_01', 'C', 'It can only be issued by the Supreme Court and not by High Courts.', 0, NULL);
INSERT IGNORE INTO question_options (id, question_id, option_key, option_text, is_correct, explanation) VALUES ('opt_q1_d', 'q_pol_01', 'D', 'It is issued to quash an order already passed by a judicial tribunal.', 0, NULL);
INSERT IGNORE INTO questions (id, topic_id, exam_id, question_text, question_type, difficulty_level, is_pyq, pyq_year, pyq_source, explanation, tamil_text, tamil_explanation) VALUES ('q_pol_02', 'top_fr_dpsp', 'exam_upsc_cse', 'A legislation that confers on the executive or administrative authority an unguided and uncontrolled discretionary power in the matter of application of law violates which one of the following Articles of the Constitution of India?', 'mcq', 'hard', 1, 2021, 'UPSC CSE Prelims GS-I', 'Arbitrary and unguided executive discretion violates Article 14 (Right to Equality and Non-Arbitrariness as established in the EP Royappa and Maneka Gandhi cases).', 'சட்டத்தைப் பயன்படுத்துவதில் நிர்வாக அதிகாரத்திற்கு வழிகாட்டப்படாத மற்றும் கட்டுப்பாடற்ற விருப்புரிமை அதிகாரத்தை வழங்கும் சட்டம், இந்திய அரசியலமைப்பின் பின்வரும் எந்த சரத்தை மீறுகிறது?', 'வழிகாட்டப்படாத தன்னிச்சையான நிர்வாக அதிகாரம் சரத்து 14-ஐ (சமத்துவ உரிமை மற்றும் தன்னிச்சையின்மை) மீறுகிறது.');
INSERT IGNORE INTO question_options (id, question_id, option_key, option_text, is_correct, explanation) VALUES ('opt_q2_a', 'q_pol_02', 'A', 'Article 14', 1, NULL);
INSERT IGNORE INTO question_options (id, question_id, option_key, option_text, is_correct, explanation) VALUES ('opt_q2_b', 'q_pol_02', 'B', 'Article 28', 0, NULL);
INSERT IGNORE INTO question_options (id, question_id, option_key, option_text, is_correct, explanation) VALUES ('opt_q2_c', 'q_pol_02', 'C', 'Article 32', 0, NULL);
INSERT IGNORE INTO question_options (id, question_id, option_key, option_text, is_correct, explanation) VALUES ('opt_q2_d', 'q_pol_02', 'D', 'Article 44', 0, NULL);
INSERT IGNORE INTO questions (id, topic_id, exam_id, question_text, question_type, difficulty_level, is_pyq, pyq_year, pyq_source, explanation, tamil_text, tamil_explanation) VALUES ('q_pol_03', 'top_parliament', 'exam_upsc_cse', 'With reference to the Union Government in India, consider the following statements regarding the Speaker of the Lok Sabha:
1. The Speaker decides whether a Bill is a Money Bill or not, and this decision is final.
2. The Speaker can vote in the first instance in all legislative voting.', 'mcq', 'medium', 1, 2023, 'UPSC CSE Prelims GS-I', 'Statement 1 is correct (Art 110(3)). Statement 2 is incorrect because the Speaker casts only a casting vote in case of an equality of votes (Art 100(1)), and does not vote in the first instance.', 'மக்களவை சபாநாயகர் தொடர்பாக பின்வரும் கூற்றுகளில் எது சரியானது?
1. ஒரு மசோதா பண மசோதாவா இல்லையா என்பதை சபாநாயகர் தீர்மானிக்கிறார்.
2. சபாநாயகர் அனைத்து வாக்கெடுப்புகளிலும் முதல் நிலையிலேயே வாக்களிக்கலாம்.', 'கூற்று 1 சரி. கூற்று 2 தவறு, ஏனெனில் சபாநாயகர் சமநிலை ஏற்படும் போது மட்டுமே முடிவு வாக்கு (casting vote) அளிக்க முடியும்.');
INSERT IGNORE INTO question_options (id, question_id, option_key, option_text, is_correct, explanation) VALUES ('opt_q3_a', 'q_pol_03', 'A', '1 only', 1, NULL);
INSERT IGNORE INTO question_options (id, question_id, option_key, option_text, is_correct, explanation) VALUES ('opt_q3_b', 'q_pol_03', 'B', '2 only', 0, NULL);
INSERT IGNORE INTO question_options (id, question_id, option_key, option_text, is_correct, explanation) VALUES ('opt_q3_c', 'q_pol_03', 'C', 'Both 1 and 2', 0, NULL);
INSERT IGNORE INTO question_options (id, question_id, option_key, option_text, is_correct, explanation) VALUES ('opt_q3_d', 'q_pol_03', 'D', 'Neither 1 nor 2', 0, NULL);
INSERT IGNORE INTO questions (id, topic_id, exam_id, question_text, question_type, difficulty_level, is_pyq, pyq_year, pyq_source, explanation, tamil_text, tamil_explanation) VALUES ('q_eco_01', 'top_monetary_rbi', 'exam_upsc_cse', 'If the RBI decides to adopt an expansionary monetary policy, which of the following will it NOT do?
1. Cut and optimize the Statutory Liquidity Ratio (SLR)
2. Increase the Marginal Standing Facility (MSF) rate
3. Cut the Bank Rate and Repo Rate', 'mcq', 'hard', 1, 2020, 'UPSC CSE Prelims GS-I', 'Under expansionary monetary policy, RBI wants to inject liquidity and reduce borrowing costs. Increasing MSF rate tightens liquidity and raises interest rates (contractionary), so RBI will NOT do statement 2.', 'ரிசர்வ் வங்கி ஒரு விரிவாக்க நாணயக் கொள்கையைக் கடைப்பிடிக்க முடிவு செய்தால், அது பின்வருவனவற்றில் எதைச் செய்யாது?', 'விரிவாக்க நாணயக் கொள்கையில் MSF விகிதத்தை அதிகரிப்பது பணப்புழக்கத்தைக் குறைக்கும், எனவே அதைச் செய்யாது (2 மட்டும்).');
INSERT IGNORE INTO question_options (id, question_id, option_key, option_text, is_correct, explanation) VALUES ('opt_q4_a', 'q_eco_01', 'A', '1 and 2 only', 0, NULL);
INSERT IGNORE INTO question_options (id, question_id, option_key, option_text, is_correct, explanation) VALUES ('opt_q4_b', 'q_eco_01', 'B', '2 only', 1, NULL);
INSERT IGNORE INTO question_options (id, question_id, option_key, option_text, is_correct, explanation) VALUES ('opt_q4_c', 'q_eco_01', 'C', '1 and 3 only', 0, NULL);
INSERT IGNORE INTO question_options (id, question_id, option_key, option_text, is_correct, explanation) VALUES ('opt_q4_d', 'q_eco_01', 'D', '1, 2 and 3', 0, NULL);
INSERT IGNORE INTO questions (id, topic_id, exam_id, question_text, question_type, difficulty_level, is_pyq, pyq_year, pyq_source, explanation, tamil_text, tamil_explanation) VALUES ('q_eco_02', 'top_monetary_rbi', 'exam_bank_po', 'What is the primary difference between the Repo Rate and the Standing Deposit Facility (SDF) rate in the RBI monetary framework?', 'mcq', 'medium', 1, 2023, 'IBPS PO Mains', 'Under the Standing Deposit Facility (SDF), RBI absorbs excess liquidity from commercial banks without providing collateral (government securities), unlike reverse repo operations.', 'ரிசர்வ் வங்கியின் நாணயக் கொள்கையில் SDF மற்றும் Repo விகிதத்திற்கு இடையேயான முக்கிய வேறுபாடு என்ன?', 'SDF முறையில் வங்கிகளிடம் இருந்து அரசுப் பத்திரங்களை பிணையமாக வழங்காமல் ரிசர்வ் வங்கி உபரி பணத்தை உறிஞ்சுகிறது.');
INSERT IGNORE INTO question_options (id, question_id, option_key, option_text, is_correct, explanation) VALUES ('opt_q5_a', 'q_eco_02', 'A', 'SDF requires commercial banks to provide physical gold collateral.', 0, NULL);
INSERT IGNORE INTO question_options (id, question_id, option_key, option_text, is_correct, explanation) VALUES ('opt_q5_b', 'q_eco_02', 'B', 'SDF allows RBI to absorb liquidity without providing government securities collateral.', 1, NULL);
INSERT IGNORE INTO question_options (id, question_id, option_key, option_text, is_correct, explanation) VALUES ('opt_q5_c', 'q_eco_02', 'C', 'Repo rate applies only to foreign exchange reserves.', 0, NULL);
INSERT IGNORE INTO question_options (id, question_id, option_key, option_text, is_correct, explanation) VALUES ('opt_q5_d', 'q_eco_02', 'D', 'SDF rate is always higher than the Marginal Standing Facility rate.', 0, NULL);
INSERT IGNORE INTO questions (id, topic_id, exam_id, question_text, question_type, difficulty_level, is_pyq, pyq_year, pyq_source, explanation, tamil_text, tamil_explanation) VALUES ('q_tn_01', 'top_tn_thirukkural', 'exam_tnpsc_grp2', 'According to Thirukkural, which of the following is described as the foundational virtue without which no true happiness or wealth can sustain?', 'mcq', 'medium', 1, 2022, 'TNPSC Group 2 Prelims', 'Thiruvalluvar emphasizes Aram (Righteousness / Virtue) as the prime pillar that brings unyielding glory and boundless wealth.', 'திருக்குறளின்படி, எதனை விடச் சிறந்த ஆக்கமும் இல்லை, எதனை மறப்பதை விடச் சிறந்த கேடும் இல்லை?', 'அறத்தை விட சிறந்த ஆக்கமும் இல்லை; அதனை மறப்பதை விட கொடிய கேடும் இல்லை ("அறத்தினூஉங்கு ஆக்கமும் இல்லை").');
INSERT IGNORE INTO question_options (id, question_id, option_key, option_text, is_correct, explanation) VALUES ('opt_q6_a', 'q_tn_01', 'A', 'Aram (Righteousness / Virtue)', 1, NULL);
INSERT IGNORE INTO question_options (id, question_id, option_key, option_text, is_correct, explanation) VALUES ('opt_q6_b', 'q_tn_01', 'B', 'Military Conquest', 0, NULL);
INSERT IGNORE INTO question_options (id, question_id, option_key, option_text, is_correct, explanation) VALUES ('opt_q6_c', 'q_tn_01', 'C', 'Accumulation of Gold', 0, NULL);
INSERT IGNORE INTO question_options (id, question_id, option_key, option_text, is_correct, explanation) VALUES ('opt_q6_d', 'q_tn_01', 'D', 'Dogmatic Ritualism', 0, NULL);
INSERT IGNORE INTO questions (id, topic_id, exam_id, question_text, question_type, difficulty_level, is_pyq, pyq_year, pyq_source, explanation, tamil_text, tamil_explanation) VALUES ('q_tn_02', 'top_tn_dravidian_move', 'exam_tnpsc_grp2', 'In which year was the historic First Communal Government Order (Communal G.O.) issued by the Justice Party ministry in the Madras Presidency?', 'mcq', 'easy', 1, 2021, 'TNPSC Group 1 Prelims', 'The Justice Party passed the first Communal G.O. (G.O. No. 613) on 16 September 1921 providing reservation in government appointments for non-Brahmins, Muslims, Indian Christians, and Adi-Dravidars.', 'மெட்ராஸ் மாகாணத்தில் நீதிக்கட்சி அமைச்சரவையால் வரலாற்றுச் சிறப்புமிக்க முதல் வகுப்புவாரி அரசாணை எந்த ஆண்டு பிறப்பிக்கப்பட்டது?', 'நீதிக்கட்சி செப்டம்பர் 16, 1921 அன்று முதல் வகுப்புவாரி அரசாணையை (Communal G.O.) பிறப்பித்தது.');
INSERT IGNORE INTO question_options (id, question_id, option_key, option_text, is_correct, explanation) VALUES ('opt_q7_a', 'q_tn_02', 'A', '1916', 0, NULL);
INSERT IGNORE INTO question_options (id, question_id, option_key, option_text, is_correct, explanation) VALUES ('opt_q7_b', 'q_tn_02', 'B', '1921', 1, NULL);
INSERT IGNORE INTO question_options (id, question_id, option_key, option_text, is_correct, explanation) VALUES ('opt_q7_c', 'q_tn_02', 'C', '1929', 0, NULL);
INSERT IGNORE INTO question_options (id, question_id, option_key, option_text, is_correct, explanation) VALUES ('opt_q7_d', 'q_tn_02', 'D', '1937', 0, NULL);
INSERT IGNORE INTO questions (id, topic_id, exam_id, question_text, question_type, difficulty_level, is_pyq, pyq_year, pyq_source, explanation, tamil_text, tamil_explanation) VALUES ('q_ssc_01', 'top_ssc_percentage_profit', 'exam_ssc_cgl', 'A shopkeeper marks an article 40% above the cost price and allows a discount of 25% on the marked price. What is his net profit or loss percentage?', 'mcq', 'easy', 1, 2023, 'SSC CGL Tier-I', 'Let CP = 100. Marked Price MP = 140. Selling Price SP = 140 * (1 - 0.25) = 140 * 0.75 = 105. Net Profit = 105 - 100 = 5%.', 'ஒரு கடைக்காரர் அடக்க விலையை விட 40% அதிகமாகக் குறித்து, குறித்த விலையில் 25% தள்ளுபடி தருகிறார் எனில் அவரின் நிகர இலாப சதவீதம் என்ன?', 'அடக்க விலை = 100 எனில் குறித்த விலை = 140. விற்பனை விலை = 140 * 0.75 = 105. இலாபம் = 5%.');
INSERT IGNORE INTO question_options (id, question_id, option_key, option_text, is_correct, explanation) VALUES ('opt_q8_a', 'q_ssc_01', 'A', '5% Profit', 1, NULL);
INSERT IGNORE INTO question_options (id, question_id, option_key, option_text, is_correct, explanation) VALUES ('opt_q8_b', 'q_ssc_01', 'B', '5% Loss', 0, NULL);
INSERT IGNORE INTO question_options (id, question_id, option_key, option_text, is_correct, explanation) VALUES ('opt_q8_c', 'q_ssc_01', 'C', '15% Profit', 0, NULL);
INSERT IGNORE INTO question_options (id, question_id, option_key, option_text, is_correct, explanation) VALUES ('opt_q8_d', 'q_ssc_01', 'D', '10% Loss', 0, NULL);
INSERT IGNORE INTO questions (id, topic_id, exam_id, question_text, question_type, difficulty_level, is_pyq, pyq_year, pyq_source, explanation, tamil_text, tamil_explanation) VALUES ('q_ssc_02', 'top_ssc_syllogism', 'exam_ssc_cgl', 'Statements:
1. All Rivers are Water.
2. Some Water are Lakes.
Conclusions:
I. Some Rivers are Lakes.
II. No River is a Lake.', 'mcq', 'medium', 1, 2023, 'SSC CGL Tier-I', 'Since Rivers are inside Water and Lakes overlap with Water, Rivers and Lakes may or may not intersect. Conclusion I is affirmative and Conclusion II is negative with same elements. Hence, Either Conclusion I or II follows.', 'கூற்றுகள்:
1. அனைத்து ஆறுகளும் நீர்.
2. சில நீர் ஏரிகள்.
முடிவுகள்:
I. சில ஆறுகள் ஏரிகள்.
II. எந்த ஆறும் ஏரி அல்ல.', 'ஆறுகளுக்கும் ஏரிகளுக்கும் நேரடி தொடர்பு குறிப்பிடப்படாததால், முடிவு I அல்லது II இவற்றில் ஏதேனும் ஒன்று சரியாகும் (Either I or II).');
INSERT IGNORE INTO question_options (id, question_id, option_key, option_text, is_correct, explanation) VALUES ('opt_q9_a', 'q_ssc_02', 'A', 'Only conclusion I follows', 0, NULL);
INSERT IGNORE INTO question_options (id, question_id, option_key, option_text, is_correct, explanation) VALUES ('opt_q9_b', 'q_ssc_02', 'B', 'Only conclusion II follows', 0, NULL);
INSERT IGNORE INTO question_options (id, question_id, option_key, option_text, is_correct, explanation) VALUES ('opt_q9_c', 'q_ssc_02', 'C', 'Either conclusion I or II follows', 1, NULL);
INSERT IGNORE INTO question_options (id, question_id, option_key, option_text, is_correct, explanation) VALUES ('opt_q9_d', 'q_ssc_02', 'D', 'Neither I nor II follows', 0, NULL);

-- 6. Tests & Test Questions
INSERT IGNORE INTO tests (id, exam_id, title, description, test_type, duration_minutes, total_marks, passing_marks, is_adaptive, is_published) VALUES ('test_upsc_polity_adaptive', 'exam_upsc_cse', 'UPSC CSE All-India Adaptive Test: Indian Polity & Constitutional Foundations', 'Dynamic difficulty test assessing Articles 12-51A, Parliament, and Judiciary with real-time error taxonomy classification.', 'adaptive_test', 45, 50, NULL, 1, NULL);
INSERT IGNORE INTO tests (id, exam_id, title, description, test_type, duration_minutes, total_marks, passing_marks, is_adaptive, is_published) VALUES ('test_tnpsc_full_mock', 'exam_tnpsc_grp2', 'TNPSC Group 2 Comprehensive Mock Test (Units 8, 9 & Aptitude)', 'Standard simulated exam interface replicating the official TNPSC Group 2 Preliminary examination standard.', 'mock', 60, 100, NULL, 0, NULL);
INSERT IGNORE INTO tests (id, exam_id, title, description, test_type, duration_minutes, total_marks, passing_marks, is_adaptive, is_published) VALUES ('test_ssc_cgl_speed_drill', 'exam_ssc_cgl', 'SSC CGL Tier-I Quantitative & Reasoning Speed Marathon', 'Time-pressured section focusing on pacing, error reduction, and calculation speed.', 'mock', 30, 50, NULL, 0, NULL);

-- 7. Demo Users & Profiles
INSERT IGNORE INTO users (id, name, email, password_hash, role, preferred_language) VALUES ('usr_demo_prof_01', 'Karthik Raja', 'prof@example.com', '$2b$10$v0PCE4iZE0OcufhRXg0nSeXjkD9MFwE93xvbVq3m/N7zBromD.l8y', 'user', 'en');
INSERT IGNORE INTO users (id, name, email, password_hash, role, preferred_language) VALUES ('usr_demo_stud_02', 'Priya Sundaram', 'student@example.com', '$2b$10$v0PCE4iZE0OcufhRXg0nSeXjkD9MFwE93xvbVq3m/N7zBromD.l8y', 'user', 'en');
INSERT IGNORE INTO users (id, name, email, password_hash, role, preferred_language) VALUES ('usr_demo_home_03', 'Ananya Sharma', 'homemaker@example.com', '$2b$10$v0PCE4iZE0OcufhRXg0nSeXjkD9MFwE93xvbVq3m/N7zBromD.l8y', 'user', 'en');
INSERT IGNORE INTO users (id, name, email, password_hash, role, preferred_language) VALUES ('usr_admin_01', 'System Admin', 'admin@example.com', '$2b$10$v0PCE4iZE0OcufhRXg0nSeaQqKbIB92wd.ZKzFFvIQzapKYXe0JWu', 'admin', 'en');
INSERT IGNORE INTO user_profiles (id, user_id, user_type, target_exam_id, exam_date, preparation_level, previous_attempts, daily_hours_weekday, daily_hours_weekend, preferred_study_timings, learning_style, strong_subjects, weak_subjects, current_syllabus_completion) VALUES ('prof_karthik', 'usr_demo_prof_01', 'working_professional', 'exam_tnpsc_grp2', '2026-11-20', 'intermediate', 1, 2, 5.5, 'early_morning,late_night', 'practical_mcq', '["Aptitude & Reasoning","Modern History"]', '["Indian Economy","Tamil Administration"]', 42.5);
INSERT IGNORE INTO email_preferences (id, user_id, daily_study_plan_email, revision_reminder_email, upcoming_test_email, missed_session_email, current_affairs_digest_email) VALUES ('ep_usr_demo_prof_01', 'usr_demo_prof_01', 1, 1, 1, 1, 1);
INSERT IGNORE INTO user_profiles (id, user_id, user_type, target_exam_id, exam_date, preparation_level, previous_attempts, daily_hours_weekday, daily_hours_weekend, preferred_study_timings, learning_style, strong_subjects, weak_subjects, current_syllabus_completion) VALUES ('prof_priya', 'usr_demo_stud_02', 'student', 'exam_upsc_cse', '2026-05-24', 'advanced', 0, 7, 8, 'morning,afternoon,evening', 'visual_practical', '["Indian Polity","Modern History"]', '["Environment & Ecology","International Relations"]', 68);
INSERT IGNORE INTO email_preferences (id, user_id, daily_study_plan_email, revision_reminder_email, upcoming_test_email, missed_session_email, current_affairs_digest_email) VALUES ('ep_usr_demo_stud_02', 'usr_demo_stud_02', 1, 1, 1, 1, 1);
INSERT IGNORE INTO user_profiles (id, user_id, user_type, target_exam_id, exam_date, preparation_level, previous_attempts, daily_hours_weekday, daily_hours_weekend, preferred_study_timings, learning_style, strong_subjects, weak_subjects, current_syllabus_completion) VALUES ('prof_ananya', 'usr_demo_home_03', 'homemaker', 'exam_ssc_cgl', '2026-09-15', 'beginner', 0, 3, 4, 'morning,afternoon', 'revision_focused', '["General English","General Awareness"]', '["Quantitative Aptitude","Reasoning"]', 25);
INSERT IGNORE INTO email_preferences (id, user_id, daily_study_plan_email, revision_reminder_email, upcoming_test_email, missed_session_email, current_affairs_digest_email) VALUES ('ep_usr_demo_home_03', 'usr_demo_home_03', 1, 1, 1, 1, 1);

-- 8. Current Affairs
INSERT IGNORE INTO current_affairs (id, title, summary, detailed_analysis, source_name, source_url, category, published_date, exam_relevance_tags) VALUES ('ca_01_rbi_mpc', 'RBI Monetary Policy Committee Decides on Policy Repo Rate & Liquidity Corridor', 'The RBI MPC maintained the Repo Rate at 6.50% while emphasizing continued alignment of inflation with the 4% target on a durable basis.', 'The Monetary Policy Committee reiterated its stance on withdrawal of accommodation. Key focus areas included food inflation volatility, domestic growth momentum, and the SDF liquidity absorption mechanism.', 'Press Information Bureau (PIB) / Reserve Bank of India', 'https://rbi.org.in/pressreleases', 'Economy', '2026-08-20', '["UPSC GS3 Economy","TNPSC Economy","Banking Financial Awareness","SSC General Awareness"]');
INSERT IGNORE INTO current_affairs (id, title, summary, detailed_analysis, source_name, source_url, category, published_date, exam_relevance_tags) VALUES ('ca_02_sc_verdict_subclassification', 'Supreme Court 7-Judge Constitution Bench Upholds Sub-Classification in Scheduled Castes', 'A landmark 6:1 majority ruling affirmed that States possess constitutional competence under Articles 14, 15, and 16 to sub-classify Scheduled Castes to provide targeted affirmative action.', 'The Court held that sub-classification does not violate Article 341 of the Constitution as long as empirical data demonstrates inadequate representation of the sub-group without 100% exclusion.', 'Supreme Court of India Official Judgment Records', 'https://main.sci.gov.in/judgments', 'Polity & Governance', '2026-08-15', '["UPSC GS2 Polity","TNPSC Unit 9 Administration","State PSC Legal Studies"]');
INSERT IGNORE INTO current_affairs (id, title, summary, detailed_analysis, source_name, source_url, category, published_date, exam_relevance_tags) VALUES ('ca_03_tn_green_energy', 'Tamil Nadu Launches Comprehensive Offshore Wind & Green Hydrogen Valley Mission', 'Tamil Nadu government notified policy incentives to develop 4 GW offshore wind infrastructure in the Gulf of Mannar and establish India’s first port-anchored Green Hydrogen hub in Thoothukudi.', 'This directly aligns with Tamil Nadu’s target of achieving a $1 Trillion economy and 50% renewable energy capacity by 2030, reinforcing Unit 9 development administration goals.', 'Department of Energy, Govt of Tamil Nadu', 'https://tn.gov.in/pressrelease', 'Environment', '2026-08-10', '["TNPSC Unit 9","UPSC GS3 Environment & Economy","SSC General Awareness"]');

SET FOREIGN_KEY_CHECKS = 1;
