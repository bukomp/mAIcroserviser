import fs from 'fs';

type PromptDictionaryType = {
  [key: string]: string | PromptDictionaryType;
};

export class PromptDictionary {
  private promptDictionary: PromptDictionaryType;

  constructor() {
    const data = fs.readFileSync('prompt_dictionary.json', 'utf-8');
    this.promptDictionary = JSON.parse(data) as PromptDictionaryType;
  }

  public getPrompt(pathOrVersion: string): string {
    if (fs.existsSync(pathOrVersion)) {
      return fs.readFileSync(pathOrVersion, 'utf-8');
    } else {
      const promptPath = this.getValueFromPath(this.promptDictionary, pathOrVersion);
      if (typeof promptPath === 'string' && fs.existsSync(promptPath)) {
        return fs.readFileSync(promptPath, 'utf-8');
      } else {
        return 'File not found';
      }
    }
  }

  private getValueFromPath(obj: PromptDictionaryType, pathStr: string): string | PromptDictionaryType {
    let temp: string | PromptDictionaryType = obj;
    for (const key of pathStr.split('.')) {
      if (typeof temp === 'object' && key in temp) {
        temp = temp[key] as string | PromptDictionaryType;
      } else {
        return 'Key not found';
      }
    }
    return temp;
  }
}
