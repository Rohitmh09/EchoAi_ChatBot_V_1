import winston from 'winston';
import path from 'path';
import fs from 'fs';
import DailyRotateFile from 'winston-daily-rotate-file'; 

// Define the log file directory
const logDirectory = path.join(path.resolve(), 'logs');

// Ensure the logs directory exists
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory);
}

// Configure daily rotation and automatic deletion
const transport = new DailyRotateFile({
  dirname: logDirectory,
  filename: 'application-%DATE%.log',
  datePattern: 'YYYY-MM-DD', // Rotate logs daily
  maxFiles: '14d', // Retain logs for 14 days, then delete
  zippedArchive: true, // Compress older logs to save space
});

// Create a logger instance with rotating file transport
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json() // Log in JSON format with timestamp
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.simple(), // Print to console in a readable format
    }),
    transport, // Rotate logs automatically and delete old logs
  ],
});

export default logger;
