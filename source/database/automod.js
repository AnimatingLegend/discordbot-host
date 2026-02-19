const { automodDB } = require('./connections');

// ==============================
// Init Automod settings Table
// ------------------------------
// enabled: 0 = disabled, 1 = enabled
// banned_words: String[] for JSON
// ==============================
automodDB.prepare(`
     CREATE TABLE IF NOT EXISTS automod_settings (
     guild_id TEXT PRIMARY KEY,
     enabled INTEGER DEFAULT 0,
     banned_words TEXT DEFAULT '[]',
     log_channel_id TEXT
)`).run();

// ==============================
// Update Automod settings
// ------------------------------
// guildID - Discord Guild ID
// enabled: 0|1, bannedWords: string[], logChannelID: string
// ==============================
function automodSetup(guildID, { enabled, bannedWords, logChannelID }) {
     // ---- If updating banned words ---- \\
     if (bannedWords) {
          const bannedWords_JSON = JSON.stringify(bannedWords);

          return automodDB.prepare(`
               INSERT INTO automod_settings (guild_id, banned_words) 
               VALUES (?, ?) 
               ON CONFLICT(guild_id) 
               DO UPDATE SET banned_words = excluded.banned_words
          `).run(guildID, bannedWords_JSON);
     }

     // ---- If toggling status or setting log channel ---- \\
     if (logChannelID) {
          return automodDB.prepare(`
               INSERT INTO automod_settings (guild_id, log_channel_id) 
               VALUES (?, ?) 
               ON CONFLICT(guild_id) 
               DO UPDATE SET log_channel_id = excluded.log_channel_id
          `).run(guildID, logChannelID);
     }

     return automodDB.prepare(`
          INSERT INTO automod_settings (guild_id, enabled) 
          VALUES (?, ?) 
          ON CONFLICT(guild_id) 
          DO UPDATE SET enabled = excluded.enabled
     `).run(guildID, enabled);
}

function getAutomodSettings(guildID) {
     return automodDB.prepare(`SELECT * FROM automod_settings WHERE guild_id = ?`).get(guildID);
}

module.exports = { automodSetup, getAutomodSettings };