<h1 align="center">
<br>

<img src="./docs/readme_images/ICONS/db-host-icon.png" style="width:150px" alt="db-host-icon">
<br>
DB-Host [Discord Bot Template]
<br>
</h1>

<h4 align="center">A multipurpose bot template built for Moderation, Utility, & Fun.</h4>
<br>

<p align="center">
<a href="https://github.com/AnimatingLegend/discordbot-host/releases">
  <img src="https://img.shields.io/github/v/release/AnimatingLegend/discordbot-host?style=for-the-badge" alt="Bot Version">
</a>
<a href="https://nodejs.org/">
  <img
    src="https://img.shields.io/github/package-json/engines/node/AnimatingLegend/discordbot-host?style=for-the-badge&logo=node.js&logoColor=white"
    alt="Node.js version"
  >
</a>
<a href="https://discord.js.org/">
  <img
    src="https://img.shields.io/github/package-json/dependency-version/AnimatingLegend/discordbot-host/discord.js?style=for-the-badge&logo=discord&logoColor=white"
    alt="discord.js version"
  >
</a>
</p>

<strong>
<p align="center">
TABLE OF CONTENTS <br>
<a href="#overview">Overview</a>
|
<a href="#features">Features</a>
|
<a href="#requirements">Requirements</a>
|
<a href="#building-instructions">Building Instructions</a>
</p>
</strong>

## Overview
This project is based on a previous bot I worked on called **Legbot-host**. Everything in this repository serves as the foundation that Legbot was originally built on.

Since Legbot has finished production, instead of open-sourcing the bot itself, I decided to create a public template that anyone can use, modify, and contribute to. This also helps avoid accidentally releasing sensitive or private data from the original project.

## Features
Here are the current commands available. This list will continue to grow as updates go on. 

> **NOTE**: 
> **THE ACTUAL COMMANDS ARE NOT CAPITALIZED**

### Moderation Commands
- Ban | Unban
- Kick
- Mute | Unmute
- Warn
- Purge
- Mod_Logs | Clear_Mod_Logs
### Utility & Guild Commands
- Channel_Info | Member_Count | Server_Info | User_Info
- Changelog | Github
- Help
- Leaderboard | Rank | Toggle_XP
- Poll
- Uptime
- World_Clock
### Fun Commands
- Cat_Facts | Dog_Facts | Facts
- Joke | Meme
- Revive
- 8ball

For more information on these commands and how to use them, read this **[Command Guide](./docs/COMMAND_GUIDE.md)!**

## Requirements
- NodeJs v25 +
- Discord.js v14 +
- Discord Token, which you can get from the [Discord Developers Portal](https://discord.com/developers/docs/intro)
- **[ALL OF THESE NODE DEPENDCIES](docs/LOCALLY_COMPILING.md/#required-dependencies)**
- The guts and the brains

## Building Instructions
if you want to learn how to locally build this bot yourself, please read [this guide!](docs/LOCALLY_COMPILING.md)
