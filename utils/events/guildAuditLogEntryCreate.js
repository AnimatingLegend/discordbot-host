const { AuditLogEvent, Events } = require('discord.js');
const { db } = require('../database.js');

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
          // -- only proceed if an action type was found -- \\
          if (actionType) {
               try {
                    // -- user `db.db` if the database utils exports and obj, otherwise use `db` -- \\
                    const database = db.db || db;

                    const STMT = database.prepare(`
                         INSERT INTO mod_logs (user_id, mod_id, action, reason, timestamp)
                         VALUES (?, ?, ?, ?, ?);
                    `);

                    STMT.run(
                         targetId,
                         executorId,
                         actionType,
                         reason || 'No reason provided.',
                         Date.now()
                    );
               } catch (err) {
                    console.error(`[ERROR] - Failed to log audit entry to DB: ${err}`);
               }
          }
     }
};
