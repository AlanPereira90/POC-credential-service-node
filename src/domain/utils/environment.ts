import * as dotenv from 'dotenv';
import * as fs from 'fs';

/*function requiredEnvVar(varName: string): never {
  console.error('\x1b[31m%s\x1b[0m', `⚠️  Required environment variable "${varName}" is missing.`);

  process.exit(1);
}*/

if (fs.existsSync('.env')) {
  console.debug('Using .env file to supply config environment variables');
  dotenv.config({ path: '.env' });
}

export const CONFIG = {
  PORT: Number(process.env.PORT) || 6060,
};
