const logger = require('../logger/logger');

function errorHandler(err, req, res, next) {
  logger.error(err.message, { metadata: err.stack });
  
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';

  res.status(status).json({ 
    error: { 
      message: message, 
      details: err.details || null 
    } 
  });
}

module.exports = errorHandler;