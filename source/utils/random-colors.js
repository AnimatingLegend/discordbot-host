const COLORS_JSON = require('../database/data/colors.json');

module.exports = {
     /**
      * Get a random HEX color.
      * @param {string[]} HEX - Array of colors from `colors.json`
      */
     random: () => {
          /**
           * Get all HEX codes from `colors.json`
           * @type {string[]}
           */
          const HEX_CODES = Object.keys(COLORS_JSON);

          // If JSON is empty or missing, return default color.
          if (!HEX_CODES || HEX_CODES.length === 0) return '#5865F2';

          /**
           * Go through a random index of colors, and select one.
           * @returns {string} - HEX color
           */
          const RAN_INDEX = Math.floor(Math.random() * HEX_CODES.length);
          const SEL_HEX = HEX[RAN_INDEX];

          return SEL_HEX.startsWith('#') ? SEL_HEX : `${SEL_HEX}`;
     },

     // === Get a specific color === \\
     static: (name) => {
          const FIND_COLOR = Object.keys(COLORS_JSON).find(key => key.toLowerCase() === name.toLowerCase());
          return FIND_COLOR ? COLORS_JSON[FIND_COLOR] : '#5865F2';
     },
};