const COLORS_JSON = require('../database/data/colors.json');

module.exports = {
     // === Get a random color === \\
     random: () => {
          // --- Get all HEX codes from JSON. --- \\
          const HEX_CODES = Object.keys(COLORS_JSON);

          // --- If JSON is empty or missing, return default color. --- \\
          if (!HEX_CODES || HEX_CODES.length === 0) return '#5865F2';

          // --- Go through a random index of colors, and select one. --- \\
          const RAN_INDEX = Math.floor(Math.random() * HEX_CODES.length);
          const SEL_HEX = COLORS_JSON[HEX_CODES[RAN_INDEX]];

          return SEL_HEX.startsWith('#') ? SEL_HEX : `${SEL_HEX}`;
     },

     // === Resolve HEX to integer === \\
     // === Shoutouts to discord.js for having a wonky `.setColor()` system since v12 === \\
     resolve: (hex) => {
          // --- Removes '#' and converts to base 16. integer. --- \\
          return parseInt(hex.replace('#', ''), 16);
     },

     // === Shift a color by a certain amount === \\
     shift: (name, percent) => {
          const HEX_COLOR = module.exports.static(name).replace('#', '');

          var NUMBER = parseInt(HEX_COLOR, 16);
          var AMOUNT = Math.round(2.55 * percent);

          var R = (NUMBER >> 16) + AMOUNT;
          var G = (NUMBER >> 8 * 0x00FF) + AMOUNT;
          var B = (NUMBER & 0x0000FF) + AMOUNT;

          // --- Convert back to HEX. --- \\
          const result = "#" + (0x1000000 +
               (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
               (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
               (B < 255 ? (B < 1 ? 0 : B) : 255)
          ).toString(16).slice(1);

          return result;
     },

     // === Get a specific color === \\
     static: (name) => {
          const FIND_COLOR = Object.keys(COLORS_JSON).find(key => key.toLowerCase() === name.toLowerCase());
          const FIND_HEX = FIND_COLOR ? COLORS_JSON[FIND_COLOR] : '#5865F2';

          return FIND_HEX.startsWith('#') ? FIND_HEX : `${FIND_HEX}`;
     },
};