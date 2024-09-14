import fs from 'fs';

import readUserInput from './helpers/read_user_input';
import { config } from './helpers/config';
import { writeFilesFromCollection } from './helpers/file_writer';
import { FileCollection } from './models/file_interface';
import { gpt_main } from './gpt_generator/gpt_main';

const main = async (): Promise<void> => {
  try {
    if (!fs.existsSync(config.base_dir)) {
      fs.mkdirSync(config.base_dir, { recursive: true });
    }

    const prompt = await readUserInput();

    const listOfFilesToWrite: FileCollection = await gpt_main(prompt);

    writeFilesFromCollection(listOfFilesToWrite);
  } catch (e) {
    console.error(`An error occurred: ${e} in ${__filename}`);
  }
};

main();
