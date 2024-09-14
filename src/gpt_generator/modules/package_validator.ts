import createChatCompletion from '../helpers/gpt_requests';
import { ArchitectorResponse } from '../../models/gpt_responses_interface';
import { config } from '../../helpers/config';

const packageValidator = async (project: ArchitectorResponse, fileName: string, fileDetails: string): Promise<string> => {
  try {
    const prompt = `
    File Name: ${fileName}
    File Details: ${fileDetails}
    `;

    let content: string | null = null;

    for (const worker of config.ai_config.workers) {
      const systemPrompts = [
        ...(worker.ignore_general_system_prompts ? [] : [config.ai_config.general_worker_system_prompt]),
        ...worker.system_prompts,
      ];

      content = await createChatCompletion(
        worker.model,
        parseFloat(worker.temperature),
        systemPrompts,
        worker.assistant_prompts,
        worker.user_prompts,
        [
          { role: 'user', content: project.structure },
          { role: 'user', content: prompt },
        ]
      );
    }

    return content ?? '';
  } catch (e) {
    console.error(`An error occurred: ${e}${__filename}`);
    return String(e);
  }
};

export default packageValidator;
