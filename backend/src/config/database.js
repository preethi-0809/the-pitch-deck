const { DatabaseSync } = require('node:sqlite');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const { createClient } = require('@libsql/client');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const TURSO_DATABASE_URL = process.env.TURSO_DATABASE_URL || 'libsql://pitchdeck-preethi-0809.aws-ap-south-1.turso.io';
const TURSO_AUTH_TOKEN = process.env.TURSO_AUTH_TOKEN || '';

const DB_FILE = path.resolve(__dirname, '../../data/pitch_deck.sqlite');
const dbDir = path.dirname(DB_FILE);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

let sqliteInstance = null;
let tursoClient = null;

function getSqliteDb() {
  if (!sqliteInstance) {
    sqliteInstance = new DatabaseSync(DB_FILE);
    sqliteInstance.exec('PRAGMA foreign_keys = ON;');
    sqliteInstance.exec('PRAGMA journal_mode = WAL;');
  }
  return sqliteInstance;
}

// Initialize Turso Cloud Client
if (TURSO_DATABASE_URL && TURSO_AUTH_TOKEN) {
  try {
    tursoClient = createClient({
      url: TURSO_DATABASE_URL,
      authToken: TURSO_AUTH_TOKEN
    });
    console.log(`☁️ [Turso Cloud Database] Connected exclusively to: ${TURSO_DATABASE_URL}`);
  } catch (err) {
    console.error('❌ [Turso Cloud Database] Connection error:', err.message);
  }
} else {
  console.warn('⚠️ [Turso Cloud Database] TURSO_AUTH_TOKEN is required in .env');
}

function sanitizeParams(params = []) {
  if (!Array.isArray(params)) return [];
  return params.map(p => (p === undefined ? null : p));
}

// Replicate write directly to Turso Cloud
async function replicateToTurso(sql, params = []) {
  if (!tursoClient) return;
  try {
    const cleanParams = sanitizeParams(params);
    await tursoClient.execute({ sql, args: cleanParams });
  } catch (err) {
    // Non-blocking background sync warning
  }
}

// Clean Turso-focused database API
const db = {
  getRawDb() {
    return getSqliteDb();
  },

  getTursoClient() {
    return tursoClient;
  },

  exec(sql) {
    const result = getSqliteDb().exec(sql);
    if (tursoClient) {
      tursoClient.execute(sql).catch(() => {});
    }
    return result;
  },

  query(sql, params = []) {
    const clean = sanitizeParams(params);
    const stmt = getSqliteDb().prepare(sql);
    return stmt.all(...clean);
  },

  get(sql, params = []) {
    const clean = sanitizeParams(params);
    const stmt = getSqliteDb().prepare(sql);
    return stmt.get(...clean);
  },

  run(sql, params = []) {
    const clean = sanitizeParams(params);
    const stmt = getSqliteDb().prepare(sql);
    const result = stmt.run(...clean);

    // Save directly to Turso Cloud database
    replicateToTurso(sql, clean);

    return result;
  },

  transaction(callback) {
    const rawDb = getSqliteDb();
    rawDb.exec('BEGIN TRANSACTION;');
    try {
      const result = callback(db);
      rawDb.exec('COMMIT;');
      return result;
    } catch (err) {
      rawDb.exec('ROLLBACK;');
      throw err;
    }
  }
};

module.exports = db;
