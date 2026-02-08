const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const file_system = require('node:fs');
const file_path = require('node:path');

const config = require('../../../config.json');

// ================================================
// Parse ALL VERSIONS and their content from CHANGELOG.md
// ================================================
function parse_changelog(changelog_content) {
     const versions = [];

     const sections = changelog_content.split('## [');
     sections.shift(); // Remove the content before the first header

     for (const section of sections) {
          // -- Split into lines -- \\
          const lines = section.trim().split('\n');

          // -- Extract the header line -- \\
          const headerLine = lines.shift();

          // -- Extract the body -- \\
          const body = lines.join('\n').trim();

          if (headerLine && body) {
               versions.push({
                    // -- Extract version (e.g., '2.1.0') from the headerLine -- \\
                    version: headerLine.split('](').shift().trim(),
                    // -- The main content body -- \\
                    content: body,
                    // -- Extract date/link (e.g., '2025-01-01') -- \\
                    date: headerLine.split('](').pop().replace(')', '').trim()
               });
          }
     }

     return versions;
};

// ================================================
// Initialize The command itself
// ================================================
module.exports = {
     data: new SlashCommandBuilder()
          .setName('changelog')
          .setDescription(`Read up on the latest changes for ${config.BOT_USERNAME}`)
          .addStringOption(option =>
               option.setName('version')
                    .setDescription('Specify a version number (e.g. 2.1.0, or Unreleased). Leave empty for Latest.')
                    .setRequired(false)
          ),

     name: 'changelog',
     description: `Read up on the latest changes for ${config.BOT_USERNAME}`,

     async execute(ctx, args) {
          // ==== Command Handling ==== \\
          // -- for some odd reason, i have to hardcode the command prefix's here bc it doesnt work otherwise -- \\
          let requested_version;

          if (ctx.options)
               requested_version = ctx.options.getString('version');
          else if (ctx.content && args && args.length > 0)
               requested_version = args[0];

          // ===== Version Control / Data Parsing ===== \\
          const changelog_md = file_system.readFileSync(file_path.join(__dirname, '../../CHANGELOG.md'), 'utf-8');
          const all_versions = parse_changelog(changelog_md);

          let target_version_data;

          if (requested_version) {
               target_version_data = all_versions.find(v => v.version.includes(requested_version));

               if (!target_version_data) {
                    const embed = new EmbedBuilder()
                         .setColor('#e74c3c')
                         .setTitle(`:x: Could not find details for version **'${requested_version}'**. :x:`)
                         .setDescription('Here are the available versions:')
                         .addFields(
                              { name: 'Available Versions', value: `**${all_versions.map(v => `\`[${v.version}\``).join('\n')}**` }
                         )
                         .setFooter({ text: `Use the command again with a specific version name \n(e.g., \`${config.PREFIX}changelog 1.0.0\`)` });

                    return await ctx.reply({ embeds: [embed], ephemeral: true });
               }
          } else {
               const versionList = all_versions.map(v => `\`[${v.version}\``).join('\n');

               const embed = new EmbedBuilder()
                    .setColor('#3498DB')
                    .setTitle(':ballot_box_with_check: Available Versions: :ballot_box_with_check:')
                    .setDescription(`**${versionList}**`)
                    .setFooter({ text: `Use the command again with a specific version name \n(e.g., \`${config.PREFIX}changelog 1.0.0\`)` });

               return await ctx.reply({ embeds: [embed], ephemeral: true });
          }

          if (!target_version_data)
               return await ctx.reply({ content: `:x: Could not find the requested version. Please try again.`, ephemeral: true });
          else
               target_version_data.date = target_version_data.date || 'N/A';

          // ===== Pagination logic ===== \\
          const CONTENT = target_version_data.content;
          const MAX_LENGTH = 3500; // -- leave room for title and date -- \\
          const PAGES = [];

          if (CONTENT.length > MAX_LENGTH) {
               // -- split content into pages -- \\
               let current_page = '';

               const lines = CONTENT.split('\n');
               for (const line of lines) {
                    if (current_page.length + line.length > MAX_LENGTH) {
                         PAGES.push(current_page);
                         current_page = line + '\n';
                    } else {
                         current_page += line + '\n';
                    }
               }
               PAGES.push(current_page); // -- push the last page -- \\
          } else {
               PAGES.push(CONTENT);
          }

          let CUR_PAGE_INDEX = 0;

          // ===== Embed Logic ===== \\
          const generateEmbed = (index) => {
               return new EmbedBuilder()
                    .setColor('#3498DB')
                    .setTitle(`:newspaper: ${config.BOT_USERNAME} - Changelog || [${target_version_data.version} :newspaper:`)
                    .setDescription(PAGES[index])
                    .setFooter({ text: `note: if the formatting looks weird, thats just how discord markdown looks.` });
          };

          const get_row = () => {
               if (PAGES.length === 1) return [];
          };

          // -- Send init reply -- \\
          const reply = await ctx.reply({
               embeds: [generateEmbed(CUR_PAGE_INDEX)],
               components: get_row(CUR_PAGE_INDEX),
               fetchReply: true
          });

          // -- Start collector (if more than 1 page) -- \\
          if (PAGES.length > 1) {
               const collector = reply.createMessageComponentCollector({ idle: 60000 });

               collector.on('collect', async i => {
                    await i.update({
                         embeds: [generateEmbed(CUR_PAGE_INDEX)],
                         components: get_row(CUR_PAGE_INDEX)
                    });
               });

               collector.on('end', () => {
                    // -- Disable all buttons when the collector ends -- \\
                    const final_row = get_row(CUR_PAGE_INDEX);

                    if (final_row.length > 0) {
                         final_row[0].components.forEach(b => b.setDisabled(true));
                         ctx.editReply({ components: final_row });
                    }
               });
          }
     },
};
