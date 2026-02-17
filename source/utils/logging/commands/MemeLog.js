const { logger } = require('../../../libs.js');

function MemeLog(post) {
     console.log(`----------------------------------------------------------`);
     logger.info(`RANDOM MEME DATA:`);
     logger.info(`TITLE: ${post.title.toUpperCase()}`);
     logger.info(`PHOTO: ${post.url}`);
     logger.info(`UPVOTES: ${post.ups}`);
     logger.info(`SUBREDDIT: R/${post.subreddit.toUpperCase()}`);
     console.log(`----------------------------------------------------------`);
}

module.exports = { MemeLog };