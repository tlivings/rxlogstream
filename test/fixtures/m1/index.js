
const Logger = require('../../../lib');

const logger = Logger.createLogger('m1Logger');

const test = function () {
  logger.log('test');
};

module.exports = { test, logger };
