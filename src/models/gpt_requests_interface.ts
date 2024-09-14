export type PromptRole = 'system' | 'user' | 'assistant';

export type Prompt = {
  role: PromptRole;
  content: string;
};

export type PromptImpl = {
  role: PromptRole;
  content: string;
};