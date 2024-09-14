import { AI_Config, createAI_Config } from './AI/AI_Config_interface';
import { AI_Entity, createAI_Entity } from './AI/AI_Entity_interface';
import { Secrets } from './Secrets_interface';

export type Config = {
  secrets: Secrets;
  ai_config: AI_Config;
  base_dir: string;
  base_path_to_prompts: string;
};

export function createConfig(
  config: {
    ai_config: AI_Config;
    base_dir: string;
    base_path_to_prompts: string;
  },
  secrets: Secrets
): Config {
  return {
    secrets,
    ai_config: getConfigReturnAIConfig(config.ai_config),
    base_dir: config.base_dir,
    base_path_to_prompts: config.base_path_to_prompts,
  };
}

export function getConfigReturnAIConfig(obj: AI_Config): AI_Config {
  /**
   * Generates a new AI_Config object based on the provided configuration object.
   *
   * @param obj - An object containing the configuration for the AI_Config object.
   * @returns The newly generated AI_Config object.
   */
  return createAI_Config(
    obj.architectors.map((architector: AI_Entity) =>
      createAI_Entity(
        architector.name,
        architector.description,
        architector.system_prompts,
        architector.assistant_prompts,
        architector.user_prompts,
        architector.ignore_general_system_prompts,
        architector.model,
        architector.temperature
      )
    ),
    obj.workers.map((worker: AI_Entity) =>
      createAI_Entity(
        worker.name,
        worker.description,
        worker.system_prompts,
        worker.assistant_prompts,
        worker.user_prompts,
        worker.ignore_general_system_prompts,
        worker.model,
        worker.temperature
      )
    ),
    obj.acceptance.map((acceptance: AI_Entity) =>
      createAI_Entity(
        acceptance.name,
        acceptance.description,
        acceptance.system_prompts,
        acceptance.assistant_prompts,
        acceptance.user_prompts,
        acceptance.ignore_general_system_prompts,
        acceptance.model,
        acceptance.temperature
      )
    ),
    obj.general_architector_system_prompt,
    obj.general_worker_system_prompt
  );
}
