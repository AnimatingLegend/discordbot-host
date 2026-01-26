# Changelog
All noteable changes will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.2.0] - [2026-01-25]
### Added
- **XP / Level Toggle System**
     - Created `/toggle_xp` command.
     - You can now toggle the XP and Leveling features on or off for the whole server or just specific channels.
     - For more info, read the **[Command Guide](./docs/COMMAND_GUIDE.md/#toggle-xp)**.
### Changed
- **Uptime Menu Updates**
     - The `/uptime` command embed color and status now changes dynamically depending on your bot's latency (ping).
     - Cleaned up timestamp code. (Since Discord.js v14 supports timestamps **natively**, hardcoding them was very redundant).
     - Updated the embed format to make it way more clean & concise.
- **Database Optimizations**
     - Minor backend changes have been made to the system.
- **Miscellaneous**
     - Updated the bot's bootup message in the console.
     - Softcoded the bot's username into the console logs and the `.setPresence()` status message so they update automatically.
### Fixed
- **Softcoding Mistakes**
     - Fixed issue where the bot's **username** & **prefix** were not softcoded in certain commands. (`/changelog` & `/github`)

## [2.1.0] - [2026-01-24]
### Added
- **Help Menu Updates**
     - Included `/rank` and `/leaderboard` in the `/help` command list to ensure users can find the new **XP Features** (forgot to add it last update, whoops!)
### Changed
- **Bot Configuration's**
     - The bot username(s) are now softcoded within the **[`.config` file](./api/config.js)**
     - For setup details, ready the **[Configuraiton Guide](./docs/DISCORD_BOT_CONFIGUATION.md#2-add-configuration-values)**
- **Database Optimization**
     - Split the databases up into dedicated files to handle their own logic.
     - Made it easier to initalize databases within commands.
     - Buffed the data logging once again. (i thought i fixed the terminal crashes last time, but i added extra precautions to be safe.)
     
## [2.0.0] - [2026-01-22]
### New Features
- **XP / RANKING SYSTEM**
     - Users can now progress in a server and gain XP the more active they are.
### Moderation & Configuration Updates
- **Enhanced `/unmute` Support**
     - For better tracking, I implemented the command within the `mod_log`.
- **Config & Bootup**
     - Adjusted `.config` parameters.
     - Added `CLIENT_ID` logging during bootup .
- **Database Precautions**
     - Data is now being logged within a sub-directory to prevent future crashing in the terminal.
     - Implemented backend precautions within the `mod_log` database to prevent it from acting up.
### Bug Fixes
- **Timestamp Accuracy**
     - Fixed issue regarding how timestamps were processed within the `mod_log`.
- **Null Data**
     - Fixed issue where moderation reasons would return as `NULL` in logs.

## [1.0.0] - [2026-01-21]
*discordbot-host initial release. Forked repo from legbot-host*
