# Discord Bot Configuration's

This document covers everything you need to know about setting up your discord token, and configuring your bot.

> **NOTE #1:**
> This bot uses a **`.json` file system** to load configuration values such as the thes **bot token**, **username**, **prefix**, & **ID's**

> **NOTE #2:**
> **NEVER share your bot token.** If your token is leaked, regenerate it **IMMEDIATELY** from the **[Discord Developer Portal](https://discord.com/developers/docs/intro)**

## Create a Discord Bot Token
- Go to the **[Discord Developer Portal](https://discord.com/developers/docs/intro)**
    - Click **New Application**
- Open the **Bot** tab
    - Click **Add Bot** (if one doesn't already exist)
- Under **Token** click **Reset Token** or **Copy Token**
    - Store the token somewhere safe

## Bot Configuration
To keep things simple, this bot only uses **one JSON file** for all configuration values.

### 1. Create the configuration file
In the root directory of your project, create a file named:
``` bash
config.json
```
### 2. Add Required Values
Use the following format inside the file:

```json

"main":{
    "BOT_TOKEN": "BOT_TOKEN_HERE",
    "BOT_USERNAME": "BOT_USERNAME_HERE",
    "BOT_PREFIX": "BOT_PREFIX_HERE",
    "BOT_VERSION": "BOT_VERSION_HERE"
}
```
*format reference:* `config.example.json` **([file link](../../config.example.json))**

## Optional Configuration
These values are optional and only used if provided:
```json
"misc": {
    "GITHUB": "BOTS_GITHUB_LINK",
    "INVITE": "BOTS_INVITE_LINK"
}
```
## Initializing your bot
Now that you configured your bot, its time to initialize it.

> Read the **[Compiling Guide](./LOCALLY_COMPILING.md)** for a more detailed breakdown on how to initialize your bot.

**1.** Make sure the `config.json` file is filled out correctly

**Example:**
```json
// NOTE: THESE VALUES ARENT REAL
{
    "BOT_TOKEN": "MzA1Njc4OTAxMjM0NTY3ODk0.GxXXXX.XXXXXXXX",
    "BOT_USERNAME": "Krab-Bot",
    "BOT_PREFIX": "kb-",
    "BOT_VERSION": "1.0.0"
}
```
**2.** Install dependencies:
``` bash
npm install
```

**3.** Start the bot:
``` bash
npm start
```

If the configuration is successful, the bot will log all of your values, and appear online.