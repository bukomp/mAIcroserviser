import * as fs from 'fs';
import * as path from 'path';
import { config } from './config';

export const microserviceCount = (): number =>
  fs.readdirSync(config.base_dir)
    .filter(name => fs.statSync(path.join(config.base_dir, name)).isDirectory())
    .length;
