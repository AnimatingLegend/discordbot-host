const { logger } = require('../../../libs.js');

function WeatherLog(name, country, latitude, longitude, timezone) {
     console.log(`----------------------------------------------------------`);
     logger.info(`WEATHER DATA: ${name}, ${country}`)
     logger.info(`LATITUDE: ${latitude}`);
     logger.info(`LONGITUDE: ${longitude}`);
     logger.info(`TIMEZONE: ${timezone}`);
     console.log(`----------------------------------------------------------`);
}

module.exports = { WeatherLog };