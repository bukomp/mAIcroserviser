import * as fs from 'fs';
import * as path from 'path';
import { config } from './config';

export const formatVersion = (version: number | string): string =>
  String(version).replace('.', '');

export const readPromptFile = (
  promptType: string,
  versionKey: string
): string => {
  const filePath = path.join(
    'src',
    'prompts',
    promptType,
    `${promptType}_system_v${formatVersion((config as any)[versionKey])}.txt`
  );
  return fs.readFileSync(filePath, 'utf-8').replace('\n', '');
};

export const getArchitectorSystemPrompt = (): string =>
  readPromptFile('architector', 'ARCHITECTOR_SYSTEM_PROMPT_VERSION');

export const getWorkerSystemPrompt = (): string =>
  readPromptFile('worker', 'WORKER_SYSTEM_PROMPT_VERSION');
