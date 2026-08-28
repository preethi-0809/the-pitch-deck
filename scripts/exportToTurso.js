const fs = require('fs');
const path = require('path');
const db = require('../backend/src/config/database');
const rawDb = db.getRawDb();

function exportTursoSQL() {
  let sql = '-- =========================================================\n';
  sql += '-- Turso Cloud Database (libSQL) Full Schema & Seed Dump\n';
  sql += '-- Database: pitchdeck\n';
  sql += '-- Ready to paste into Turso Web SQL Console or CLI\n';
  sql += '-- =========================================================\n\n';
  sql += 'PRAGMA foreign_keys = OFF;\n\n';

  const tables = rawDb.prepare("SELECT name, sql FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'").all();

  for (const t of tables) {
    if (!t.sql) continue;
    sql += `DROP TABLE IF EXISTS \`${t.name}\`;\n`;
    sql += `${t.sql};\n\n`;

    const rows = rawDb.prepare(`SELECT * FROM \`${t.name}\``).all();
    if (rows.length > 0) {
      const cols = Object.keys(rows[0]);
      for (const row of rows) {
        const vals = cols.map(c => {
          const v = row[c];
          if (v === null || v === undefined) return 'NULL';
          if (typeof v === 'number') return v;
          const str = String(v).replace(/'/g, "''");
          return `'${str}'`;
        });
        sql += `INSERT OR REPLACE INTO \`${t.name}\` (\`${cols.join('`, `')}\`) VALUES (${vals.join(', ')});\n`;
      }
      sql += '\n';
    }
  }

  sql += 'PRAGMA foreign_keys = ON;\n';
  const outPath = path.resolve(__dirname, '../database/schema/turso_pitchdeck_setup.sql');
  fs.writeFileSync(outPath, sql, 'utf8');
  console.log('✅ Generated Turso SQL setup file at:', outPath);
  console.log('Size:', (fs.statSync(outPath).size / 1024).toFixed(1), 'KB');
}

exportTursoSQL();
