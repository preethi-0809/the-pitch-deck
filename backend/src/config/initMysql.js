const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

async function initMysql() {
  const host = process.env.MYSQL_HOST || process.env.DB_HOST || 'localhost';
  const port = parseInt(process.env.MYSQL_PORT || process.env.DB_PORT || 3306, 10);
  const user = process.env.MYSQL_USER || process.env.DB_USER || 'root';
  const password = process.env.MYSQL_PASSWORD !== undefined ? process.env.MYSQL_PASSWORD : (process.env.DB_PASSWORD !== undefined ? process.env.DB_PASSWORD : '');
  const dbName = process.env.MYSQL_DATABASE || process.env.DB_NAME || 'prepai';
  const databaseUrl = process.env.DATABASE_URL;

  console.log('=======================================================');
  console.log('🔄 Connecting to MySQL Database Server...');
  console.log(`   Host: ${host}:${port}`);
  console.log(`   User: ${user}`);
  console.log(`   Database: ${dbName}`);
  console.log('=======================================================');

  let adminConnection = null;
  try {
    // 1. Connect without database selected to ensure DB exists
    if (!databaseUrl) {
      adminConnection = await mysql.createConnection({
        host,
        port,
        user,
        password
      });

      console.log(`   Ensuring database "${dbName}" exists...`);
      await adminConnection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
      console.log(`   ✅ Database "${dbName}" ready!`);
      await adminConnection.end();
    }
  } catch (err) {
    if (adminConnection) await adminConnection.end().catch(() => {});
    console.warn(`   ⚠️ Notice during database creation check: ${err.message}`);
  }

  // 2. Connect to the target database and execute full schema & seed dump
  let targetConnection = null;
  try {
    const targetConfig = databaseUrl && databaseUrl.startsWith('mysql')
      ? { uri: databaseUrl, multipleStatements: true }
      : {
          host,
          port,
          user,
          password,
          database: dbName,
          multipleStatements: true
        };

    targetConnection = await mysql.createConnection(targetConfig);
    console.log(`✅ Connected successfully to MySQL database "${dbName}"!`);

    const dumpPath = path.join(__dirname, '../../../database/schema/mysql_full_dump.sql');
    const fallbackPath = path.join(__dirname, '../../../database/schema/mysql_schema.sql');
    const sqlFile = fs.existsSync(dumpPath) ? dumpPath : fallbackPath;

    if (fs.existsSync(sqlFile)) {
      console.log(`🔄 Executing MySQL schema DDL & importing seed catalog from:\n   ${sqlFile}`);
      const sql = fs.readFileSync(sqlFile, 'utf8');
      await targetConnection.query(sql);
      console.log('✅ Schema initialized and seed data successfully loaded into MySQL!');
    } else {
      console.warn(`⚠️ Warning: Neither ${dumpPath} nor ${fallbackPath} found.`);
    }

    // 3. Verify table count & structure
    const [tables] = await targetConnection.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = ?
      ORDER BY table_name ASC
    `, [dbName]);

    console.log(`\n🎉 Verification Complete: ${tables.length} tables verified in MySQL (${dbName}):`);
    tables.forEach(t => {
      const name = t.TABLE_NAME || t.table_name;
      console.log(`   - ${name}`);
    });

    await targetConnection.end();
    console.log('\n🚀 MySQL initialization finished successfully!\n');
    return true;
  } catch (err) {
    if (targetConnection) await targetConnection.end().catch(() => {});
    console.error('\n❌ MySQL Connection / Initialization Error:', err.message);
    console.log('\n💡 Please ensure MySQL Server is running and check your .env settings:');
    console.log('   DB_TYPE=mysql');
    console.log(`   MYSQL_HOST=${host}`);
    console.log(`   MYSQL_PORT=${port}`);
    console.log(`   MYSQL_USER=${user}`);
    console.log('   MYSQL_PASSWORD=your_password');
    console.log(`   MYSQL_DATABASE=${dbName}`);
    console.log('   # or DATABASE_URL=mysql://root:password@localhost:3306/prepai\n');
    return false;
  }
}

if (require.main === module) {
  initMysql();
}

module.exports = { initMysql };
