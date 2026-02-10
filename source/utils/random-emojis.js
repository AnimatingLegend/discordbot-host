const EMOJI_DATA = require('../database/data/emojis.json');

function getRandomEmoji() {
     const emojis = Object.values(EMOJI_DATA);

     if (emojis.length === 0) return '👎';

     const random_index = Math.floor(Math.random() * emojis.length);
     return emojis[random_index];
}

module.exports = { getRandomEmoji };