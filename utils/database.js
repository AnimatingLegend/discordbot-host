const Database = require('better-sqlite3')
const db = new Database('utils/data/modlogs.db', { verbose: console.log });

db.prepare(`
     CREATE TABLE IF NOT EXISTS mod_logs (
     id INTEGER PRIMARY KEY AUTOINCREMENT,
     user_id TEXT,
     mod_id TEXT,
     action TEXT,
     reason TEXT,
     timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
)`).run();

module.exports = db;