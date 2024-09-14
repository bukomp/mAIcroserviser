import * as fs from 'fs';
import * as path from 'path';
import dotenv from 'dotenv';
dotenv.config();

import { Secrets } from '../models/config/Secrets_interface';
import { Config } from '../models/config/config_interface';

const loadEnv = () => {
  const env = process.env;
  if (!env || !env['GPT_KEY'] || !env['GPT_ORG'] || !env['PATH_TO_CONFIG']) {
    throw new Error('GPT_KEY, GPT_ORG, or PATH_TO_CONFIG not found in .env');
  }

  return env;
};

const loadConfig = (secrets: Secrets): Config => {
  const configPath = path.join(secrets.PATH_TO_CONFIG, 'config.json');
  const configData = fs.readFileSync(configPath, 'utf-8');
  const configObject: Config = { ...JSON.parse(configData), secrets };
  console.log(configObject);
  return configObject;
};

const env = loadEnv();

const secrets: Secrets = {
  GPT_ORG: env['GPT_ORG'] as string,
  GPT_KEY: env['GPT_KEY'] as string,
  PATH_TO_CONFIG: env['PATH_TO_CONFIG'] as string,
};

export const config = loadConfig(secrets);