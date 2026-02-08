const file_system = require('node:fs');
const file_path = require('node:path');

const logger = require('./utils/logger.js');

module.exports = (client) => {

     // ==============================================
     // Load Commands
     // ==============================================
     const getFiles = (dir) => {
          let results = [];

          const list = file_system.readdirSync(dir, { withFileTypes: true });

          for (const file of list) {
               const res = file_path.resolve(dir, file.name);

               // -- Recursivily dive into subdirectories -- \\
               if (file.isDirectory())
                    results = results.concat(getFiles(res));
               else if (file.isFile() && file.name.endsWith('.js'))
                    results.push(res);
          }

          return results;
     };

     const command_files = getFiles(file_path.join(__dirname, './commands'));
     const loaded_commands = [];

     for (const file of command_files) {
          const command = require(file);
          const command_name = command.data?.name || command.name;

          // -- assuming you command files exports a command object -- \\
          if (command_name && typeof command.execute === 'function') {
               client.commands.set(command_name, command);

               loaded_commands.push({
                    COMMAND_NAME: command.data.name,
                    FILE_PATH: file_path.relative(process.cwd(), file)
               });
          } else {
               logger.warn(`[WARNING] The command at ${file} is missing a required "data.name" property.`);
          }
     }

     // ==== Logging ==== \\
     logger.info(`[LOADING] ${loaded_commands.length} commands loaded from ${command_files.length} file(s)`);
     console.log(`------ Loaded Commands ------`);
     console.table(loaded_commands);
     console.log(`------ Total Commands ------`);
     console.log(client.commands.size);

     // ==============================================
     // Load Events
     // ==============================================
     const event_files = getFiles(file_path.join(__dirname, './events'));
     const loaded_events = [];

     for (const file of event_files) {
          const event = require(file);
          const method = event.once ? 'once' : 'on';

          if (event.name) client[method](event.name, (...args) => event.execute(...args));

          loaded_events.push({
               EVENT_NAME: event.name,
               FILE_PATH: file
          });
     }

     // ==== Logging ==== \\
     logger.info(`[LOADING] ${loaded_events.length} events loaded from ${event_files.length} file(s)`);
     console.log(`------ Loaded Events ------`);
     console.table(loaded_events);
     console.log(`------ Total Events ------`);
     console.log(loaded_events.length);
};