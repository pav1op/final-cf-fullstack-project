const { format, createLogger, transports } = require('winston');
require('winston-daily-rotate-file');
require('winston-mongodb');
require('dotenv').config();

const { combine, timestamp, label, printf } = format;

const logFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});

const fileRotateTransport = new transports.DailyRotateFile({
  level: "info",
  filename: "logs/info-%DATE%.log",
  datePattern: "DD-MM-YYYY",
  maxFiles: "10d"
});

const logger = createLogger({
  level: "debug",
  format: combine(
    label({ label: "Logs for Final Project App" }),
    timestamp({ format: "DD-MM-YYYY HH:mm:ss" }),
    logFormat
  ),
  transports: [
    new transports.Console({ level: 'debug' }),
    new transports.File({
      level: "error",
      filename: "logs/error.log"
    }),
    new transports.File({
      level: "info",
      filename: "logs/info.log"
    }),
    fileRotateTransport,
    new transports.MongoDB({
      level: "debug",
      db: process.env.MONGODB_URI,
      options: {
        useUnifiedTopology: true
      },
      collection: "server_logs",
      format: combine(
        timestamp(),
        format.json()
      )
    })
  ]
});

module.exports = logger;
