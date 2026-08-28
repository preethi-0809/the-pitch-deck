const fs = require('fs');
const path = require('path');
const db = require('./database');

function migrateTables() {
  try {
    const examColumns = [
      { name: 'organization', type: 'TEXT' },
      { name: 'sub_category', type: 'TEXT' },
      { name: 'qualification', type: 'TEXT' },
      { name: 'degree_required', type: 'TEXT' },
      { name: 'age_min', type: 'INTEGER DEFAULT 18' },
      { name: 'age_max', type: 'INTEGER DEFAULT 32' },
      { name: 'salary_min', type: 'INTEGER DEFAULT 25000' },
      { name: 'salary_max', type: 'INTEGER DEFAULT 80000' },
      { name: 'pay_level', type: 'TEXT' },
      { name: 'in_hand_salary', type: 'TEXT' },
      { name: 'difficulty', type: 'TEXT DEFAULT "intermediate"' },
      { name: 'frequency', type: 'TEXT DEFAULT "Annual"' },
      { name: 'job_type', type: 'TEXT DEFAULT "Non-Technical"' },
      { name: 'state', type: 'TEXT DEFAULT "All India"' },
      { name: 'selection_process', type: 'TEXT' },
      { name: 'exam_pattern_summary', type: 'TEXT' },
      { name: 'official_url', type: 'TEXT' },
      { name: 'last_verified', type: 'DATE' },
      { name: 'status', type: 'TEXT DEFAULT "Upcoming"' },
      { name: 'is_popular', type: 'INTEGER DEFAULT 0' },
      { name: 'is_featured', type: 'INTEGER DEFAULT 0' }
    ];

    const rawDb = db.getRawDb();
    const info = rawDb.prepare("PRAGMA table_info(exams)").all();
    const existing = new Set(info.map(c => c.name));

    for (const col of examColumns) {
      if (!existing.has(col.name)) {
        try {
          rawDb.exec(`ALTER TABLE exams ADD COLUMN ${col.name} ${col.type}`);
        } catch (e) {
          // ignore
        }
      }
    }

    // Migrate user_syllabus_progress table
    try {
      const uspInfo = rawDb.prepare("PRAGMA table_info(user_syllabus_progress)").all();
      const uspExisting = new Set(uspInfo.map(c => c.name));
      const uspColumns = [
        { name: 'exam_id', type: 'TEXT' },
        { name: 'completion_percentage', type: 'REAL DEFAULT 0.0' },
        { name: 'notes_bookmarked', type: 'INTEGER DEFAULT 0' }
      ];
      for (const col of uspColumns) {
        if (!uspExisting.has(col.name)) {
          try {
            rawDb.exec(`ALTER TABLE user_syllabus_progress ADD COLUMN ${col.name} ${col.type}`);
          } catch (e) {
            // ignore
          }
        }
      }
    } catch (e) {
      // ignore
    }

    // Migrate user_profiles table
    try {
      const upInfo = rawDb.prepare("PRAGMA table_info(user_profiles)").all();
      const upExisting = new Set(upInfo.map(c => c.name));
      if (!upExisting.has('state')) {
        rawDb.exec(`ALTER TABLE user_profiles ADD COLUMN state TEXT DEFAULT 'Tamil Nadu'`);
      }
    } catch (e) {
      // ignore
    }

    // Migrate user_notification_preferences table
    try {
      const unpInfo = rawDb.prepare("PRAGMA table_info(user_notification_preferences)").all();
      const unpExisting = new Set(unpInfo.map(c => c.name));
      const unpCols = [
        { name: 'application_open_notifications', type: 'INTEGER DEFAULT 1' },
        { name: 'exam_day_notifications', type: 'INTEGER DEFAULT 1' },
        { name: 'preferred_language', type: "TEXT DEFAULT 'en'" }
      ];
      for (const col of unpCols) {
        if (!unpExisting.has(col.name)) {
          try {
            rawDb.exec(`ALTER TABLE user_notification_preferences ADD COLUMN ${col.name} ${col.type}`);
          } catch (e) {}
        }
      }
    } catch (e) {
      // ignore
    }

    // Migrate notification_logs table
    try {
      const nlInfo = rawDb.prepare("PRAGMA table_info(notification_logs)").all();
      const nlExisting = new Set(nlInfo.map(c => c.name));
      const nlCols = [
        { name: 'event_type', type: 'TEXT' },
        { name: 'recipient_email', type: 'TEXT' },
        { name: 'language', type: "TEXT DEFAULT 'en'" },
        { name: 'retry_count', type: 'INTEGER DEFAULT 0' }
      ];
      for (const col of nlCols) {
        if (!nlExisting.has(col.name)) {
          try {
            rawDb.exec(`ALTER TABLE notification_logs ADD COLUMN ${col.name} ${col.type}`);
          } catch (e) {}
        }
      }
    } catch (e) {
      // ignore
    }
  } catch (err) {
    // If exams table doesn't exist yet, it will be created by schemaSql
  }
}

function initializeDatabase() {
  try {
    migrateTables();
    const schemaPath = path.resolve(__dirname, '../../../database/schema/sqlite_schema.sql');
    let schemaSql = '';
    if (fs.existsSync(schemaPath)) {
      schemaSql = fs.readFileSync(schemaPath, 'utf8');
    } else {
      const fallbackPath = path.resolve(__dirname, '../../data/sqlite_schema.sql');
      schemaSql = fs.readFileSync(fallbackPath, 'utf8');
    }

    // Execute schema statements
    db.exec(schemaSql);
    console.log('✅ SQLite Database tables and indexes initialized successfully.');
    return true;
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    throw error;
  }
}

module.exports = { initializeDatabase, migrateTables };
