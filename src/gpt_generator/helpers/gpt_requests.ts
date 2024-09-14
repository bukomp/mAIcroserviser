import OpenAI from 'openai';
import { config } from '../../helpers/config';
import { Prompt } from '../../models/gpt_requests_interface';
import { createPrompt } from '../../helpers/utils';

let attempts = 0;

const createChatCompletion = async (
  LLMModel: string,
  temperature: number,
  systemPrompts: string[] = [],
  assistantPrompts: string[] = [],
  userPrompts: string[] = [],
  promptsInOrder: Prompt[] = []
): Promise<string> => {
  const openai = new OpenAI({
    organization: config.secrets.GPT_ORG,
    apiKey: config.secrets.GPT_KEY,
  });

  try {
    const chatCompletion = await openai.chat.completions.create({
      model: LLMModel,
      messages: [
        ...systemPrompts.map((content) => createPrompt('system', content)),
        ...assistantPrompts.map((content) => createPrompt('assistant', content)),
        ...userPrompts.map((content) => createPrompt('user', content)),
        ...promptsInOrder,
      ],
      temperature,
    });

    const content = chatCompletion.choices[0]?.message?.content;
    attempts = 0;
    console.log(content);
    return content ?? '';
  } catch (e) {
    console.error(`An error occurred: ${e} \n${__filename}`);
    return attempts < 3
      ? (attempts++,
        console.log(`Trying again! attempt: ${attempts}/3`),
        createChatCompletion(LLMModel, temperature, systemPrompts, assistantPrompts, userPrompts, promptsInOrder))
      : ((attempts = 0), String(e));
  }
};

export default createChatCompletion;
