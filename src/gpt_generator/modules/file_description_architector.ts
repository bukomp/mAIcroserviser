import createChatCompletion from '../helpers/gpt_requests';
import { extractFileDescription, structureToListOfFiles } from '../../helpers/architecture_extractor';
import { config } from '../../helpers/config';
import { ArchitectorResponse } from '../../models/gpt_responses_interface';

const gptFileDescriptionArchitector = async (project: ArchitectorResponse, prompt: string): Promise<[ArchitectorResponse, string]> => {
  try {
    const { structure } = project;
    const architectorConfig = config.ai_config.architectors.find((architector) => architector.name === 'file_architector');

    if (!architectorConfig) {
      throw new Error("Architector 'file_architector' not found in config.");
    }

    const response = await createChatCompletion(
      architectorConfig.model,
      Number(architectorConfig.temperature),
      architectorConfig.system_prompts,
      architectorConfig.assistant_prompts,
      [...architectorConfig.user_prompts, prompt, structure, JSON.stringify(structureToListOfFiles(structure))]
    );

    project.files = extractFileDescription(response);

    return [project, response];
  } catch (e) {
    console.error(`An error occurred: ${e} in ${__filename}`);
    return [] as unknown as [ArchitectorResponse, string];
  }
};

export default gptFileDescriptionArchitector;
