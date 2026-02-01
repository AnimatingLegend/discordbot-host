# Discordbot-Host Command Guide
This document explains how to use all available commands in **DB-Host**.

There are currently **30 Commands**, split into 4 categories:
- Moderation
- Utility & Guild
- Fun

[Here is a list of the commands.](../README.md#features)

> **NOTE:**
> Command names are **not capitalized** when used in discord.

## Command Prefix
All commands use the prefix defined in your `bot-config.json` file.

**Example**:
```json
{
     "PREFIX": "!",
}
```
**Command usage:**
```bash
!help
!ban @user <reason> <duration>
```

## Moderation Commands
These commands are intended for server moderation.
Most require moderation permissions to use.

> **IMPORTANT:**  
> When using moderation commands in Discordbot-Host, you **must** provide a reason and/or a time duration for **any moderation action**.

### Duration Format
Time durations follow this format:
`<number>` `<unit>`

**Supported Units:**
- `s` -> seconds
- `m` -> minutes
- `h` -> hours
- `d` -> days
- `w` -> weeks

**Examples:**
- 30m -> 30 minutes
- 6h -> 6 hours
- 7d -> 7 days
- 365d -> 1 year

This format applies only to: **Ban** & **Mute**.

---

### Warn
Warn a member from the server.
```bash
# -- format -- #
warn <user> <reason>

# -- example -- #
!warn @user spamming
```

### Kick
Kick a member from the server.
```bash
# -- format --#
kick <user> <reason>

# -- example -- #
!kick @user breaking rules
```

### Ban / Unban
Ban / Unban a member from the server.
```bash
# -- format -- #
ban <user> <reason> <duration>
unban <user>

# -- example -- #
!ban @user raiding 365d
!unban @user
```

### Mute / Unmute
Mute / Unmute a member from the server.
```bash
# -- format -- #
mute <user> <reason> <duration>
unmute <user>

# -- example -- #
!mute @user spamming 1h
!unmute @user
```

### Purge
Purge a specified number of messages from a text channel.
```bash
# -- format -- #
purge <messages> (1 - 100)

# -- example -- #
!purge 50
```

### Mod Logs / Clear Mod Logs
Get mod logs, or clear the mod logs of a specific user in your server.
```bash
# -- format -- #
mod_logs <user>
clear_mod_logs <user>

# -- example -- #
!mod_logs @user
!clear_mod_logs @user
```

## Utility & Guild Commands
Most Utility & Guild commands are straightforward and require little explanation. Below are commands that have specific usage rules.

### Welcome Setup
Configures a professional **[Carl-Bot](https://carl.gg/)** style join and leave logs for the server. This system uses embeds to track account age, member count, and join/leave timestamps.
```bash
# -- format -- #
welcome_setup <type> <#channel|status>

# -- example -- #
!welcome_setup welcome #welcome-channel
!welcome_setup leave #leave-channel
!welcome_setup welcome false
!welcome_setup leave true
```

**Types**:
- `welcome` - Configures the logging for new members joining the server.
- `leave` - Configures the logging for members departing the server.

**Values**:
- **Channel Mention**: Providing a channel (e.g., `#welcome-channel`) sets that channel as the log destination and automatically enabled the system for that type.
- **Status Keywords**: Use `off`, `false`, or `0` to disable logs, Use `on`, `true`, or `1` to re-enable logs using the previously saved channel.

### XP Setup
Enables and disables the XP system for a server or specific channels, or sets a dedicated channel for 'level-up' announcements.
```bash
# -- format -- #
xp_setup <scope|subcommand> <value|channel>

# -- example -- #
!xp_setup server true
!xp_setup channel false
!xp_setup levelup_channel #levels
```
**Scopes**:
- `server` - Affects the entire guild.
- `channel` - Affects on the channel the command is typed.

**Subcommands**:
- `levelup_channel`: Sets where the bot posts 'level-up' messages. Providing a channel mention enables it; providing `off`, `false` or leaving it blank disables it.

**Values**:
- **For Scopes**: `true`/`false`, `1`/`0`, `on`/`off`
- **For Subcommand**: A channel mention (e.g., `#general`) or a status keyword (`off`, `false`, `0`)

### Poll
Creates a poll with multiple answer questions.
```bash
# -- format -- #
poll <question> | <answer>

# -- example -- #
!poll What should we add? | Music channel, Gaming Channel, Announcments
```
- Seperate the question and answers using `|`
- You can add up to **10** answer options

## Fun Commands
Fun commands are simple to use. Below is one example.

### 8ball
Ask the magic discordbot a question!
```bash
# -- format -- #
8ball <question>

# -- example -- #
!8ball will my girlfriend ever get back with me?
```

If successful, it will shoot out a randomized answer

**Example:**

![alt text](./readme_images/COMMANDS/eight-ball.png)