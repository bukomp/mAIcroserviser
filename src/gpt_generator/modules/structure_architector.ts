import createChatCompletion from '../helpers/gpt_requests';
import { projectExtractor } from '../../helpers/architecture_extractor';
import { config } from '../../helpers/config';
import { ArchitectorResponse } from '../../models/gpt_responses_interface';

const gptProjectStructureArchitector = async (prompt: string): Promise<[ArchitectorResponse, string]> => {
  try {
    const architectorConfig = config.ai_config.architectors.find((architector) => architector.name === 'structure_architector');

    if (!architectorConfig) {
      throw new Error("Architector 'structure_architector' not found in config.");
    }

    const response = await createChatCompletion(
      architectorConfig.model,
      parseFloat(architectorConfig.temperature),
      [...architectorConfig.system_prompts],
      [...architectorConfig.assistant_prompts],
      [...architectorConfig.user_prompts, prompt]
    );

    const project = projectExtractor(response);

    return [project, response];
  } catch (e) {
    console.error(`An error occurred: ${e} in ${__filename}`);
    return [
      {
        files: [],
        name: '',
        structure: '',
      },
      '',
    ];
  }
};

export default gptProjectStructureArchitector;
