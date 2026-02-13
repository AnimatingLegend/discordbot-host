const {
     ActivityType, Events,
     logger, config
} = require('../../libs.js');

const { ReadyLog } = require('../../utils/logging/client/ReadyLog.js');

module.exports = {
     name: Events.ClientReady,
     once: true,

     execute(client) {
          client.user.setActivity(`Your Commands | ${config.main.BOT_PREFIX}help`, {
               type: ActivityType.Watching
          });

          return ReadyLog(client, logger, config);
     },
};