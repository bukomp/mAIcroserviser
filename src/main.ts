import fs from 'fs';
import * as path from 'path';

import { readUserInput } from './helpers/readUserInput';
import { config } from './helpers/config';
import { gptMain } from './gptGenerator/gptMain';
import { writeFilesFromCollection } from './helpers/fileWriter';
import { FileCollection } from './models/fileInterface';

const main = async (): Promise<void> => {
  try {
    if (!fs.existsSync(config.baseDir)) {
      fs.mkdirSync(config.baseDir, { recursive: true });
    }

    const prompt = await readUserInput();

    const listOfFilesToWrite: FileCollection = await gptMain(prompt);

    await writeFilesFromCollection(listOfFilesToWrite);

  } catch (e) {
    console.error(`An error occurred: ${e} in ${__filename}`);
  }
};

main();

