const fs = require('fs');
const path = require('path');
const db = require('../backend/src/config/database');
const rawDb = db.getRawDb();

function getMySQLType(colName, sqliteType) {
  const name = colName.toLowerCase();
  const type = (sqliteType || 'TEXT').toUpperCase();

  if (name.includes('notifications') || name.startsWith('is_') || name === 'retry_count' || name === 'previous_attempts' || name === 'cycle_year' || name === 'total_days' || name === 'completed_days' || name === 'target_rank' || name === 'target_score' || name === 'age_min' || name === 'age_max' || name === 'salary_min' || name === 'salary_max' || name === 'total_questions' || name === 'correct_count' || name === 'incorrect_count' || name === 'unattempted_count' || name === 'duration_minutes') return 'INT';
  if (name === 'id' || name.endsWith('_id') || name === 'preferred_language' || name === 'learning_style' || name === 'preparation_level' || name === 'preferred_study_timings' || name === 'gender' || name === 'category_quota') return 'VARCHAR(64)';
  if (name === 'email') return 'VARCHAR(255)';
  if (name === 'name' || name === 'title' || name === 'subject' || name === 'organization') return 'VARCHAR(255)';
  if (name === 'code' || name === 'category' || name === 'sub_category' || name === 'qualification' || name === 'status' || name === 'urgency' || name === 'role' || name === 'state' || name === 'event_type' || name === 'notification_type' || name === 'difficulty' || name === 'frequency' || name === 'job_type' || name === 'pay_level' || name === 'in_hand_salary' || name === 'language' || name === 'correct_key' || name === 'user_selected_key') return 'VARCHAR(100)';
  if (name === 'official_url' || name === 'source_url' || name === 'action_url' || name === 'avatar_url') return 'VARCHAR(512)';
  if (name === 'exam_date' || name === 'notification_date' || name === 'application_start' || name === 'application_end' || name === 'admit_card_date' || name === 'result_date' || name === 'published_date' || name === 'event_date' || name === 'last_verified') return 'DATE';
  if (name.includes('hours') || name.includes('score') || name.includes('percentage') || name.includes('completion') || name.includes('accuracy') || name.includes('time_spent')) return 'DECIMAL(5,2)';
  if (name === 'preferred_email_time' || name === 'study_timings' || name === 'time_limit' || name === 'duration') return 'VARCHAR(32)';
  if (name === 'created_at' || name === 'updated_at' || name.endsWith('_at') || name === 'sent_at' || name === 'saved_at' || name === 'started_at' || name === 'completed_at') return 'TIMESTAMP';
  if (name === 'content' || name === 'explanation' || name === 'solution' || name === 'notes' || name === 'structured_notes' || name === 'raw_response' || name === 'ai_response' || name === 'question_text' || name === 'passage' || name === 'prompt' || name === 'concept' || name === 'key_points' || name === 'examples' || name === 'practice_questions' || name === 'formula_sheet' || name === 'mnemonics' || name === 'pitfalls' || name === 'summary_notes' || name === 'topic_summary' || name === 'detailed_notes') return 'LONGTEXT';
  if (name === 'message' || name === 'description' || name === 'summary' || name === 'selection_process' || name === 'exam_pattern_summary' || name === 'strong_subjects' || name === 'weak_subjects' || name === 'error_message' || name === 'focus_areas' || name === 'daily_targets' || name === 'tags' || name === 'options_json' || name === 'option_text' || name === 'mistake_reason' || name === 'recommendation') return 'TEXT';
  if (type.includes('INT')) return 'INT';
  if (type.includes('CHAR')) return 'VARCHAR(255)';
  if (type.includes('TEXT')) return 'TEXT';
  if (type.includes('DATE')) return 'DATE';
  if (type.includes('REAL') || type.includes('NUMERIC')) return 'DECIMAL(5,2)';
  return 'TEXT';
}

