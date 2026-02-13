const COLORS = require('../database/data/colors.json');
const HEX = Object.keys(COLORS);

module.exports = {
     /**
      * Get a random HEX color.
      * @param {string[]} HEX - Array of colors from `colors.json`
      */
     random: () => {
          // If JSON is empty or missing, return default color.
          if (!HEX || HEX.length === 0) return '#5865F2';

          /**
           * Go through a random index of colors, and select one.
           * @returns {string} - HEX color
           */
          const RAN_INDEX = Math.floor(Math.random() * HEX.length);
          const SEL_HEX = HEX[RAN_INDEX];

          return SEL_HEX.startsWith('#') ? SEL_HEX : `${SEL_HEX}`;
     },
};