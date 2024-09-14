import { ArchitectorResponse, FileExplanation } from '../models/gpt_responses_interface';

const projectExtractor = (content: string): ArchitectorResponse => {
  const projectNameMatch = content.match(/---structure---\n(.*?)\//);
  const projectName = projectNameMatch ? projectNameMatch[1] ?? 'project' : 'project';
  const structure = extractStructure(content);
  const files = extractFileDescription(content);
  return {
    name: projectName,
    structure,
    files,
  };
};

const extractFileDescription = (content: string): FileExplanation[] => {
  const pattern = /---(.*?)---\n([\s\S]*?)(?=---|$)/g;
  const matches = Array.from(content.matchAll(pattern));
  return matches
    .filter((match) => match[1]?.trim() !== 'structure')
    .map((match) => ({
      fileName: match[1]?.trim() ?? '',
      description: match[2]?.trim() ?? '',
    }));
};

const extractStructure = (content: string): string => {
  const pattern = /---structure---(.*?)---/s;
  const match = content.match(pattern);
  return match?.[1]?.trim() ?? '';
};

const structure2Dict = (fileStructure: string): Record<string, string> => {
  try {
    const lines = fileStructure.trim().split('\n');
    const stack: string[] = [];
    const filePathDict: Record<string, string> = {};

    lines.forEach((line) => {
      if (line.includes('...')) return;

      const depth = Math.floor(line.indexOf('─') / 4);

      if (depth < 0) return;

      const name = line.split('─').pop()?.trim()?.split(' ')[0] ?? '';

      stack.length = depth;
      const fullPath = stack.join('/');

      !name.endsWith('/') && (filePathDict[name] = fullPath);

      stack.push(name.replace('/', '').trim());
    });

    return filePathDict;
  } catch (error) {
    console.error('Error in structure2Dict:', error);
    return {};
  }
};

const structureToListOfFiles = (structure: string): string[] => Object.keys(structure2Dict(structure));

export { projectExtractor, extractFileDescription, extractStructure, structure2Dict, structureToListOfFiles };
