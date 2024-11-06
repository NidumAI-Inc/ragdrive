import winston from 'winston';
import { createPath } from './path-helper';

const logger = winston.createLogger({
  // level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: createPath(['error.log']), level: 'error' }),
    new winston.transports.File({ filename: createPath(['combined.log']) }),
  ],
})

export default logger