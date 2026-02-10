const { Events, ActivityType } = require('discord.js');
const { READY_LOG } = require('../../utils/logging/READY_LOG.js');

module.exports = {
     name: Events.ClientReady,
     once: true,

     execute(client) {
          const statusText = `Your Commands | ${client.config.PREFIX}help`;

          client.user.setActivity(statusText, {
               type: ActivityType.Watching
          });

          READY_LOG(client);

          return;
     },
};