const fs = require("fs");
const path = require("path");

const requestlogPath = path.join(__dirname, "../request.log");

function requestLogger(req, res, next){
	const log = {
		time: new Date().toISOString(),
		method: req.method,
		utl: req.originalUrl,
		headers: req.headers,
		body: req.body
	};
	fs.appendFile(requestlogPath, JSON.stringify(log) + '\n', (err) => {
		if (err) console.error('Erro ao registrar request:', err);
	});
	next();
}

const errorLogPath = path.join(__dirname, '../error.log');

function errorLogger(err, req, res, next) {
  const log = {
    time: new Date().toISOString(),
    method: req.method,
    url: req.originalUrl,
    headers: req.headers,
    body: req.body,
    error: {
      message: err.message,
      stack: err.stack,
      status: err.status || 500,
    },
  };
  fs.appendFile(errorLogPath, JSON.stringify(log) + '\n', (err) => {
    if (err) console.error('Erro ao registrar error:', err);
  });
  next(err);
}

module.exports = { requestLogger, errorLogger }