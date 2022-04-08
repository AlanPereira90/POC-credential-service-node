import * as dotenv from 'dotenv';
import * as fs from 'fs';

function requiredEnvVar(varName: string): never {
  console.error('\x1b[31m%s\x1b[0m', `⚠️  Required environment variable "${varName}" is missing.`);

  process.exit(1);
}

if (fs.existsSync('.env')) {
  console.debug('Using .env file to supply config environment variables');
  dotenv.config({ path: '.env' });
}

export const ENV = process.env.NODE_ENV || 'development';
export const PROD = ENV === 'production';

export const CONFIG = {
  PORT: Number(process.env.PORT) || 6060,
};

export const CIPHER = {
  KEY: process.env.CIPHER_KEY || requiredEnvVar('CIPHER_KEY'),
};

export const TOKEN = {
  SECRET: process.env.TOKEN_SECRET || requiredEnvVar('JWT_SECRET'),
  EXPIRES_IN: process.env.TOKEN_EXPIRES_IN || '8 h',
};

export const AWS_CONFIG = {
  ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
  SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
  DYNAMO_ENDPOINT: process.env.AWS_DYNAMO_ENDPOINT || requiredEnvVar('AWS_DYNAMO_ENDPOINT'),
  DYNAMO_REGION: process.env.AWS_DYNAMO_REGION || requiredEnvVar('AWS_DYNAMO_REGION'),
  DYNAMO_TABLE_NAME: process.env.AWS_DYNAMO_TABLE_NAME || requiredEnvVar('AWS_DYNAMO_TABLE_NAME'),
};
