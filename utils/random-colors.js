const COLOR_DATA = require('./data/colors.json');

function getRandomHexColor() {
     const hexs = Object.values(COLOR_DATA);

     if (hexs.length === 0) return '#000000';

     const random_index = Math.floor(Math.random() * hexs.length);
     return hexs[random_index];
}

module.exports = { getRandomHexColor };