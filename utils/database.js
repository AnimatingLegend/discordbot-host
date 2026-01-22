const Database = require('better-sqlite3')
const db = new Database('utils/data/modlogs.sqlite', { verbose: console.log });
const db2 = new Database('utils/data/xp.sqlite', { verbose: console.log });

// =========================
// Initialize Mod Logs Table
// =========================
db.prepare(`
     CREATE TABLE IF NOT EXISTS mod_logs (
     id INTEGER PRIMARY KEY AUTOINCREMENT,
     user_id TEXT,
     mod_id TEXT,
     action TEXT,
     reason TEXT,
     timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
)`).run();

// =========================
// Initialize XP Table
// =========================
db2.prepare(` 
     CREATE TABLE IF NOT EXISTS users (
     user_id TEXT,
     guild_id TEXT,
     xp INTEGER DEFAULT 0,
     level INTEGER DEFAULT 1,
     PRIMARY KEY (user_id, guild_id)
)`).run();

// =========================
// Initialize XP Cooldown Table
// =========================
db2.prepare(`
     CREATE TABLE IF NOT EXISTS cooldown (
     user_id TEXT,
     guild_id TEXT,
     timestamp INTEGER,
     PRIMARY KEY (user_id, guild_id)
)`).run();

// ===== XP needed formula ===== \\
function getXpForNextLevel(level) {
     return level * level * 100;
}

// ===== Add XP to user ===== \\
const COOLDOWN = 60 * 1000; // 1 min

function addXP(userId, guildId, amount) {
     const now = Date.now();

     const cooldown = db2.prepare(`SELECT * FROM cooldown WHERE user_id = ? AND guild_id = ?`)
          .get(userId, guildId);

     // ==== If user is on a cooldown, return ==== \\
     if (cooldown && now - cooldown.timestamp < COOLDOWN)
          return { leveledUp: false, level: 1 };

     const user = db2.prepare(`SELECT * FROM users WHERE user_id = ? AND guild_id = ?`)
          .get(userId, guildId);

     // ==== If user doesn't exist, create them ==== \\
     if (!user) {
          // ---- New User ---- \\
          db2.prepare(`INSERT INTO users (user_id, guild_id, xp, level) VALUES (?, ?, ?, ?)`)
               .run(userId, guildId, amount, 1);

          // ---- Cooldown ---- \\
          db2.prepare(`INSERT INTO cooldown (user_id, guild_id, timestamp) VALUES (?, ?, ?)`)
               .run(userId, guildId, now);

          return { leveledUp: false, level: 1 };
     }

     let xp = user.xp + amount;
     let level = user.level;
     let leveledUp = false;

     const neededXP = getXpForNextLevel(level);

     if (xp >= neededXP) {
          xp -= neededXP;
          level++;
          leveledUp = true;
     }

     // ---- Update User ---- \\
     db2.prepare(`UPDATE users SET xp = ?, level = ? WHERE user_id = ? AND guild_id = ?`)
          .run(xp, level, userId, guildId);

     // ---- Insert Cooldown ---- \\
     db2.prepare(`INSERT INTO cooldown (user_id, guild_id, timestamp) VALUES (?, ?, ?) ON CONFLICT(user_id, guild_id) DO UPDATE SET timestamp = ?`)
          .run(userId, guildId, now);

     return { leveledUp, level };
}

// ===== Get User ===== \\
function getUser(userId, guildId) {
     return db2.prepare(`SELECT * FROM users WHERE user_id = ? AND guild_id = ?`)
          .get(userId, guildId);
}

// ===== Get Leaderboard ===== \\
function getLeaderboard(guildId) {
     return db2.prepare(`SELECT * FROM users WHERE guild_id = ? ORDER BY level DESC, xp DESC LIMIT 10`)
          .all(guildId);
}

module.exports = {
     addXP,
     getUser,
     getLeaderboard,
     getXpForNextLevel,
     db,
     db2
};