function exportToMySQL() {
  let sql = '-- =========================================================\n';
  sql += '-- MySQL Complete Database Dump & Seed for: pitch_deck\n';
  sql += '-- Generated for MySQL Workbench Execution\n';
  sql += '-- =========================================================\n\n';
  sql += 'CREATE DATABASE IF NOT EXISTS `pitch_deck` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;\n';
  sql += 'USE `pitch_deck`;\n\n';
  sql += 'SET FOREIGN_KEY_CHECKS = 0;\n\n';

  // Get all table names in SQLite
  const masterTables = rawDb.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'").all().map(t => t.name);

  console.log('Discovered tables in SQLite:', masterTables);

  for (const table of masterTables) {
    const colsInfo = rawDb.prepare(`PRAGMA table_info(${table})`).all();
    if (colsInfo.length === 0) continue;

    sql += `DROP TABLE IF EXISTS \`${table}\`;\n`;
    sql += `CREATE TABLE \`${table}\` (\n`;

    const colDefs = colsInfo.map(col => {
      let typeDef = getMySQLType(col.name, col.type);

      if (col.dflt_value !== null && col.dflt_value !== undefined && (typeDef === 'TEXT' || typeDef === 'LONGTEXT')) {
        typeDef = 'VARCHAR(255)';
      }

      let def = `  \`${col.name}\` ${typeDef}`;

      if (col.pk === 1) {
        def += ' PRIMARY KEY';
      }

      if (col.name === 'created_at' || col.name === 'last_updated' || col.name === 'last_synced') {
        def = `  \`${col.name}\` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP`;
        if (col.pk === 1) def += ' PRIMARY KEY';
      } else if (col.name === 'updated_at') {
        def = `  \`${col.name}\` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`;
        if (col.pk === 1) def += ' PRIMARY KEY';
      } else if (col.name.endsWith('_at') || col.name === 'sent_at' || col.name === 'saved_at' || col.name === 'started_at' || col.name === 'completed_at' || typeDef === 'TIMESTAMP') {
        if (col.dflt_value && col.dflt_value.toUpperCase().includes('CURRENT_TIMESTAMP')) {
          def = `  \`${col.name}\` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP`;
        } else {
          def = `  \`${col.name}\` TIMESTAMP NULL DEFAULT NULL`;
        }
        if (col.pk === 1) def += ' PRIMARY KEY';
      } else if (col.dflt_value !== null && col.dflt_value !== undefined) {
        let defaultVal = col.dflt_value;
        if (defaultVal.toUpperCase().includes('CURRENT_TIMESTAMP')) {
          def += ' DEFAULT CURRENT_TIMESTAMP';
        } else if (typeDef === 'INT' || typeDef === 'SMALLINT' || typeDef.startsWith('DECIMAL')) {
          const num = defaultVal.replace(/['"]/g, '');
          def += ` DEFAULT ${num}`;
        } else {
          const cleanStr = defaultVal.replace(/^['"]|['"]$/g, '');
          def += ` DEFAULT '${cleanStr}'`;
        }
      }
      return def;
    });

    sql += colDefs.join(',\n');
    sql += '\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;\n\n';

    // Export rows
    try {
      const rows = rawDb.prepare(`SELECT * FROM ${table}`).all();
      if (rows.length > 0) {
        sql += `-- Data for \`${table}\` (${rows.length} rows)\n`;
        const colNames = colsInfo.map(c => c.name);
        for (const row of rows) {
          const vals = colNames.map(c => {
            let v = row[c];
            if (v === null || v === undefined) return 'NULL';
            if (typeof v === 'number') return v;
            let strVal = String(v);
            if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(strVal)) {
              strVal = strVal.replace('T', ' ').replace(/(\.\d+)?Z$/, '');
            }
            strVal = strVal
              .replace(/\\/g, '\\\\')
              .replace(/'/g, "\\'")
              .replace(/\n/g, '\\n')
              .replace(/\r/g, '');
            return `'${strVal}'`;
          });
          sql += `INSERT INTO \`${table}\` (\`${colNames.join('`, `')}\`) VALUES (${vals.join(', ')});\n`;
        }
        sql += '\n';
      }
    } catch (e) {
      console.warn(`Could not export rows for ${table}:`, e.message);
    }
  }

  sql += 'SET FOREIGN_KEY_CHECKS = 1;\n';
  sql += '-- =========================================================\n';
  sql += '-- End of MySQL Dump for pitch_deck\n';
  sql += '-- =========================================================\n';

  const dumpPath = path.resolve(__dirname, '../database/schema/mysql_pitch_deck_setup.sql');
  fs.writeFileSync(dumpPath, sql, 'utf8');
  console.log('✅ Generated MySQL pitch_deck script at:', dumpPath);
  console.log('File size:', fs.statSync(dumpPath).size, 'bytes');
}

exportToMySQL();
