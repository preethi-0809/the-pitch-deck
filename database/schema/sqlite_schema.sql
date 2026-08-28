-- Government Exam AI Platform SQLite Schema

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT DEFAULT 'user', -- 'user' | 'admin'
  preferred_language TEXT DEFAULT 'en', -- 'en' | 'ta'
  is_active INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. User Profiles Table (Smart Onboarding)
CREATE TABLE IF NOT EXISTS user_profiles (
  id TEXT PRIMARY KEY,
  user_id TEXT UNIQUE NOT NULL,
  user_type TEXT NOT NULL, -- 'student' | 'working_professional' | 'graduate_job_seeker' | 'homemaker' | 'general'
  target_exam_id TEXT NOT NULL,
  exam_date DATE,
  preparation_level TEXT DEFAULT 'beginner', -- 'beginner' | 'intermediate' | 'advanced'
  previous_attempts INTEGER DEFAULT 0,
  daily_hours_weekday REAL DEFAULT 2.0,
  daily_hours_weekend REAL DEFAULT 4.0,
  preferred_study_timings TEXT DEFAULT 'morning,evening',
  learning_style TEXT DEFAULT 'visual_practical', -- 'reading' | 'practical_mcq' | 'visual_practical' | 'revision_focused'
  strong_subjects TEXT, -- JSON array of subject IDs / names
  weak_subjects TEXT,   -- JSON array of subject IDs / names
  current_syllabus_completion REAL DEFAULT 0.0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 3. Exams Table
CREATE TABLE IF NOT EXISTS exams (
  id TEXT PRIMARY KEY,
  code TEXT UNIQUE NOT NULL, -- 'UPSC_CSE', 'SSC_CGL', 'TNPSC_GRP2', 'BANK_PO', 'RRB_NTPC', 'STATE_PSC'
  name TEXT NOT NULL,
  organization TEXT, -- 'Union Public Service Commission', 'Staff Selection Commission', 'TNPSC', 'IBPS', etc.
  category TEXT NOT NULL, -- 'UPSC', 'SSC', 'Railways', 'Banking', 'Defence', 'State PSC', 'Teaching', 'Technical', 'Insurance', 'Judiciary', 'Healthcare'
  sub_category TEXT,
  qualification TEXT, -- '10th', '12th', 'Diploma', 'Any Degree', 'B.E/B.Tech', 'Postgraduate', 'Law Degree', 'MBBS / Nursing'
  degree_required TEXT, -- 'Any Graduate', 'Engineering (B.E/B.Tech)', 'B.Sc Nursing / GNM', 'LL.B', 'B.Ed / D.El.Ed'
  age_min INTEGER DEFAULT 18,
  age_max INTEGER DEFAULT 32,
  salary_min INTEGER DEFAULT 25000,
  salary_max INTEGER DEFAULT 80000,
  pay_level TEXT, -- 'Level 7 (₹44,900 - ₹1,42,400)', 'Level 10', etc.
  in_hand_salary TEXT, -- '₹55,000 - ₹70,000 / month'
  difficulty TEXT DEFAULT 'intermediate', -- 'beginner' | 'intermediate' | 'hard'
  frequency TEXT DEFAULT 'Annual', -- 'Annual' | 'Bi-annual' | 'Periodic' | 'As announced'
  job_type TEXT DEFAULT 'Non-Technical', -- 'Technical' | 'Non-Technical' | 'Administrative' | 'Uniformed / Defence' | 'Police' | 'Teaching' | 'Judicial' | 'Medical'
  state TEXT DEFAULT 'All India', -- 'All India' | 'Tamil Nadu' | 'Karnataka' | 'Maharashtra' | 'Uttar Pradesh' | etc.
  description TEXT,
  selection_process TEXT, -- JSON array of steps e.g. ["Prelims (Objective)", "Mains (Descriptive)", "Interview"]
  exam_pattern_summary TEXT,
  official_url TEXT,
  last_verified DATE DEFAULT (DATE('now')),
  status TEXT DEFAULT 'Upcoming', -- 'Upcoming' | 'Ongoing' | 'Completed'
  is_popular INTEGER DEFAULT 0,
  is_featured INTEGER DEFAULT 0,
  total_marks INTEGER,
  duration_minutes INTEGER,
  is_active INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 4. Subjects Table
CREATE TABLE IF NOT EXISTS subjects (
  id TEXT PRIMARY KEY,
  exam_id TEXT NOT NULL,
  name TEXT NOT NULL,
  code TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  weightage_percentage REAL DEFAULT 0.0,
  display_order INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (exam_id) REFERENCES exams(id) ON DELETE CASCADE
);

-- 5. Topics Table
CREATE TABLE IF NOT EXISTS topics (
  id TEXT PRIMARY KEY,
  subject_id TEXT NOT NULL,
  name TEXT NOT NULL,
  code TEXT,
  description TEXT,
  difficulty_level TEXT DEFAULT 'medium', -- 'easy' | 'medium' | 'hard'
  pyq_importance_score REAL DEFAULT 7.5, -- 1-10
  estimated_hours REAL DEFAULT 3.0,
  display_order INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE
);

-- 6. Syllabus Table (Progress Tracking)
CREATE TABLE IF NOT EXISTS user_syllabus_progress (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  topic_id TEXT NOT NULL,
  status TEXT DEFAULT 'pending', -- 'pending' | 'in_progress' | 'completed' | 'revised'
  mastery_percentage REAL DEFAULT 0.0,
  hours_spent REAL DEFAULT 0.0,
  last_studied_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, topic_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (topic_id) REFERENCES topics(id) ON DELETE CASCADE
);

-- 7. Study Materials Table
CREATE TABLE IF NOT EXISTS study_materials (
  id TEXT PRIMARY KEY,
  topic_id TEXT NOT NULL,
  title TEXT NOT NULL,
  content_type TEXT DEFAULT 'notes', -- 'notes' | 'summary' | 'key_facts' | 'cheat_sheet' | 'formulae'
  content TEXT NOT NULL,
  language TEXT DEFAULT 'en',
  source_authority TEXT, -- 'PIB', 'NCERT', 'Govt Gazette', 'Laxmikanth Reference', 'Official Syllabus'
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (topic_id) REFERENCES topics(id) ON DELETE CASCADE
);

-- 8. Questions Table
CREATE TABLE IF NOT EXISTS questions (
  id TEXT PRIMARY KEY,
  topic_id TEXT NOT NULL,
  exam_id TEXT NOT NULL,
  question_text TEXT NOT NULL,
  question_type TEXT DEFAULT 'mcq', -- 'mcq' | 'descriptive' | 'assertion_reason' | 'true_false'
  difficulty_level TEXT DEFAULT 'medium', -- 'easy' | 'medium' | 'hard'
  explanation TEXT NOT NULL,
  tamil_text TEXT,
  tamil_explanation TEXT,
  is_pyq INTEGER DEFAULT 0,
  pyq_year INTEGER,
  pyq_source TEXT,
  created_by TEXT DEFAULT 'system', -- 'system' | 'ai_generated' | 'admin'
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (topic_id) REFERENCES topics(id) ON DELETE CASCADE,
  FOREIGN KEY (exam_id) REFERENCES exams(id) ON DELETE CASCADE
);

-- 9. Question Options Table
CREATE TABLE IF NOT EXISTS question_options (
  id TEXT PRIMARY KEY,
  question_id TEXT NOT NULL,
  option_key TEXT NOT NULL, -- 'A', 'B', 'C', 'D'
  option_text TEXT NOT NULL,
  tamil_option_text TEXT,
  is_correct INTEGER DEFAULT 0,
  FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
);

-- 10. Tests Table
CREATE TABLE IF NOT EXISTS tests (
  id TEXT PRIMARY KEY,
  exam_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  test_type TEXT DEFAULT 'mock', -- 'mock' | 'topic_quiz' | 'subject_test' | 'adaptive_test' | 'pyq_test'
  duration_minutes INTEGER DEFAULT 60,
  total_marks REAL DEFAULT 100.0,
  pass_percentage REAL DEFAULT 40.0,
  is_adaptive INTEGER DEFAULT 0,
  is_active INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (exam_id) REFERENCES exams(id) ON DELETE CASCADE
);

-- 11. Test Questions Map
CREATE TABLE IF NOT EXISTS test_questions (
  id TEXT PRIMARY KEY,
  test_id TEXT NOT NULL,
  question_id TEXT NOT NULL,
  marks REAL DEFAULT 2.0,
  negative_marks REAL DEFAULT 0.66,
  display_order INTEGER DEFAULT 1,
  FOREIGN KEY (test_id) REFERENCES tests(id) ON DELETE CASCADE,
  FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
);

-- 12. Test Attempts Table
CREATE TABLE IF NOT EXISTS test_attempts (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  test_id TEXT NOT NULL,
  score REAL DEFAULT 0.0,
  total_marks REAL DEFAULT 0.0,
  percentage REAL DEFAULT 0.0,
  total_questions INTEGER DEFAULT 0,
  attempted_count INTEGER DEFAULT 0,
  correct_count INTEGER DEFAULT 0,
  incorrect_count INTEGER DEFAULT 0,
  unanswered_count INTEGER DEFAULT 0,
  accuracy REAL DEFAULT 0.0,
  time_taken_seconds INTEGER DEFAULT 0,
  completed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (test_id) REFERENCES tests(id) ON DELETE CASCADE
);

-- 13. Test Answers Table
CREATE TABLE IF NOT EXISTS test_answers (
  id TEXT PRIMARY KEY,
  attempt_id TEXT NOT NULL,
  question_id TEXT NOT NULL,
  selected_option_key TEXT,
  is_correct INTEGER DEFAULT 0,
  time_spent_seconds INTEGER DEFAULT 0,
  mistake_tag TEXT, -- 'concept_gap' | 'memory_issue' | 'confusion' | 'misreading' | 'careless' | 'guessing' | 'time_management'
  FOREIGN KEY (attempt_id) REFERENCES test_attempts(id) ON DELETE CASCADE,
  FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
);

-- 14. Performance Analytics Table
CREATE TABLE IF NOT EXISTS performance_analytics (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  subject_id TEXT NOT NULL,
  tests_taken INTEGER DEFAULT 0,
  total_questions_attempted INTEGER DEFAULT 0,
  total_correct INTEGER DEFAULT 0,
  average_accuracy REAL DEFAULT 0.0,
  average_speed_seconds REAL DEFAULT 0.0,
  mastery_level TEXT DEFAULT 'developing', -- 'weak' | 'developing' | 'competent' | 'mastered'
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, subject_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE
);

-- 15. User Weaknesses & Mistakes
CREATE TABLE IF NOT EXISTS user_mistakes (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  topic_id TEXT NOT NULL,
  question_id TEXT,
  mistake_type TEXT NOT NULL, -- 'concept_gap' | 'memory_issue' | 'confusion' | 'misreading' | 'careless' | 'guessing' | 'time_management'
  notes TEXT,
  frequency_count INTEGER DEFAULT 1,
  last_occurred_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  status TEXT DEFAULT 'active', -- 'active' | 'under_revision' | 'resolved'
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (topic_id) REFERENCES topics(id) ON DELETE CASCADE
);

-- 16. Study Plans Table
CREATE TABLE IF NOT EXISTS study_plans (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  plan_date DATE NOT NULL,
  status TEXT DEFAULT 'active', -- 'active' | 'completed' | 'missed' | 'adjusted'
  total_planned_minutes INTEGER DEFAULT 120,
  total_completed_minutes INTEGER DEFAULT 0,
  generated_by TEXT DEFAULT 'ai_study_planner',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 17. Study Tasks Table
CREATE TABLE IF NOT EXISTS study_tasks (
  id TEXT PRIMARY KEY,
  plan_id TEXT NOT NULL,
  topic_id TEXT NOT NULL,
  task_type TEXT NOT NULL, -- 'learn' | 'practice_mcq' | 'pyq' | 'revision' | 'current_affairs' | 'mock_test'
  title TEXT NOT NULL,
  description TEXT,
  planned_duration_minutes INTEGER DEFAULT 30,
  completed_duration_minutes INTEGER DEFAULT 0,
  is_completed INTEGER DEFAULT 0,
  priority TEXT DEFAULT 'high', -- 'high' | 'medium' | 'low'
  due_time_slot TEXT DEFAULT 'morning', -- 'morning' | 'afternoon' | 'evening' | 'night'
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (plan_id) REFERENCES study_plans(id) ON DELETE CASCADE,
  FOREIGN KEY (topic_id) REFERENCES topics(id) ON DELETE CASCADE
);

-- 18. Revision Schedules Table
CREATE TABLE IF NOT EXISTS revision_schedules (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  topic_id TEXT NOT NULL,
  revision_interval_stage INTEGER DEFAULT 1, -- 1 (day 1), 2 (day 3), 3 (day 7), 4 (day 21), 5 (day 60)
  scheduled_date DATE NOT NULL,
  status TEXT DEFAULT 'pending', -- 'pending' | 'completed' | 'overdue'
  priority TEXT DEFAULT 'normal', -- 'urgent' | 'high' | 'normal'
  reason TEXT DEFAULT 'spaced_repetition', -- 'spaced_repetition' | 'mistake_trigger' | 'exam_proximity'
  completed_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (topic_id) REFERENCES topics(id) ON DELETE CASCADE
);

-- 19. Current Affairs Table
CREATE TABLE IF NOT EXISTS current_affairs (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  detailed_analysis TEXT,
  category TEXT NOT NULL, -- 'Economy', 'Polity & Governance', 'Science & Tech', 'Environment', 'International Relations', 'Schemes & Policies'
  source_name TEXT NOT NULL, -- 'PIB Delhi', 'RBI Bulletin', 'The Hindu / Indian Express', 'Ministry of Finance', 'Official Gazette'
  source_url TEXT,
  is_verified INTEGER DEFAULT 1,
  verification_notes TEXT,
  exam_relevance_tags TEXT, -- JSON array of tags e.g. ["UPSC GS3", "TNPSC Economy", "SSC GA", "Banking Awareness"]
  published_date DATE NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 20. Current Affairs to Topics Link
CREATE TABLE IF NOT EXISTS current_affairs_topics (
  id TEXT PRIMARY KEY,
  current_affair_id TEXT NOT NULL,
  topic_id TEXT NOT NULL,
  FOREIGN KEY (current_affair_id) REFERENCES current_affairs(id) ON DELETE CASCADE,
  FOREIGN KEY (topic_id) REFERENCES topics(id) ON DELETE CASCADE
);

-- 21. AI Recommendations & Coach Logs
CREATE TABLE IF NOT EXISTS ai_coach_logs (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  agent_name TEXT NOT NULL, -- 'ExamCoachAgent', 'StrategyAgent', 'WeaknessAgent', etc.
  message_type TEXT NOT NULL, -- 'user_query' | 'ai_response' | 'auto_recommendation' | 'alert'
  user_message TEXT,
  ai_response TEXT NOT NULL,
  structured_data TEXT, -- JSON object
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 22. Email Preferences & Logs
CREATE TABLE IF NOT EXISTS email_preferences (
  id TEXT PRIMARY KEY,
  user_id TEXT UNIQUE NOT NULL,
  daily_study_plan_email INTEGER DEFAULT 1,
  study_reminder_email INTEGER DEFAULT 1,
  revision_reminder_email INTEGER DEFAULT 1,
  upcoming_test_email INTEGER DEFAULT 1,
  missed_session_email INTEGER DEFAULT 1,
  current_affairs_digest_email INTEGER DEFAULT 1,
  ai_recommendation_email INTEGER DEFAULT 1,
  preferred_email_time TEXT DEFAULT '07:00',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 22. User Notification Preferences Table (Extended)
CREATE TABLE IF NOT EXISTS user_notification_preferences (
  id TEXT PRIMARY KEY,
  user_id TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  exam_notifications INTEGER DEFAULT 1,
  deadline_notifications INTEGER DEFAULT 1,
  exam_date_notifications INTEGER DEFAULT 1,
  admit_card_notifications INTEGER DEFAULT 1,
  result_notifications INTEGER DEFAULT 1,
  current_affairs_notifications INTEGER DEFAULT 1,
  recommendation_notifications INTEGER DEFAULT 1,
  preferred_state TEXT DEFAULT 'Tamil Nadu',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS email_logs (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  recipient_email TEXT NOT NULL,
  subject TEXT NOT NULL,
  email_type TEXT NOT NULL,
  status TEXT DEFAULT 'sent', -- 'sent' | 'queued' | 'failed'
  retry_count INTEGER DEFAULT 0,
  error_message TEXT,
  sent_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 22b. Notification Delivery Logs (For Deduplication & Audit)
CREATE TABLE IF NOT EXISTS notification_logs (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  notification_type TEXT NOT NULL, -- 'new_exam' | 'application_deadline' | 'exam_date' | 'admit_card' | 'result' | 'current_affairs' | 'recommendation'
  exam_id TEXT,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  sent_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  status TEXT DEFAULT 'sent', -- 'sent' | 'failed' | 'simulated'
  provider_message_id TEXT,
  error_message TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 23. Exam Dates & Timeline Table
CREATE TABLE IF NOT EXISTS exam_dates (
  id TEXT PRIMARY KEY,
  exam_id TEXT NOT NULL,
  cycle_name TEXT DEFAULT '2026 Recruitment Cycle',
  year INTEGER DEFAULT 2026,
  notification_date DATE,
  application_start DATE,
  application_end DATE,
  admit_card_date DATE,
  exam_date DATE,
  result_date DATE,
  interview_date DATE,
  final_result_date DATE,
  status TEXT DEFAULT 'Upcoming', -- 'Upcoming' | 'Application Open' | 'Admit Card Out' | 'Exam Ongoing' | 'Result Out'
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (exam_id) REFERENCES exams(id) ON DELETE CASCADE
);

-- 24. Saved / Bookmarked Exams
CREATE TABLE IF NOT EXISTS saved_exams (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  exam_id TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, exam_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (exam_id) REFERENCES exams(id) ON DELETE CASCADE
);

-- 25. Target Exams (Active Aspirant Preparation)
CREATE TABLE IF NOT EXISTS target_exams (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  exam_id TEXT NOT NULL,
  priority TEXT DEFAULT 'primary', -- 'primary' | 'secondary'
  target_year INTEGER DEFAULT 2026,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, exam_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (exam_id) REFERENCES exams(id) ON DELETE CASCADE
);

-- 26. Exam Notification Alerts Table
CREATE TABLE IF NOT EXISTS exam_notifications (
  id TEXT PRIMARY KEY,
  user_id TEXT, -- NULL for global/system notification
  exam_id TEXT,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  notification_type TEXT NOT NULL, -- 'notification_released' | 'application_deadline' | 'admit_card' | 'exam_date' | 'result_out' | 'system_alert'
  urgency TEXT DEFAULT 'normal', -- 'normal' | 'urgent' | 'critical'
  action_url TEXT,
  is_read INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (exam_id) REFERENCES exams(id) ON DELETE CASCADE
);

-- 27. Exam Study Roadmaps Table (30 / 60 / 90 Days)
CREATE TABLE IF NOT EXISTS exam_roadmaps (
  id TEXT PRIMARY KEY,
  exam_id TEXT NOT NULL,
  duration_days INTEGER DEFAULT 60, -- 30 | 60 | 90
  title TEXT NOT NULL,
  description TEXT,
  weekly_schedule TEXT NOT NULL, -- JSON array of week objects
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (exam_id) REFERENCES exams(id) ON DELETE CASCADE
);

-- 28. Structured Syllabus Hierarchy (Exam-Wise Stages, Subjects, Topics & Subtopics)
CREATE TABLE IF NOT EXISTS syllabus_hierarchy (
  id TEXT PRIMARY KEY,
  exam_id TEXT NOT NULL,
  stage TEXT NOT NULL DEFAULT 'Tier 1', -- 'Tier 1' | 'Tier 2' | 'Prelims' | 'Mains' | 'Paper 1' | 'Paper 2'
  subject TEXT NOT NULL,
  topic TEXT NOT NULL,
  subtopic TEXT,
  description TEXT,
  priority TEXT DEFAULT 'high', -- 'high' | 'medium' | 'foundation'
  pyq_weightage REAL DEFAULT 8.0,
  display_order INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (exam_id) REFERENCES exams(id) ON DELETE CASCADE
);

-- 29. Topic Detailed Notes (Concept, Formulas, Examples, Short Tricks, Mistakes, Revision, Practice)
CREATE TABLE IF NOT EXISTS topic_notes (
  id TEXT PRIMARY KEY,
  topic_id TEXT UNIQUE NOT NULL,
  exam_id TEXT NOT NULL,
  title TEXT NOT NULL,
  concept TEXT NOT NULL,
  formulas TEXT, -- JSON array or Markdown table
  examples TEXT, -- JSON array of solved step-by-step examples
  shortcuts TEXT, -- JSON array or markdown of speed tips & short tricks
  common_mistakes TEXT, -- JSON array of common pitfalls
  quick_revision TEXT NOT NULL, -- Key takeaway points
  practice_questions TEXT, -- JSON array of MCQs / PYQs
  source_authority TEXT DEFAULT 'Official Standard Textbook & Gazette Reference',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (exam_id) REFERENCES exams(id) ON DELETE CASCADE
);

-- 30. User Syllabus Progress Table (Topic Mastery & Status)
CREATE TABLE IF NOT EXISTS user_syllabus_progress (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  exam_id TEXT NOT NULL,
  topic_id TEXT NOT NULL,
  status TEXT DEFAULT 'not_started', -- 'not_started' | 'learning' | 'completed' | 'needs_revision'
  completion_percentage REAL DEFAULT 0.0,
  notes_bookmarked INTEGER DEFAULT 0,
  last_studied_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, topic_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (exam_id) REFERENCES exams(id) ON DELETE CASCADE
);

-- 31. RAG Current Affairs Knowledge Documents
CREATE TABLE IF NOT EXISTS ca_rag_documents (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  what_happened TEXT NOT NULL,
  why_important TEXT NOT NULL,
  key_facts TEXT NOT NULL, -- JSON array or bullet points of key facts (person, org, date, location, numbers)
  category TEXT NOT NULL DEFAULT 'National', -- 'National' | 'International' | 'Economy' | 'Banking' | 'Government Schemes' | 'Defence' | 'Science & Technology' | 'Environment' | 'Awards' | 'Appointments' | 'Sports' | 'Reports & Indexes' | 'Important Days' | 'State Current Affairs'
  published_date DATE NOT NULL,
  source_name TEXT NOT NULL, -- 'PIB Delhi', 'Reserve Bank of India', 'ISRO Media', 'DRDO Gazette', etc.
  source_url TEXT,
  retrieved_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  last_updated DATETIME DEFAULT CURRENT_TIMESTAMP,
  embedding TEXT, -- Vector embedding representation (JSON array of floats or simulated vector)
  relevance_score REAL DEFAULT 9.5,
  exam_relevance_tags TEXT, -- JSON array e.g. ["SSC CGL", "UPSC CSE", "RBI Grade B"]
  syllabus_topic_ids TEXT, -- JSON array of linked syllabus topic IDs
  mcqs TEXT, -- JSON array of grounded practice MCQs with explanations
  one_liners TEXT, -- JSON array of quick revision one-liners
  is_verified INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 32. Current Affairs Trusted Sources Registry (Admin Management)
CREATE TABLE IF NOT EXISTS ca_sources (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT DEFAULT 'rss', -- 'rss' | 'api' | 'gazette' | 'ministry'
  url TEXT NOT NULL,
  is_trusted INTEGER DEFAULT 1,
  category TEXT DEFAULT 'National',
  last_ingested_at DATETIME,
  documents_count INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active', -- 'active' | 'paused' | 'error'
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 33. User Current Affairs Progress & Bookmarks
CREATE TABLE IF NOT EXISTS user_ca_progress (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  ca_id TEXT NOT NULL,
  is_read INTEGER DEFAULT 0,
  is_bookmarked INTEGER DEFAULT 0,
  added_to_revision INTEGER DEFAULT 0,
  quiz_score INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, ca_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (ca_id) REFERENCES ca_rag_documents(id) ON DELETE CASCADE
);

-- 34. Exam Notification Events (Timeline & Lifecycle Events)
CREATE TABLE IF NOT EXISTS exam_notification_events (
  id TEXT PRIMARY KEY,
  exam_id TEXT NOT NULL,
  event_type TEXT NOT NULL, -- 'APPLICATION_OPEN', 'DEADLINE_7_DAYS', 'DEADLINE_3_DAYS', 'DEADLINE_1_DAY', 'APPLICATION_CLOSED', 'ADMIT_CARD_RELEASED', 'EXAM_7_DAYS', 'EXAM_1_DAY', 'EXAM_DAY', 'RESULT_RELEASED'
  event_date DATE NOT NULL,
  status TEXT DEFAULT 'pending', -- 'pending' | 'processed' | 'cancelled'
  metadata TEXT, -- JSON extra data
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (exam_id) REFERENCES exams(id) ON DELETE CASCADE
);

-- 35. User Notification Preferences (Channels, Triggers, Language, State)
CREATE TABLE IF NOT EXISTS user_notification_preferences (
  id TEXT PRIMARY KEY,
  user_id TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  application_open_notifications INTEGER DEFAULT 1,
  deadline_notifications INTEGER DEFAULT 1,
  exam_date_notifications INTEGER DEFAULT 1,
  exam_day_notifications INTEGER DEFAULT 1,
  admit_card_notifications INTEGER DEFAULT 1,
  result_notifications INTEGER DEFAULT 1,
  recommended_notifications INTEGER DEFAULT 1,
  current_affairs_notifications INTEGER DEFAULT 1,
  preferred_state TEXT DEFAULT 'Tamil Nadu',
  preferred_language TEXT DEFAULT 'en', -- 'en' | 'ta' | 'hi'
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 36. User Per-Exam Explicit Alert Subscriptions
CREATE TABLE IF NOT EXISTS user_exam_alerts (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  exam_id TEXT NOT NULL,
  is_enabled INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, exam_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (exam_id) REFERENCES exams(id) ON DELETE CASCADE
);

-- 37. Notification Logs (Delivery Audit & Deduplication)
CREATE TABLE IF NOT EXISTS notification_logs (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  exam_id TEXT,
  event_type TEXT NOT NULL,
  recipient_email TEXT NOT NULL,
  subject TEXT NOT NULL,
  language TEXT DEFAULT 'en',
  sent_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  status TEXT DEFAULT 'sent', -- 'sent' | 'failed' | 'pending' | 'retrying'
  error_message TEXT,
  provider_message_id TEXT,
  retry_count INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (exam_id) REFERENCES exams(id) ON DELETE SET NULL
);

-- INDEXES for High-Performance Queries
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_user ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_exams_category ON exams(category);
CREATE INDEX IF NOT EXISTS idx_exams_qualification ON exams(qualification);
CREATE INDEX IF NOT EXISTS idx_exams_status ON exams(status);
CREATE INDEX IF NOT EXISTS idx_exams_state ON exams(state);
CREATE INDEX IF NOT EXISTS idx_exam_dates_exam ON exam_dates(exam_id);
CREATE INDEX IF NOT EXISTS idx_exam_dates_app_end ON exam_dates(application_end);
CREATE INDEX IF NOT EXISTS idx_exam_dates_exam_date ON exam_dates(exam_date);
CREATE INDEX IF NOT EXISTS idx_saved_exams_user ON saved_exams(user_id);
CREATE INDEX IF NOT EXISTS idx_target_exams_user ON target_exams(user_id);
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
CREATE INDEX IF NOT EXISTS idx_syllabus_hierarchy_exam ON syllabus_hierarchy(exam_id);
CREATE INDEX IF NOT EXISTS idx_syllabus_hierarchy_subject ON syllabus_hierarchy(subject);
CREATE INDEX IF NOT EXISTS idx_topic_notes_topic ON topic_notes(topic_id);
CREATE INDEX IF NOT EXISTS idx_topic_notes_exam ON topic_notes(exam_id);
CREATE INDEX IF NOT EXISTS idx_user_syllabus_progress_user ON user_syllabus_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_syllabus_progress_exam ON user_syllabus_progress(exam_id);
CREATE INDEX IF NOT EXISTS idx_ca_rag_documents_date ON ca_rag_documents(published_date);
CREATE INDEX IF NOT EXISTS idx_ca_rag_documents_category ON ca_rag_documents(category);
CREATE INDEX IF NOT EXISTS idx_user_ca_progress_user ON user_ca_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_notification_events_exam_date ON exam_notification_events(exam_id, event_date);
CREATE INDEX IF NOT EXISTS idx_user_exam_alerts_user ON user_exam_alerts(user_id);
CREATE INDEX IF NOT EXISTS idx_notification_logs_user_event ON notification_logs(user_id, exam_id, event_type);


