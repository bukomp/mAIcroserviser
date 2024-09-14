import gptWorker from '../modules/worker';
import { structure2Dict } from '../../helpers/architecture_extractor';
import { extractCode } from '../../helpers/code_extractor';
import { createFile, createFileCollection, File, FileCollection } from '../../models/file_interface';
import { ArchitectorResponse } from '../../models/gpt_responses_interface';

const createArchitectureFileString = (project: ArchitectorResponse, rawArchitectorResponse: string) => `
## User Prompt ##

## File Structure ##
${project.structure}

## Architecture Description ##
${rawArchitectorResponse}
`;
const addInitialResponse = (fileCollection: FileCollection, architectureFileString: string) =>
  fileCollection.collections['raw_responses']?.push(createFile('architector.txt', architectureFileString, ''));

const processFiles = async (project: ArchitectorResponse, structureDictionary: Record<string, string>) => {
  const tasks = project.files.map(({ fileName, description }) => gptWorker(project, fileName, description));
  const responses = await Promise.all(tasks);
  return project.files.map((file, index) => ({
    rawResponse: createFile(`raw_${file.fileName}.txt`, responses[index] ?? '', ''),
    formattedResponse: createFile(file.fileName, extractCode(responses[index] ?? ''), structureDictionary[file.fileName] ?? ''),
  }));
};

const addResultsToCollection = (fileCollection: FileCollection, results: { rawResponse: File; formattedResponse: File }[]) => {
  results.forEach(({ rawResponse, formattedResponse }) => {
    fileCollection.collections['raw_responses']?.push(rawResponse);
    fileCollection.collections['formatted_responses']?.push(formattedResponse);
  });
};

export const aCreateFileCollection = async (project: ArchitectorResponse, rawArchitectorResponse: string): Promise<FileCollection> => {
  try {
    const fileCollection: FileCollection = createFileCollection(project.name);
    const architectureFileString = createArchitectureFileString(project, rawArchitectorResponse);
    addInitialResponse(fileCollection, architectureFileString);

    const structureDictionary = structure2Dict(project.structure);
    const results = await processFiles(project, structureDictionary);
    addResultsToCollection(fileCollection, results);

    return fileCollection;
  } catch (e) {
    console.error(`An error occurred: ${e}`);
    return createFileCollection('');
  }
};
