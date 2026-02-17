# Changelog
All noteable changes will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]
### Added
- **New Commands**:
     - `/weather`
          - Utility Command
          - NPM Package Used: **[`openmeteo`](https://open-meteo.com/)**
          - View the new command and how it works the **[command guide](./docs/COMMAND_GUIDE_README/GUILD_N_UTILITY_COMMANDS.md#weather)**
     - `/tictactoe`
          - Fun Command
          - NPM Package Used: **[`discord-gamecord`](https://www.npmjs.com/package/discord-gamecord)**
          - View the new command and how it works in the **[command guide](./docs/COMMAND_GUIDE_README/FUN_COMMANDS.md/#tictactoe)**
### Changed
- **Source Code Optimization**:
     - All node packages / dependencies are now being dynamically imported in one file. ([`libs.js`](./source/libs.js))
     - The Following classes & commands are now being logged dynamically:
          - Fact commands: (`/cat_facts`, `/dog_facts`, `/facts`)
          - Bot client (`onReady`)
          - All Databases configured for this bot.
     - Cleaned up bot configuration by separating them into sub-categories (e.g., `"main_config": {}`, `"misc_config": {}`).
          - View changes **[here](./config.example.json)**
          - Read the Updated configuration doc **[here](./docs/CUSTOM_BOT_CONFIGURATION/DISCORD_BOT_CONFIGUATION.md)**
     - The bots Prefix handler is being initialized dynamically.
          - View new message handler **[here](./source/events/client/interactionCreate.js)**
- **Expanded `random-colors` Functionality**:
     - `random()`:
          - Selects a random HEX code from the `colors.json` database.
          - **EX: `colors.random()`**
     - `resolve(hex)`:
          -  Converts a HEX string into a 24-bit integer to prevent crashing.
          - **EX: `colors.resolve('#00a896')`** (dark green)
     - `shift(name, percent)`:
          - Adjusts brightness, and tint of a stored color. 
          - **EX: `colors.shift('DarkGreen', 5)`**
     - `static(name)`:
          - Get a case-insensitve lookup for a specific color. 
          - **EX: `colors.static('DarkGreen')`**
     - **DOCUMENTATION COMING SOON**
- **The following commands have been updated visually**:
     - `/changelog`:
          - Added 'deep-scan' indentation that converts discords messy markdown lists into a nice structured tree.
               - **New Symbols**: 🔹, ◦, and L
          - Added vertical spacing between major categories and headers for mobile support.
          - File paths are now automatically converted to absolute GitHub URLs, making it visually appealing and clickable.
          - Updated embed heading.
          - Fixed the `1024` character limit crash by adding an auto-splitter.
     - `/channel_info`:
          - Category, Created Date, & Channel Type are now aligned.
          - Server topics are now displayed as sub-headers for better context.
     - `/server_info`:
          - Added dynamic timestamps, tracking server age.
          - High-res thumbnails.
          - Added Server ID to footer.
     - `/user_info`:
          - The embed side-bar should now match to the target users role color.
          - Added dynamic timestamps tracking account age, and joining a server.
### Fixed
- **Consistent Bot Crashing**:
     - Fixed issue where if you type **any** guild command, the entire bot client would crash, or display an error message.
     - Fixed issue where bot would crash due to messed up parameters in `index.js`. (whoops, my bad!)
- **Logging Issues**:
     - Fixed issue where `guild_xp_settings` and `channel_xp_settings` would log `[TRUE]`, even when disabled.
### Removed
- **The following node packages**:
     - `@discordjs/rest`
     - `@discordjs/voice`
     - `ffmpeg-static`
     - `libsodium-wrappers`
     - `ytdl-core`

- `random-emojis` support.

## [2.4.0] - [2026-02-10]
### Complete Source Code Overhaul:
- All of your bots code is stored in the new `source` directory.
- You can now put `events` in sub-directories.
- The `database` directory is now separate from `utils`.
- **Logging Overhaul**:
     - Code is now being logged with [`winston`](https://www.npmjs.com/package/winston), instead of the regular `console.log()`.
     - Added icons with colors to differentiate what is being logged:
          - `error` = Red
          - `warn` = Yellow
          - `success` = Green
          - `info` = Blue
          - `debug` = Magenta
     - Made logging more clean and concise. (no more jumbled up logging!)
     - Seperated logging logic to whatever is being logged.
- **Bot Client Overhaul**:
     - The bots **file logic** is now separated from `index.js`. (**[view file code here](./source/deploy-files.js)**)
     - The bots `onReady` logic is separated from `index.js` (**[view `onReady` code here](./source/events/client/ready.js)**)

## [2.3.2] - [2026-02-04]
> **This update log will be broken up into 2 parts:**
> **[Documentation](#documentation-updates), & [Bot Changes/Fixes](#bot-updates)**

## Bot Updates
### Changed
- **Welcome / Leave System Tweakups**
     - Updated both embeds to be more concise.
          - Added Ordinal numbers to keep a structured order of who joined.
          - Added roles to leave embed.
          - Added a updated timestamp to let users know when someone joined or left.
- **Safety & Permission Checks**
     - Users with **moderation perms** should now only have access to `/welcome_setup`.
### Fixed
- **`/xp_setup` Bugs**
     - Fixed issue where the command used syntax of the old command name.
     - Fixed issue where the command would repeat your command error instead of telling you how to properly use it.
     - Fixed `undefined` error due to `config` variable having parameters.

## Documentation Updates
> **Readme Guide Overhaul PT.2**
### Added
- Added new images to the following readmes:
     - [Command Guide README](https://github.com/AnimatingLegend/discordbot-host/blob/develop/docs/COMMAND_GUIDE_README/README.md)
     - [Guild, Utility, & Configuration Command Guide](https://github.com/AnimatingLegend/discordbot-host/blob/develop/docs/COMMAND_GUIDE_README/GUILD_N_UTILITY_COMMANDS.md)
### Changed
- Guides are now seperated into sections:
     - **Command Guide**: 
          - [Fun Commands](./docs/COMMAND_GUIDE_README/FUN_COMMANDS.md) 
          - [Guild, Utility, & Configuration Commands](./docs/COMMAND_GUIDE_README/GUILD_N_UTILITY_COMMANDS.md)
          - [Moderation Commands](./docs/COMMAND_GUIDE_README/MODERATION_COMMANDS.md)
     - **Contributing Guide**:
          - [Contributing Readme](./docs/CONTRIBUTING/CONTRIBUTING.MD) 
          - [Programming Guide](./docs/CONTRIBUTING/PROGRAMMING_GUIDE.md)
     - **Bot Configuration Guide**: 
          - [Configuration Readme](./docs/CUSTOM_BOT_CONFIGURATION/DISCORD_BOT_CONFIGUATION.md)
          - [Locally Compiling Guide](./docs/CUSTOM_BOT_CONFIGURATION/LOCALLY_COMPILING.md)
### Fixed
- Fixed a plethora of grammar mistakes, and typos throughout all the readmes.

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
