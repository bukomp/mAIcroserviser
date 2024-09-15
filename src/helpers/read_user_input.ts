import * as readline from 'readline';
import * as process from 'process';
import * as fs from 'fs';

const readUserInput = async (): Promise<string> => {
  const args = process.argv.slice(2);
  const promptIndex = args.indexOf('-p') !== -1 ? args.indexOf('-p') : args.indexOf('--prompt');
  const promptProvided = promptIndex !== -1 && args[promptIndex + 1];

  if (promptProvided) return Promise.resolve(args[promptIndex + 1] || '');

  const promptFromFile = !promptProvided ? fs.readFileSync('./microservice_description.txt', 'utf8') : null;

  if (promptFromFile) return promptFromFile;

  return new Promise<string>((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl.question('Please enter your input: ', (answer) => {
      rl.close();
      resolve(answer);
    });
  });
};

export default readUserInput;
