const { AuditLogEvent, Events } = require('discord.js');
const client = require('../../index.js');
const db = require('../database.js');

module.exports = {
     name: Events.GuildAuditLogEntryCreate,

     async execute(auditLog, client) {
          const { action, executorId, targetId, reason, extra } = auditLog;

          let actionType = '';

          // === MAP AUDIT LOG TYPES TO YOUR LOG ACTIONS == \\
          switch (action) {
               case AuditLogEvent.MemberBanAdd: actionType = 'Ban'; break;
               case AuditLogEvent.MemberBanRemove: actionType = 'Unban'; break;
               case AuditLogEvent.MemberKick: actionType = 'Kick'; break;
               case AuditLogEvent.MemberUpdate:
                    // -- check if the update was a timeout (mute) -- \\
                    const timeoutChange = auditLog.changes.find(c => c.key === 'communication_disabled_until');
                    if (timeoutChange) timeoutChange.new ? 'Mute' : 'Unmute';
                    break;
          }

          if (actionType) {
               const STMT = db.prepare(`INSERT INTO modlogs (guildId, userId, userTag, modTag, action, reason, timestamp) VALUES ('${auditLog.guild.id}', '${executorId}', '${executorId}', '${targetId}', '${actionType}', '${reason}', ${Date.now()})`);
               STMT.run(targetId, executorId, actionType, reason, Date.now());
          }
     }
};
