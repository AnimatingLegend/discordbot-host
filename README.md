# Discordbot-Host [A Discord Bot Template]
Discordbot-Host is a multipurpose Discord bot template built for moderation, utility, and fun.

This project is based on a previous bot I worked on called **Legbot-host**. Everything in this repository serves as the foundation that Legbot was originally built on.

Since Legbot has finished production, instead of open-sourcing the bot itself, I decided to create a public template that anyone can use, modify, and contribute to. This also helps avoid accidentally releasing sensitive or private data from the original project.

## Features
Here are the current commands available. This list will continue to grow as updates go on. 

(*note: the actual commands are not capitialized*)

### Moderation Commands
- Warn `<user>`
- Kick `<user>`
- Ban | Unban `<user>`
- Mute | Unmute `<user>`
- Purge `<messages>` | `<1 - 100>`
- Mod_Logs `<info>` | `<user>`
- Clear_Mod_Logs `<info>` | `<user>`
### Utility Commands
- Help `<info>`
- Server_Info | Channel_Info | User_Info `<info>`
- World_Clock `<info>`
- Poll `<info>` | `<moderation>`
- Member_Count `<stats>`
- Uptime `<stats>`
- Github `<source>`
- Changelog `<source>`
### Fun Commands
- Cat_Facts | Dog_Facts | Facts `<fun>` | `<info>`
- Revive `<fun>` | `<info>`
- 8ball
- Joke
- Meme

## Requirements
- NodeJs v25 +
- Discord.js v14 +
- Discord Token, which you can get from the [Discord Developers Portal](https://discord.com/developers/docs/intro)
- **[ALL OF THESE NODE DEPENDCIES](docs/LOCALLY_COMPILING.md/#required-dependencies)**
- The guts and the brains

## Building Instructions
if you want to learn how to locally build this bot yourself, please read [this guide!](docs/LOCALLY_COMPILING.md)
