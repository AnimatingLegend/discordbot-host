const { listDB } = require('./connections');

// =========================
// Initialize access_control Table
// =========================
listDB.prepare(`
     CREATE TABLE IF NOT EXISTS access_control (
     user_id TEXT NOT NULL,
     type TEXT CHECK(type IN ('blacklist', 'whitelist')) NOT NULL,
     reason TEXT,
     added_by TEXT,
     timestamp INTEGER,
     PRIMARY KEY (user_id, type)
)`).run();

function isBlacklisted(userID) {
     const row = listDB.prepare(`SELECT 1 FROM access_control WHERE user_id = ? AND type = 'blacklist'`)
          .get(userID);

     return !!row;
}

function isXPBlacklisted(userID) {
     const row = listDB.prepare(`SELECT 1 FROM access_control WHERE user_id = ? AND type = 'blacklist'`)
          .get(userID);

     return !!row;
}

function addBlacklist(userID, reason, modID) {
     listDB.prepare(`INSERT INTO access_control (user_id, type, reason, added_by, timestamp) VALUES (?, blacklist, ?, ?, ?)`)
          .run(userID, reason || null, modID, Date.now());
}

function removeBlacklist(userID) {
     listDB.prepare(`DELETE FROM access_control WHERE user_id = ? AND type = 'blacklist'`)
          .run(userID);
}

function isWhitelisted(userID) {
     const row = listDB.prepare(`SELECT 1 FROM access_control WHERE user_id = ? AND type = 'whitelist'`)
          .get(userID);

     return !!row;
}

function isXPWhitelisted(userID) {
     const row = listDB.prepare(`SELECT 1 FROM access_control WHERE user_id = ? AND type = 'whitelist'`)
          .get(userID);

     return !!row;
}

function addWhitelist(userID, reason, modID) {
     listDB.prepare(`INSERT OR REPLACE INTO access_control (user_id, type, reason, added_by, timestamp) VALUES (?, whitelist, ?, ?, ?)`)
          .run(userID, reason || null, modID, Date.now());
}

function removeWhitelist(userID) {
     listDB.prepare(`DELETE FROM access_control WHERE user_id = ? AND type = 'whitelist'`)
          .run(userID);
}

module.exports = {
     isBlacklisted,
     isXPBlacklisted,
     addBlacklist,
     removeBlacklist,
     isWhitelisted,
     isXPWhitelisted,
     addWhitelist,
     removeWhitelist
};