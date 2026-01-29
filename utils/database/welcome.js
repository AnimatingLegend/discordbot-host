const { welcome_settingsDB } = require('../database/connections.js');

// =========================
// Initialize Welcome / Leave settings table
// -------------------------
// enabled = 1, disabled = 0
// =========================
welcome_settingsDB.prepare(`
     CREATE TABLE IF NOT EXISTS welcome_settings (
     guild_id TEXT PRIMARY KEY,
     welcome_enabled INTEGER DEFAULT 0,
     welcome_channel_id TEXT,
     welcome_message TEXT,
     leave_enabled INTEGER DEFAULT 0,
     leave_channel_id TEXT,
     leave_message TEXT
)`).run();

module.exports = { welcome_settingsDB };