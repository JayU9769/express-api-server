import { config } from 'dotenv';
config({});

export const CREDENTIALS = process.env.CREDENTIALS === 'true';

export const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379'

export const {
  NODE_ENV,
  PORT,
  SECRET_KEY,
  LOG_FORMAT,
  LOG_DIR,
  ORIGIN
} = process.env;