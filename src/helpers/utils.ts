import * as fs from 'fs';
import * as path from 'path';
import { config } from './config';
import { PromptImpl, PromptRole } from '../models/gpt_requests_interface';

export const formatVersion = (version: number | string): string => String(version).replace(/\./g, '_');

export const getArchitectorSystemPrompt = (): string => {
  const filePath = path.join(
    'src',
    'prompts',
    'architector',
    `architector_system_v${formatVersion(config.ai_config.general_architector_system_prompt)}.txt`
  );
  return fs.readFileSync(filePath, 'utf-8').replace(/\n/g, '');
};

export const getWorkerSystemPrompt = (): string => {
  const filePath = path.join(
    'src',
    'prompts',
    'worker',
    `worker_system_v${formatVersion(config.ai_config.general_worker_system_prompt)}.txt`
  );
  return fs.readFileSync(filePath, 'utf-8').replace(/\n/g, '');
};

export const createPrompt = (role: PromptRole, content: string): PromptImpl => ({
  role,
  content: (() => {
    const filePathArray = content.split('.');
    const filePath = path.join(
      'src',
      'prompts',
      ...filePathArray.slice(0, -2),
      `${filePathArray[filePathArray.length - 2]}_v${filePathArray[filePathArray.length - 1]}.txt`
    );

    return fs.readFileSync(filePath, 'utf-8').replace(/\n/g, '');
  })(),
});
