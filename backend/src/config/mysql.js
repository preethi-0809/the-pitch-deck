const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const config = {
  host: process.env.MYSQL_HOST || process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.MYSQL_PORT || process.env.DB_PORT || 3306, 10),
  user: process.env.MYSQL_USER || process.env.DB_USER || 'root',
  password: process.env.MYSQL_PASSWORD !== undefined ? process.env.MYSQL_PASSWORD : (process.env.DB_PASSWORD !== undefined ? process.env.DB_PASSWORD : ''),
  database: process.env.MYSQL_DATABASE || process.env.DB_NAME || 'prepai',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
  multipleStatements: true
};

// If DATABASE_URL is provided, prioritize it
let pool;
if (process.env.DATABASE_URL && process.env.DATABASE_URL.startsWith('mysql')) {
  pool = mysql.createPool({
    uri: process.env.DATABASE_URL,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    multipleStatements: true
  });
} else {
  pool = mysql.createPool(config);
}

module.exports = {
  pool,
  config,
  async query(sql, params = []) {
    const [rows] = await pool.query(sql, params);
    return rows;
  },
  async execute(sql, params = []) {
    const [result] = await pool.execute(sql, params);
    return result;
  },
  getConnection() {
    return pool.getConnection();
  }
};
