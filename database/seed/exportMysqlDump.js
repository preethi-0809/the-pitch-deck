const fs = require('fs');
const path = require('path');
const { getSeedData } = require('./seedData');

function escapeSql(val) {
  if (val === null || val === undefined) return 'NULL';
  if (typeof val === 'number') return val;
  if (typeof val === 'boolean') return val ? 1 : 0;
  return `'${String(val).replace(/'/g, "''").replace(/\\/g, '\\\\')}'`;
}

async function generateMysqlDump() {
  const data = await getSeedData();
  const schemaPath = path.join(__dirname, '../schema/mysql_schema.sql');
  const ddl = fs.readFileSync(schemaPath, 'utf8');

  let sql = `-- =========================================================\n`;
  sql += `-- PrepAI - Complete MySQL Database Migration & Seed Dump\n`;
  sql += `-- Engine: InnoDB | Charset: utf8mb4 | Auto-generated\n`;
  sql += `-- =========================================================\n\n`;
  sql += ddl;
  sql += `\n\n-- =========================================================\n`;
  sql += `-- SEED DATA INSERTION (MySQL Compatible)\n`;
  sql += `-- =========================================================\n\n`;
  sql += `SET FOREIGN_KEY_CHECKS = 0;\n\n`;

  // 1. Exams
  sql += `-- 1. Exams\n`;
  for (const e of data.exams) {
    sql += `INSERT IGNORE INTO exams (id, code, name, category, description, total_marks, duration_minutes) VALUES (${escapeSql(e.id)}, ${escapeSql(e.code)}, ${escapeSql(e.name)}, ${escapeSql(e.category)}, ${escapeSql(e.description)}, ${escapeSql(e.total_marks)}, ${escapeSql(e.duration_minutes)});\n`;
  }
  sql += `\n`;

  // 2. Subjects
  sql += `-- 2. Subjects\n`;
  for (const s of data.subjects) {
    sql += `INSERT IGNORE INTO subjects (id, exam_id, name, code, description, icon, weightage_percentage, display_order) VALUES (${escapeSql(s.id)}, ${escapeSql(s.exam_id)}, ${escapeSql(s.name)}, ${escapeSql(s.code)}, ${escapeSql(s.description)}, ${escapeSql(s.icon)}, ${escapeSql(s.weightage_percentage)}, ${escapeSql(s.display_order)});\n`;
  }
  sql += `\n`;

  // 3. Topics
  sql += `-- 3. Topics\n`;
  for (const t of data.topics) {
    sql += `INSERT IGNORE INTO topics (id, subject_id, name, code, description, difficulty_level, pyq_importance_score, estimated_hours, display_order) VALUES (${escapeSql(t.id)}, ${escapeSql(t.subject_id)}, ${escapeSql(t.name)}, ${escapeSql(t.code)}, ${escapeSql(t.description)}, ${escapeSql(t.difficulty_level)}, ${escapeSql(t.pyq_importance_score)}, ${escapeSql(t.estimated_hours)}, ${escapeSql(t.display_order)});\n`;
  }
  sql += `\n`;

  // 4. Study Materials
  sql += `-- 4. Study Materials\n`;
  for (const m of data.studyMaterials) {
    sql += `INSERT IGNORE INTO study_materials (id, topic_id, title, content_type, content, language, source_authority) VALUES (${escapeSql(m.id)}, ${escapeSql(m.topic_id)}, ${escapeSql(m.title)}, ${escapeSql(m.content_type)}, ${escapeSql(m.content)}, ${escapeSql(m.language)}, ${escapeSql(m.source_authority)});\n`;
  }
  sql += `\n`;

  // 5. Questions & Options
  sql += `-- 5. Questions & Options\n`;
  for (const q of data.questions) {
    sql += `INSERT IGNORE INTO questions (id, topic_id, exam_id, question_text, question_type, difficulty_level, is_pyq, pyq_year, pyq_source, explanation, tamil_text, tamil_explanation) VALUES (${escapeSql(q.id)}, ${escapeSql(q.topic_id)}, ${escapeSql(q.exam_id)}, ${escapeSql(q.question_text)}, ${escapeSql(q.question_type)}, ${escapeSql(q.difficulty_level)}, ${escapeSql(q.is_pyq)}, ${escapeSql(q.pyq_year)}, ${escapeSql(q.pyq_source)}, ${escapeSql(q.explanation)}, ${escapeSql(q.tamil_text)}, ${escapeSql(q.tamil_explanation)});\n`;

    if (q.options) {
      for (const opt of q.options) {
        sql += `INSERT IGNORE INTO question_options (id, question_id, option_key, option_text, is_correct, explanation) VALUES (${escapeSql(opt.id)}, ${escapeSql(q.id)}, ${escapeSql(opt.option_key)}, ${escapeSql(opt.option_text)}, ${escapeSql(opt.is_correct)}, ${escapeSql(opt.explanation || null)});\n`;
      }
    }
  }
  sql += `\n`;

  // 6. Mock Tests
  sql += `-- 6. Tests & Test Questions\n`;
  for (const t of data.tests) {
    sql += `INSERT IGNORE INTO tests (id, exam_id, title, description, test_type, duration_minutes, total_marks, passing_marks, is_adaptive, is_published) VALUES (${escapeSql(t.id)}, ${escapeSql(t.exam_id)}, ${escapeSql(t.title)}, ${escapeSql(t.description)}, ${escapeSql(t.test_type)}, ${escapeSql(t.duration_minutes)}, ${escapeSql(t.total_marks)}, ${escapeSql(t.passing_marks)}, ${escapeSql(t.is_adaptive)}, ${escapeSql(t.is_published)});\n`;
  }
  sql += `\n`;

  // 7. Users & User Profiles
  sql += `-- 7. Demo Users & Profiles\n`;
  for (const u of data.users) {
    sql += `INSERT IGNORE INTO users (id, name, email, password_hash, role, preferred_language) VALUES (${escapeSql(u.id)}, ${escapeSql(u.name)}, ${escapeSql(u.email)}, ${escapeSql(u.password_hash)}, ${escapeSql(u.role)}, ${escapeSql(u.preferred_language)});\n`;
  }
  for (const p of data.profiles) {
    sql += `INSERT IGNORE INTO user_profiles (id, user_id, user_type, target_exam_id, exam_date, preparation_level, previous_attempts, daily_hours_weekday, daily_hours_weekend, preferred_study_timings, learning_style, strong_subjects, weak_subjects, current_syllabus_completion) VALUES (${escapeSql(p.id)}, ${escapeSql(p.user_id)}, ${escapeSql(p.user_type)}, ${escapeSql(p.target_exam_id)}, ${escapeSql(p.exam_date)}, ${escapeSql(p.preparation_level)}, ${escapeSql(p.previous_attempts)}, ${escapeSql(p.daily_hours_weekday)}, ${escapeSql(p.daily_hours_weekend)}, ${escapeSql(p.preferred_study_timings)}, ${escapeSql(p.learning_style)}, ${escapeSql(p.strong_subjects)}, ${escapeSql(p.weak_subjects)}, ${escapeSql(p.current_syllabus_completion)});\n`;

    sql += `INSERT IGNORE INTO email_preferences (id, user_id, daily_study_plan_email, revision_reminder_email, upcoming_test_email, missed_session_email, current_affairs_digest_email) VALUES (${escapeSql(`ep_${p.user_id}`)}, ${escapeSql(p.user_id)}, 1, 1, 1, 1, 1);\n`;
  }
  sql += `\n`;

  // 8. Current Affairs
  sql += `-- 8. Current Affairs\n`;
  for (const ca of data.currentAffairs) {
    sql += `INSERT IGNORE INTO current_affairs (id, title, summary, detailed_analysis, source_name, source_url, category, published_date, exam_relevance_tags) VALUES (${escapeSql(ca.id)}, ${escapeSql(ca.title)}, ${escapeSql(ca.summary)}, ${escapeSql(ca.detailed_analysis)}, ${escapeSql(ca.source_name)}, ${escapeSql(ca.source_url)}, ${escapeSql(ca.category)}, ${escapeSql(ca.published_date)}, ${escapeSql(typeof ca.exam_relevance_tags === 'string' ? ca.exam_relevance_tags : JSON.stringify(ca.exam_relevance_tags))});\n`;
  }

  sql += `\nSET FOREIGN_KEY_CHECKS = 1;\n`;

  const outputPath = path.join(__dirname, '../schema/mysql_full_dump.sql');
  fs.writeFileSync(outputPath, sql, 'utf8');
  console.log(`✅ Successfully generated MySQL Full Dump at: ${outputPath}`);
}

if (require.main === module) {
  generateMysqlDump();
}

module.exports = { generateMysqlDump };
