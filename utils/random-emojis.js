// -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- \\
// -- idk when imma use this, but i making this bc why no lmao -- \\
// -- this code is more-or-less the same as random-colors.js, but except its for emojis -- \\
// -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- \\
const EMOJI_DATA = require('./data/emojis.json');

function getRandomEmoji() {
     const emojis = Object.values(EMOJI_DATA);

     if (emojis.length === 0) return '👎';

     const random_index = Math.floor(Math.random() * emojis.length);
     return emojis[random_index];
}

module.exports = { getRandomEmoji };