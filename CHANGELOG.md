# Changelog
All noteable changes will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]
### Changed
- **Saftey & Permission Checks**
     - Users with **moderation perms** should now only have access to `/welcome_setup`.
### Fixed
- **`/xp_setup` Bugs**
     - Fixed issue where the command used syntax of the old command name.
     - Fixed issue where the command would repeat your command error instead of telling you how to properly use it.

## [2.3.1] - [2026-02-03]
### Changed
- **Node Version Control**
     - Downgraded Node.js from v25 ==> v24 for better stability.
          - [Download Node.Js v24](https://nodejs.org/en/download)
### Fixed
- **Emoji Formatting**
     - Fixed issue with the emoji syntax for the level-up message.
- **Softcoding Bot configuration**
     - Bot should now be using up-to-date softcoded data throughout the repo.
     
## [2.3.0] - [2026-02-01]
### Added
- **Welcome / Leave Toggle System**
     - Created `/welcome_setup` command
     - Automated embeds for member joins (account age) and leaves (duration of stay).
     - For more info on how to use this command, read the **[Command Guide](./docs/COMMAND_GUIDE.md/#welcome-setup/)**.
### Changed
- **`/toggle_xp` Command Tweaks**
     - Renamed `/toggle_xp` ==> `/xp_setup`
     - Complete code overhaul to improve readability and performance.
     - Added `levelup_channel` subcommand to set dedicated annoucement channels.
     - For more info on how to use the subcommand, read the **[Command Guide](./docs/COMMAND_GUIDE.md/#toggle-xp)**.
- **Bot Configuration Overhaul**
     - Moved bot settings from `.env` & `.config` to a structured `bot-config.json` file.
     - For more info, read the **UPDATED [Discord Config Guide](./docs/DISCORD_BOT_CONFIGUATION.md)**.
### Fixed
- **XP Traffic Jam**
     - If a `#level-up` channel isnt picked, the bot just level-ups the user in the channel they were already typing in.
     - Rearranged the code so that the bot saves your data before it worries about sending a message.
     - Users should NOW earn points regardless of your server settings.
### Removed
- Completely removed `.config` & `dotenv` support in favor of JSON.

## [2.2.1] - [2026-01-26]

> **NOTE: 
> This is more focused on ***guide documentation*** rather than actual bot changes and fixes.**

### Changed
- **Licensing**
     - Switched DB-Host to the **[MIT LICENSE](https://github.com/AnimatingLegend/discordbot-host/blob/main/LICENSE.md)**.
- **README Overhaul**
     - Added DB-Host's Discord icon.
     - Added [Shields.io](https://shields.io/badges) badges for Discord.js, Node.js & versioning.
     - Included table of contents for better navigation.
     - View changes **[here](https://github.com/AnimatingLegend/discordbot-host/blob/main/README.md)**
- **Compiling Guide Overhaul**
     - Rewrote steps to be more descriptive.
     - Updated terminal images.
     - Added compiling video if your bot compiled successfully.
     - View changes **[here](https://github.com/AnimatingLegend/discordbot-host/blob/main/docs/LOCALLY_COMPILING.md)**
### Fixed
- **Directory Structure in programming guide**
     - Updated the directory tree to make it look more concise
     - View changes **[here](https://github.com/AnimatingLegend/discordbot-host/blob/main/docs/PROGRAMMING_GUIDE.md#file--folder-naming)**
- **Documentation Cleanup**
     - Fixed a plethora of typos across multiple different README files.

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
