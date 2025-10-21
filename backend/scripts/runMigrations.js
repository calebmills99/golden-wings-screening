const fs = require('fs');
const path = require('path');
const { pool } = require('../src/db/pool');
const { log, error } = require('../src/utils/logger');

async function run() {
  const migrationsDir = path.resolve(__dirname, '../src/db/migrations');
  const files = fs.readdirSync(migrationsDir)
    .filter((file) => file.endsWith('.sql'))
    .sort();

  for (const file of files) {
    const filePath = path.join(migrationsDir, file);
    const sql = fs.readFileSync(filePath, 'utf-8');
    log(`Running migration: ${file}`);
    await pool.query(sql);
  }
}

run()
  .then(() => {
    log('Migrations completed successfully.');
    return pool.end();
  })
  .then(() => process.exit(0))
  .catch((err) => {
    error('Migration failed', err);
    pool.end().finally(() => process.exit(1));
  });
