const { xpDB } = require('./connections');

// =========================
// Initialize XP Table
// =========================
xpDB.prepare(` 
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
xpDB.prepare(`
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

     const cooldown = xpDB.prepare(`SELECT * FROM cooldown WHERE user_id = ? AND guild_id = ?`)
          .get(userId, guildId);

     // ==== If user is on a cooldown, return ==== \\
     if (cooldown && now - cooldown.timestamp < COOLDOWN)
          return { leveledUp: false, level: 1 };

     const user = xpDB.prepare(`SELECT * FROM users WHERE user_id = ? AND guild_id = ?`)
          .get(userId, guildId);

     // ==== If user doesn't exist, create them ==== \\
     if (!user) {
          // ---- New User ---- \\
          xpDB.prepare(`INSERT INTO users (user_id, guild_id, xp, level) VALUES (?, ?, ?, ?)`)
               .run(userId, guildId, amount, 1);

          // ---- Cooldown ---- \\
          xpDB.prepare(`INSERT INTO cooldown (user_id, guild_id, timestamp) VALUES (?, ?, ?)`)
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
     xpDB.prepare(`UPDATE users SET xp = ?, level = ? WHERE user_id = ? AND guild_id = ?`)
          .run(xp, level, userId, guildId);

     // ---- Insert Cooldown ---- \\
     xpDB.prepare(`INSERT INTO cooldown (user_id, guild_id, timestamp) VALUES (?, ?, ?) ON CONFLICT(user_id, guild_id) DO UPDATE SET timestamp = ?`)
          .run(userId, guildId, now, now); // ---- FOR FUTURE REFERENCE: SQLite doesn't support less than 3 arguments, so we have to duplicate them. ~ aaron  ---- \\

     return { leveledUp, level };
}

// ===== Get User ===== \\
function getUser(userId, guildId) {
     return xpDB.prepare(`SELECT * FROM users WHERE user_id = ? AND guild_id = ?`)
          .get(userId, guildId);
}

// ===== Get Leaderboard ===== \\
function getLeaderboard(guildId) {
     return xpDB.prepare(`SELECT * FROM users WHERE guild_id = ? ORDER BY level DESC, xp DESC LIMIT 10`)
          .all(guildId);
}

// =========================
// Initialize XP Settings Table [for servers]
// -------------------------
// xp_enabled: 0 = disabled, 1 = enabled
// =========================
xpDB.prepare(`
     CREATE TABLE IF NOT EXISTS guild_xp_settings (
     guild_id TEXT PRIMARY KEY,
     xp_enabled INTEGER DEFAULT 1
)`).run();

// =========================
// Initialize XP Settings Table [for channels]
// -------------------------
// Same logic as above. (disabled = 0, enabled = 1)
// =========================
xpDB.prepare(`
     CREATE TABLE IF NOT EXISTS channel_xp_settings (
     channel_id TEXT PRIMARY KEY,
     xp_enabled INTEGER DEFAULT 1
)`).run();

function guildXPEnabled(guildID) {
     const row = xpDB.prepare(`SELECT xp_enabled FROM guild_xp_settings WHERE guild_id = ?`)
          .get(guildID);

     return row ? row.xp_enabled === 1 : true;
}

function channelXPEnabled(channelID) {
     const row = xpDB.prepare(`SELECT xp_enabled FROM channel_xp_settings WHERE channel_id = ?`)
          .get(channelID);

     return row ? row.xp_enabled === 1 : true;
}

module.exports = {
     addXP,
     getUser,
     getLeaderboard,
     getXpForNextLevel,
     guildXPEnabled,
     channelXPEnabled,
     xpDB
};