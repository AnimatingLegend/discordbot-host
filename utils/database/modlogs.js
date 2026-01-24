const { modlogDB } = require('./connections');

// =========================
// Initialize Mod Logs Table
// =========================
modlogDB.prepare(`
     CREATE TABLE IF NOT EXISTS mod_logs (
     id INTEGER PRIMARY KEY AUTOINCREMENT,
     user_id TEXT,
     mod_id TEXT,
     action TEXT,
     reason TEXT,
     timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
)`).run();

function addModLog(userID, guildID, action, reason) {
     modlogDB.prepare(`INSERT INTO mod_logs (user_id, mod_id, action, reason) VALUES (?, ?, ?, ?)`)
          .run(userID, guildID, action, reason);
}

module.exports = { addModLog };