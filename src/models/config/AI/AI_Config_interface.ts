import { AI_Entity } from './AI_Entity_interface';
import { PromptDictionary } from '../prompt_dictionary_interface';

export type AI_Config = {
  architectors: AI_Entity[];
  workers: AI_Entity[];
  acceptance: AI_Entity[];
  general_architector_system_prompt: string;
  general_worker_system_prompt: string;
}

export function createAI_Config(
  architectors: AI_Entity[],
  workers: AI_Entity[],
  acceptance: AI_Entity[],
  general_architector_system_prompt: string,
  general_worker_system_prompt: string
): AI_Config {
  return {
    architectors,
    workers,
    acceptance,
    general_architector_system_prompt,
    general_worker_system_prompt
  };
}

export function getGeneralArchitectorSystemPrompt(config: AI_Config): string {
  return new PromptDictionary().getPrompt(config.general_architector_system_prompt);
}

export function getGeneralWorkerSystemPrompt(config: AI_Config): string {
  return new PromptDictionary().getPrompt(config.general_worker_system_prompt);
}
