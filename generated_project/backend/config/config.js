// Configuration module for Node.js backend.
// Loads environment variables using `dotenv` and exports a frozen config object.
// Required environment variables are validated at load time.

const dotenv = require('dotenv');
// Load .env file located at project root (or any parent directory).
dotenv.config();

// List of required environment variable keys.
const requiredKeys = [
  'PORT',
  'DB_URL',
  'JWT_SECRET',
  'OPENAI_API_KEY',
  'AMADEUS_KEY',
  'SKYSCANNER_KEY',
  'BOOKING_COM_KEY',
  'OPENWEATHER_KEY',
  'GOOGLE_MAPS_KEY',
  'GOOGLE_OAUTH_CLIENT_ID',
  'GOOGLE_OAUTH_CLIENT_SECRET',
  'FACEBOOK_OAUTH_CLIENT_ID',
  'FACEBOOK_OAUTH_CLIENT_SECRET',
  'EMAIL_HOST',
  'EMAIL_PORT',
  'EMAIL_USER',
  'EMAIL_PASS',
];

// Validate that each required variable is present.
requiredKeys.forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
});

// Build the config object, converting numeric values where appropriate.
const config = {
  PORT: parseInt(process.env.PORT, 10),
  DB_URL: process.env.DB_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  AMADEUS_KEY: process.env.AMADEUS_KEY,
  SKYSCANNER_KEY: process.env.SKYSCANNER_KEY,
  BOOKING_COM_KEY: process.env.BOOKING_COM_KEY,
  OPENWEATHER_KEY: process.env.OPENWEATHER_KEY,
  GOOGLE_MAPS_KEY: process.env.GOOGLE_MAPS_KEY,
  GOOGLE_OAUTH_CLIENT_ID: process.env.GOOGLE_OAUTH_CLIENT_ID,
  GOOGLE_OAUTH_CLIENT_SECRET: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
  FACEBOOK_OAUTH_CLIENT_ID: process.env.FACEBOOK_OAUTH_CLIENT_ID,
  FACEBOOK_OAUTH_CLIENT_SECRET: process.env.FACEBOOK_OAUTH_CLIENT_SECRET,
  EMAIL_HOST: process.env.EMAIL_HOST,
  EMAIL_PORT: parseInt(process.env.EMAIL_PORT, 10),
  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASS: process.env.EMAIL_PASS,
};

module.exports = Object.freeze(config);
