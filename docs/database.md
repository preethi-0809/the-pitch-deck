# Database Architecture & Schema Documentation

## Database Engines
- **Default (Embedded Zero-Config)**: High-performance SQLite database via Node 24 standard library `node:sqlite`.
- **Enterprise Production (MySQL 8.x)**: Full MySQL schema DDL and seed migration dump provided:
  - DDL Schema: `database/schema/mysql_schema.sql` (InnoDB, utf8mb4)
  - Full Seed Dump: `database/schema/mysql_full_dump.sql`
  - Automated Setup Script: `npm run db:init-mysql` (or `node backend/src/config/initMysql.js`)
  - Dump Generator: `npm run db:export-mysql` (or `node database/seed/exportMysqlDump.js`)

## Entity Relationship Overview
- `users` (1:1) `user_profiles`
- `exams` (1:N) `subjects` (1:N) `topics`
- `topics` (1:N) `questions` (1:N) `question_options`
- `tests` (N:M) `questions` via `test_questions`
- `users` (1:N) `test_attempts` (1:N) `test_answers`
- `users` (1:N) `study_plans` (1:N) `study_tasks`
- `users` (1:N) `revision_schedules`
- `users` (1:N) `user_mistakes`
- `users` (1:N) `performance_analytics`
- `current_affairs` (N:M) `topics` via `current_affairs_topics`
- `users` (1:1) `email_preferences`
- `users` (1:N) `email_logs`
- `users` (1:N) `ai_coach_logs`
