const { AuditLogEvent, Events } = require('../../libs.js');
const { addModLog } = require('../../database');

module.exports = {
     name: Events.GuildAuditLogEntryCreate,

     async execute(auditLog) {
          const { action, executorId, targetId, reason, extra } = auditLog;

          let actionType = '';

          // === MAP AUDIT LOG TYPES === \\
          switch (action) {
               case AuditLogEvent.MemberBanAdd: actionType = 'Ban'; break;
               case AuditLogEvent.MemberBanRemove: actionType = 'Unban'; break;
               case AuditLogEvent.MemberKick: actionType = 'Kick'; break;
               case AuditLogEvent.MemberUpdate:
                    const timeoutChange = changes.find(c => c.key === 'communication_disabled_until');
                    if (timeoutChange) { actionType = timeoutChange.new ? 'Mute' : 'Unmute'; }
                    break;
          }

          // === LOG ACTION TO DATABASE === \\
          if (!actionType || !executorId || !targetId) return;

          try {
               addModLog(targetId, executorId, actionType, reason || 'N/A');
          } catch (err) {
               console.error(`[ERROR] Failed to log audit entry: ${err}`);
          }
     },
};
