import * as readline from 'readline';
import * as process from 'process';

const readUserInput = (): Promise<string> => {
  const args = process.argv.slice(2);
  const promptIndex = args.indexOf('-p') !== -1 ? args.indexOf('-p') : args.indexOf('--prompt');

  return promptIndex !== -1 && args[promptIndex + 1]
    ? Promise.resolve(args[promptIndex + 1] || '')
    : new Promise<string>((resolve) => {
        const rl = readline.createInterface({
          input: process.stdin,
          output: process.stdout,
        });
        rl.question("Please enter your input: ", (answer) => {
          rl.close();
          resolve(answer);
        });
      });
};

export default readUserInput;
