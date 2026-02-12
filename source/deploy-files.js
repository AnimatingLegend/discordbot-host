const { path, fs, logger } = require('./libs.js');

module.exports = (client) => {

     // ==============================================
     // Load Commands
     // ==============================================
     const getFiles = (dir) => {
          let results = [];

          const list = fs.readdirSync(dir, { withFileTypes: true });

          for (const file of list) {
               const res = path.resolve(dir, file.name);

               // -- Recursivily dive into subdirectories -- \\
               if (file.isDirectory())
                    results = results.concat(getFiles(res));
               else if (file.isFile() && file.name.endsWith('.js'))
                    results.push(res);
          }

          return results;
     };

     const command_files = getFiles(path.join(__dirname, './commands'));
     const loaded_commands = [];

     for (const file of command_files) {
          const command = require(file);
          const command_name = command.data?.name || command.name;

          // -- assuming you command files exports a command object -- \\
          if (command_name && typeof command.execute === 'function') {
               client.commands.set(command_name, command);

               loaded_commands.push({
                    COMMAND_NAME: command.data.name,
                    FILE_PATH: path.relative(process.cwd(), file)
               });
          } else {
               logger.warn(`The command at ${file} is missing a required "data.name" property.`);
          }
     }

     // ==== Logging Commands ==== \\
     console.log(`------ Loaded Commands ------`);
     console.table(loaded_commands);
     logger.success(`${loaded_commands.length} command(s) loaded from ${command_files.length} file(s)`);

     // ==============================================
     // Load Events
     // ==============================================
     const event_files = getFiles(path.join(__dirname, './events'));
     const loaded_events = [];

     for (const file of event_files) {
          const event = require(file);
          const method = event.once ? 'once' : 'on';

          if (event.name) client[method](event.name, (...args) => event.execute(...args));

          loaded_events.push({
               EVENT_NAME: event.name,
               FILE_PATH: path.relative(process.cwd(), file)
          });
     }

     // ==== Logging Events ==== \\
     console.log(`------ Loaded Events ------`);
     console.table(loaded_events);
     logger.success(`${loaded_events.length} events loaded from ${event_files.length} file(s)`);
};