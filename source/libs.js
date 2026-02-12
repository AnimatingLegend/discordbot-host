// === EXTERNAL PACKAGES (NPM) === \\
const voice = require('@discordjs/voice');
const play = require('play-dl');
const axios = require('axios');
const he = require('he');
const ms = require('ms');
const sqlite3 = require('better-sqlite3');
const winston = require('winston');
const fs = require('node:fs');
const path = require('node:path');

// === LOCAL UTILITIES & CONFIG === \\
// --- Note-to-self: Only keep "leaf" utilities in this file. --- \\
const logger = require('./utils/logger.js');
const config = require('../config.json');
const colors = require('./utils/random-colors.js');
const emojis = require('./utils/random-emojis.js');

// === EXPORTS (Alphabetical order) === \\
module.exports = {
     axios,
     config,
     colors,
     emojis,
     fs,
     he,
     logger,
     ms,
     path,
     play,
     sqlite3,
     voice,
     winston,
     // === EXPORT PACKAGES === \\
     ...require('discord.js'),
}