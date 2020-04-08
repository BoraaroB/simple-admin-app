const { v4: uuidv4 } = require('uuid');
const logger = require('../lib/logger');

exports.logRequest = function (req, res, next) {
    const url = req.originalUrl || '';
    if (url.indexOf('/api') === 0 && url.indexOf('/api/notifications') === -1) {
        req.api_id = uuidv4();
        logger.info(req, `${req.method} ${url} ; body: ${JSON.stringify(req.body)}`);
    }
    next();
};

exports.logErrors = function (err, req, res, next) {
    const url = req.originalUrl || '';
    logger.error(req, `${req.method} ${url} ; body ${JSON.stringify(req.body)}. err: ${JSON.stringify(err)}`);
    next(err);
};
