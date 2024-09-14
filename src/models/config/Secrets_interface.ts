export type Secrets = {
  GPT_ORG: string;
  GPT_KEY: string;
  PATH_TO_CONFIG: string;
}

export const createSecrets = (GPT_ORG: string, GPT_KEY: string, PATH_TO_CONFIG: string): Secrets => {
  const validateInput = (input: string, name: string) => {
    if (!input) throw new Error(`${name} must be defined`);
  };

  validateInput(GPT_ORG, 'GPT_ORG');
  validateInput(GPT_KEY, 'GPT_KEY');
  validateInput(PATH_TO_CONFIG, 'PATH_TO_CONFIG');

  return {
    GPT_ORG,
    GPT_KEY,
    PATH_TO_CONFIG
  };
};
