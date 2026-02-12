// --- EXTERNAL PACKAGES (NPM) --- \\
const {
     // Core Classes
     Client,
     ClientReady,
     Collection,
     Events,
     GatewayIntentBits,
     Partials,

     // UI Components
     EmbedBuilder,
     ActionRowBuilder,
     ButtonBuilder,
     ButtonStyle,
     StringSelectMenuBuilder,

     // Command Handling
     SlashCommandBuilder,
     ContextMenuCommandBuilder,

     // Constants & Utilities
     ActivityType,
     PermissionFlagsBits,
     ChannelType,
     Colors
} = require('discord.js');
const voice = require('@discordjs/voice');
const play = require('play-dl');
const axios = require('axios');
const he = require('he');
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

// --- MISC --- \\
const { ReadyLog } = require('./utils/logging/ReadyLog.js');

module.exports = {
     // Discord Classes
     Client, Collection, Events, GatewayIntentBits, Partials,
     EmbedBuilder, ClientReady, ActionRowBuilder, ButtonBuilder, ButtonStyle,
     StringSelectMenuBuilder, SlashCommandBuilder, ContextMenuCommandBuilder,
     ActivityType, PermissionFlagsBits, ChannelType, Colors,

     // External Packages
     voice, play,
     axios,
     he,
     ms,
     sqlite3,
     winston,
     fs, path,
     logger,
     config,
     colors, emojis,
     ReadyLog
}