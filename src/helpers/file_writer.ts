import fs from 'fs';
import path from 'path';
import { config } from './config';
import { filteroutModules } from './filters/requrements_filter';
import { microserviceCount } from './microservice_counter';
import { FileCollection, File } from '../models/file_interface';

const _writeFile = (filePath: string, content: string): void => {
  try {
    fs.writeFileSync(filePath, content, { encoding: 'utf-8', flag: 'wx' });
  } catch (error) {
    console.error(`Error writing file: ${filePath}`, error);
  }
};

const _writeMicroserviceFiles = (microserviceRootDir: string, fileContents: File[]): void => {
  fileContents.forEach((file) => {
    const content = file.name === 'requirements.txt' ? filteroutModules(file.content) : file.content;
    const filePath = path.join(process.cwd(), microserviceRootDir, file.path, file.name.trim());

    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    _writeFile(filePath, content);
  });
};

export const writeFilesFromCollection = (listOfFiles: FileCollection): void => {
  try {
    const microserviceRootDir = path.join(config.base_dir, `-${microserviceCount()}--${listOfFiles.projectRoot}`);
    const microserviceRawFilesRootDir = path.join(microserviceRootDir, 'raw_responses');

    _writeMicroserviceFiles(microserviceRootDir, listOfFiles.collections['formatted_responses'] ?? []);
    _writeMicroserviceFiles(microserviceRawFilesRootDir, listOfFiles.collections['raw_responses'] ?? []);
  } catch (error) {
    console.error('An error occurred while writing files:', error);
  }
};
