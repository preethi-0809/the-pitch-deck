const fs = require('fs');
const path = require('path');
const mysql = require('../backend/node_modules/mysql2/promise');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

async function importToMySQL() {
  const host = process.env.MYSQL_HOST || 'localhost';
  const port = parseInt(process.env.MYSQL_PORT || '3306');
  const user = process.env.MYSQL_USER || 'root';
  const password = process.env.MYSQL_PASSWORD || '';
  const database = process.env.MYSQL_DATABASE || 'pitch_deck';

  console.log(`Connecting to MySQL at ${host}:${port} as ${user}...`);

  try {
    const connection = await mysql.createConnection({
      host,
      port,
      user,
      password,
      multipleStatements: true
    });

    console.log('✅ Connected to MySQL successfully!');

    // Read the SQL script
    const sqlPath = path.resolve(__dirname, '../database/schema/mysql_pitch_deck_setup.sql');
    const fullSql = fs.readFileSync(sqlPath, 'utf8');

    // Split SQL by semicolons (excluding inside quotes)
    const statements = fullSql
      .split(/;\s*[\r\n]+/)
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    console.log(`Executing ${statements.length} SQL statements into database \`${database}\`...`);

    let count = 0;
    for (const stmt of statements) {
      try {
        await connection.query(stmt);
        count++;
      } catch (err) {
        console.error(`❌ Error on statement #${count + 1}:`, err.message);
        console.error('Failed statement snippet:\n', stmt.substring(0, 300) + '...\n');
        throw err;
      }
    }

    console.log(`🎉 Successfully executed ${count} statements and imported all data into MySQL \`${database}\`!`);

    const [tables] = await connection.query('SHOW TABLES FROM `pitch_deck`;');
    console.log(`\n📋 Database \`${database}\` now contains ${tables.length} tables:`);
    console.log(tables.map(t => Object.values(t)[0]).join(', '));

    await connection.end();
  } catch (err) {
    console.error('❌ Migration failed:', err.message);
  }
}

importToMySQL();
