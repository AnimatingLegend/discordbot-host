# Utility, Guild & Configuration Commands
Most Utility & Guild commands are straightforward and require little explanation.

**Simple Util Command Example**:

![alt image](./images/util_cmd.png)

Below are commands that have specific usage rules.

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

## Configuration Commands
Configuration commands are (somewhat) complex commands that users can use to configure their bot to what they deem comfortable for their own server.

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