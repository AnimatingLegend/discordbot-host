# Discordbot-v14 Repo Programming Style Guide

**DISCLAIMER**  
Inspired by the [Funkin' Style Guide](https://github.com/FunkinCrew/Funkin/blob/dummy/develop-v0.7.5/docs/style-guide.md#funkin-repo-code-style-guide).  
This project is written in **Node.js** using **Discord.js v14**, not Haxe / HaxeFlixel.

## Purpose

This document explains how code should be written and maintained for **Discordbot-v14**.  
The goal is consistency, readability, and easy maintenance.

## General Rules

- Readability over clever code  
- Stay consistent within files  
- Avoid unnecessary complexity  
- If it looks confusing, clean it up  

## Variables & Function Names

Use descriptive names.  
Allowed styles:
- `lowerCamelCase`
- `snake_case` (preferred)

Stay consistent per file.

```js
// ==============================
// Long names are fine if they are clear
// ==============================

const commandFiles = [];
const command_files = [];
```

### Guidelines:
- Functions should describe what they do
- Booleans should read clearly
- Avoid single-letter variables unless in short loops

```js
// === Good === \\
const is_ready = true;
function load_commands() {}

// === Avoid === \\
const x = true;
function doThing() {}
```

## File & Folder Naming
- Perfer `snake_case` for folders
- Command files should match the command name
- Event Files should match the Discord event
```
(I hope this directory tree makes sense lol)

commands/
     moderation/
       ban.js
       kick.js
events /
  ready.js
  messageCrate.js
```

## Code Comments
Comments should at **clarity**, not clutter.

### Section Comments
Use **15-20 equal signs** to fully seperate sections
```js
// ==============================================
// Initialize Commands
// ==============================================
client.commands = new Collection();
```

### Inline Section Comments
Use **4-5 equal signs** and close with backslashes
```js
// ===== Recursive command loader ===== \\
function get_command_files(dir) {
    // -- Recursively dive into folders -- \\
}
```

### Light Dividers (optional)
```js
// ----- Command Execution ----- \\
```

### When Comments are NOT Needed
If a command or file is **under 50 lines**, comments are optional unless:
- Logic is complex
- Parameters are unclear
- Behavior is not obvious

## Command Structure
- One responsibility per command
- Keep logic readable or organized
- Avoid stuffing multiple features into one file

### Formatting
- Use consistent indentation
- Seperate logical sections with spacing
- avoid deep resting

**BAD, DO NOT DO THIS**
```js
if (a) {
     if (b) {
          if (c) {

          }
     }
}
```

**GOOD, DO THIS INSTEAD**
```js
if (!a || !b || !c) return;
doThing();
```