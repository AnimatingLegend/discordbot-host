const { welcomeDB } = require('./connections');

// =========================
// Init Welcome / Leave settings Table
// -------------------------
// enabled: 0 = disabled, 1 = enabled
// =========================
welcomeDB.prepare(`
     CREATE TABLE IF NOT EXISTS welcome_settings (
          guild_id TEXT PRIMARY KEY,
          welcome_enabled INTEGER DEFAULT 0,
          welcome_channel_id TEXT,
          leave_enabled INTEGER DEFAULT 0,
          leave_channel_id TEXT
)`).run();

/**
 * ~~ Update settings based on type (welcome/leave) ~~
 * @param {string} guildID - Discord Guild ID
 * @param {object} config - { type: 'welcome'| leave', status: 0|1, channelID: string }
 */
function setWelcomeConfig(guildID, { type, status, channelID }) {
     const isWelcome = type === 'welcome';
     const enable_column = isWelcome ? 'welcome_enabled' : 'leave_enabled';
     const channel_column = isWelcome ? 'welcome_channel_id' : 'leave_channel_id';

     // ---- If `channelID` is provided, we save it, and auto-enable it ---- \\
     if (channelID) {
          return welcomeDB.prepare(`
               INSERT INTO welcome_settings (guild_id, ${enable_column}, ${channel_column}) 
               VALUES (?, 1, ?) 
               ON CONFLICT(guild_id) 
               DO UPDATE SET ${channel_column} = excluded.${channel_column}`
          ).run(guildID, channelID);
     } else {
          // ---- Othersie we update the toggle status ---- \\
          return welcomeDB.prepare(`
               INSERT INTO welcome_settings (guild_id, ${enable_column}) 
               VALUES (?, ?) 
               ON CONFLICT(guild_id) 
               DO UPDATE SET ${enable_column} = excluded.${enable_column}`
          ).run(guildID, status);
     }
}

module.exports = { setWelcomeConfig };