import { PromptDictionary } from '../prompt_dictionary_interface';

export type AI_Entity = {
  name: string;
  description: string;
  system_prompts: string[];
  assistant_prompts: string[];
  user_prompts: string[];
  ignore_general_system_prompts: boolean;
  model: string;
  temperature: string;
}

export function createAI_Entity(
  name: string,
  description: string,
  system_prompts: string[],
  assistant_prompts: string[],
  user_prompts: string[],
  ignore_general_system_prompts: boolean,
  model: string,
  temperature: string
): AI_Entity {
  return {
    name,
    description,
    system_prompts,
    assistant_prompts,
    user_prompts,
    ignore_general_system_prompts,
    model,
    temperature
  };
}

export function getSystemPrompts(entity: AI_Entity): string[] {
  return entity.system_prompts.map(prompt => new PromptDictionary().getPrompt(prompt));
}

export function getAssistantPrompts(entity: AI_Entity): string[] {
  return entity.assistant_prompts.map(prompt => new PromptDictionary().getPrompt(prompt));
}

export function getUserPrompts(entity: AI_Entity): string[] {
  return entity.user_prompts.map(prompt => new PromptDictionary().getPrompt(prompt));
}
