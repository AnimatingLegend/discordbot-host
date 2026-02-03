# Moderation Commands
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