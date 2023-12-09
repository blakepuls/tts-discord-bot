import dotenv from 'dotenv';

/**
 * Load environment variables from .env file, according to the NODE_ENV
 */
export default function env() {
  // Load root .env file, then .env.{NODE_ENV} file
  dotenv.config({ path: '../../config/.env' });
  dotenv.config({ path: `../../config/.env.${process.env.NODE_ENV}` });

  // Load package .env file, then .env.{NODE_ENV} file
  dotenv.config({ path: './config/.env' });
  dotenv.config({ path: `./config/.env.${process.env.NODE_ENV}` });
}
