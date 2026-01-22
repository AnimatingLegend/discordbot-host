# Discord Bot Configuration's

This document covers everything you need to know about setting up your discord token, and configuring your bot.

*NOTE: This bot uses a custom `.config` file system to load configuration values such prefixes and public data from your bot*

**DISCLAIMER: you can NEVER share your bot token. If your token is leaked, regenerate it IMMEDIATELY from the [Discord Developer Portal](https://discord.com/developers/docs/intro)**

## Create a Discord Bot Token
- Go to the **[Discord Developer Portal](https://discord.com/developers/docs/intro)**
- Click **New Application**, and go to the **Bot** tab.
- Click **Add Bot** (if one isn't already created)
- Under **Token**, click **Reset Token** or **Copy Token**
- Once everything is done, save your token somewhere safe.

## Enviornment Configuration (.env)
This project uses environment variables to keep sensitive data secure.

### 1. Create a `.env` File
In the `api` directory of your project, create a file name:
`token.env`
### 2. Add your bot Bot Token
Inside the `.env` file, add:
```bash
PRIVATE_APIKEY = "PUT_API_TOKEN_HERE"
```
**Example:**
```bash
# NOTE: THIS IS NOT A REAL TOKEN.
PRIVATE_APIKEY = "MzA1Njc4OTAxMjM0NTY3ODk0.GxXXXX.XXXXXXXX"
```

## Optional Configuration
Depending on your setup, you may also include:
```bash
CLIENT_ID = "YOUR_APPLICATION_ID"
GUILD_ID = "YOUR_TEST_SERVER_ID"
```
These are commonly used for:
- Slash command registration
- Development-only guild commands

## Loading Enviornment Variables
Make sure the **`dotenv`** node dependency is installed if it isn't already:
```powershell
npm install dotenv
```
You dont need to worry about initializing your token because it already done for your in **[index.js](../index.js)!**
```js
// ----- Line 25 of index.js ----- \\
require('dotenv').config({ path: path.resolve(__dirname, './api/data/token.env') });
```

## Using a Config File **(Required)**
This template uses both `.env` and `.config` files. You dont need to worry about creating a `config.js` file, because it's already created for you also! ([view the file here](../api/config.js))

Here is the current config structure written in [index.js](../index.js)
```js
// ----- Line 15 - 23 of index.js ----- \\
const config = require('./api/config.js');
const path = require('node:path');
const fs = require('node:fs');

client.config = {
    PREFIX: config.PREFIX,
    PUBLIC_ID: config.PUBLIC_ID,
    PUBLIC_APIKEY: config.PUBLIC_APIKEY,
};
```
It is ideal that you keep all configuration values in **one place**.

*Note that this project does **not** store sensitve values directly into `.js` files.
Instead, it uses a plain text `.config` file that is parsed at runtime.*

---

### 1. Create the config file
Navagate to the `api` directory
```tree
.
├── api/
│   └── data/
└── config.js
```
Inside the file `data` folder, create a file called: **`discordbot.config`**.

### 2. Add Configuration Values
Inside `discordbot.config` add your values using the following format:
```bash
KEY=VALUE
```
Example:
```bash
PREFIX=!
CLIENT_ID=123456789012345678
```

- Each value must be on its own line
- Do not wrap values in quotes
- Spaces before or after `=` are trimmed automatically

## How does the Config Loader work?
The bot reads the config file using **Node.js file system utilities**.

- The file is read as plain text
- Each line is split using `=` (an equal sign)
- Keys and values are stored in a config object
- Values can be accessed anywhere in the project

**Example:**
```js
const config = require('./api/data/discordbot.config');

console.log(config.PREFIX);
client.login(config.PRIVATE_APIKEY) || client.login(process.env.PRIVATE_APIKEY);
```

## Important Security Notes
- **NEVER COMMIT** `.env` **FILES** 
- Make sure `.env` is listed in **[`.gitignore`](../.gitignore)**
- Do not hardcode tokens in source files
- Regenerate your token IMMEDIATELY if leaked.

## Verifying your setup
Run the bot:
```powershell
npm start
```
or
```powershell
node index.js
```
If the bot logs successfully without errors. your token and configuration are set up correctly.

**You are now ready to start developing your discord bot!**