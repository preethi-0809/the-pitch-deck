const fs = require('fs');
const path = require('path');
const { createClient } = require('../backend/node_modules/@libsql/client');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const url = process.env.TURSO_DATABASE_URL || 'libsql://pitchdeck-preethi-0809.aws-ap-south-1.turso.io';
const authToken = process.env.TURSO_AUTH_TOKEN || process.argv[2] || '';

async function migrateToTurso() {
  console.log('=======================================================');
  console.log('🚀 Turso Database Migration for PrepAI / Pitch Deck');
  console.log('=======================================================');
  console.log('Target Turso URL:', url);

  if (!authToken) {
    console.error('\n❌ ERROR: TURSO_AUTH_TOKEN is missing!');
    console.log('\n👉 Please do the following:');
    console.log('1. Run `turso db tokens create pitchdeck` in your terminal, or copy the token from your Turso dashboard.');
    console.log('2. Paste it in your `.env` file as:');
    console.log('   TURSO_AUTH_TOKEN=your_auth_token_here');
    console.log('3. Run: node scripts/migrateToTurso.js\n');
    process.exit(1);
  }

  const client = createClient({ url, authToken });

  console.log('⏳ Connecting to Turso...');

  try {
    // Read local SQLite database to export tables and rows
    const db = require('../backend/src/config/database');
    const rawDb = db.getRawDb();

    // Get all tables in SQLite
    const tables = rawDb.prepare("SELECT name, sql FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'").all();
    console.log(`Discovered ${tables.length} tables to create and migrate into Turso:`);
    console.log(tables.map(t => t.name).join(', '));

    console.log('\n🛠️ Step 1: Creating tables in Turso...');
    for (const t of tables) {
      if (!t.sql) continue;
      try {
        await client.execute(t.sql);
        console.log(`  ✅ Table \`${t.name}\` created/verified.`);
      } catch (err) {
        console.warn(`  ⚠️ Table \`${t.name}\`:`, err.message);
      }
    }

    console.log('\n📦 Step 2: Migrating data to Turso...');
    for (const t of tables) {
      const rows = rawDb.prepare(`SELECT * FROM ${t.name}`).all();
      if (rows.length === 0) continue;

      const cols = Object.keys(rows[0]);
      const placeholders = cols.map(() => '?').join(', ');
      const insertSql = `INSERT OR REPLACE INTO ${t.name} (${cols.join(', ')}) VALUES (${placeholders})`;

      let inserted = 0;
      // Batch insert in chunks of 50
      const batchSize = 50;
      for (let i = 0; i < rows.length; i += batchSize) {
        const chunk = rows.slice(i, i + batchSize);
        const batchStatements = chunk.map(row => ({
          sql: insertSql,
          args: cols.map(c => row[c])
        }));
        await client.batch(batchStatements, 'write');
        inserted += chunk.length;
      }
      console.log(`  ✅ ${t.name}: Migrated ${inserted} records.`);
    }

    console.log('\n🎉 SUCCESS! All tables and data have been uploaded to Turso cloud database!');
    console.log('Database URL:', url);
  } catch (err) {
    console.error('\n❌ Migration failed:', err.message);
  }
}

migrateToTurso();
