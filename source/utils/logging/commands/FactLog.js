const { logger } = require('../../../libs.js');

function CatFactLog(c_image, c_fact, fact_data) {
     console.log(`----------------------------------------------------------`);
     logger.info(`CAT FACT DATA: - ${fact_data?.source || 'N/A'}`);
     logger.info(`RANDOM CAT FACT: ${c_fact || 'N/A'}`);
     logger.info(`RANDOM CAT PHOTO: ${c_image || 'N/A'}`);
     console.log(`----------------------------------------------------------`);
}

function DogFactLog(d_image, d_fact, fact_data) {
     console.log(`----------------------------------------------------------`);
     logger.info(`DOG FACT DATA: - ${fact_data?.source || 'N/A'}`);
     logger.info(`RANDOM DOG FACT: ${d_fact || 'N/A'}`);
     logger.info(`RANDOM DOG PHOTO: ${d_image || 'N/A'}`);
     console.log(`----------------------------------------------------------`);
}

function FactLog(fact) {
     console.log(`----------------------------------------------------------`);
     logger.info(`FACT DATA: - ${fact?.source || 'N/A'}`);
     logger.info(`RANDOM FACT: ${fact?.text || 'N/A'}`);
     console.log(`----------------------------------------------------------`);
}

module.exports = { CatFactLog, DogFactLog, FactLog };