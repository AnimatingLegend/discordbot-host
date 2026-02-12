// --- EXTERNAL PACKAGES (NPM) --- \\
const discord = require('discord.js');
const voice = require('@discordjs/voice');
const play = require('play-dl');
const axios = require('axios');
const ms = require('ms');
const sqlite3 = require('better-sqlite3');
const winston = require('winston');
const fs = require('node:fs');
const path = require('node:path');

// --- LOCAL UTILITIES & CONFIG --- \\
const logger = require('./utils/logger.js');
const config = require('../config.json');
const colors = require('./utils/random-colors.js');
const emojis = require('./utils/random-emojis.js');

module.exports = {
     ...discord,
     discord,
     voice,
     play,
     axios,
     ms,
     sqlite3,
     winston,
     fs,
     path,
     logger,
     config,
     colors,
     emojis
}