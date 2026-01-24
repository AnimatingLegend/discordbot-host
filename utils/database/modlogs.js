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

// ===== Get Users Modlogs ===== \\
function getUserModlogs(userID, limt = 25) {
     return modlogDB.prepare(`SELECT * FROM mod_logs WHERE user_id = ? ORDER BY timestamp DESC LIMIT ?`)
          .all(userID, limt);
}

// ===== Clear Users Modlogs ===== \\
function clearUserModLogs(userID) {
     return modlogDB.prepare(`DELETE FROM mod_logs WHERE user_id = ?`)
          .run(String(userID));
}

// ===== Clear ALL of Users Modlogs ===== \\
function clearAllModLogs() {
     return modlogDB.prepare(`DELETE FROM mod_logs`);
}

// ===== Add a Modlog to User Modlogs ===== \\
function addModLog(userID, guildID, action, reason) {
     modlogDB.prepare(`INSERT INTO mod_logs (user_id, mod_id, action, reason) VALUES (?, ?, ?, ?)`)
          .run(userID, guildID, action, reason);
}

module.exports = {
     addModLog,
     getUserModlogs,
     clearUserModLogs,
     clearAllModLogs
};