// === IMPORTS === \\
const axios = require('axios');
const BetterSqlite3 = require('better-sqlite3');
const discord = require('discord.js');
const fs = require('node:fs');
const he = require('he');
const ms = require('ms');
const path = require('node:path');
const play = require('play-dl');
const voice = require('@discordjs/voice');
const winston = require('winston');

// === EXPORT ALL UTILITIES === \\
module.exports = {
     axios,
     Database: BetterSqlite3,
     discord, ...discord,
     formatter: require('./utils/markdown.js'),
     fs,
     he,
     ms,
     path,
     play,
     voice,
     winston,

     // === DYNAMIC UTILITIES === \\
     get config() { return require('../config.json') },
     get logger() { return require('./utils/logger.js') },
     get colors() { return require('./utils/random-colors.js') },

     // === DATABASES === \\
     get modLogDB() { return require('./database/connections.js') },
     get welcomeDB() { return require('./database/connections.js') },
     get xpDB() { return require('./database/connections.js') }
};