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
const logger = require('./utils/logger.js');
const config = require('../config.json');
const colors = require('./utils/random-colors.js');
const emojis = require('./utils/random-emojis.js');

// === MISC === \\
const { ReadyLog } = require('./utils/logging/ReadyLog.js');

// === EXPORTS (Alphabetical order) === \\
module.exports = {
     axios,
     config,
     colors,
     // export the entire discord.js package so it can be used anywhere
     ...require('discord.js'),
     emojis,
     fs,
     he,
     logger,
     ms,
     path,
     play,
     ReadyLog,
     sqlite3,
     voice,
     winston,
}