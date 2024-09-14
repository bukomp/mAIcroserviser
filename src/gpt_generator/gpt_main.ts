import { aCreateFileCollection } from './helpers/file_collection';
import gpt_file_description_architector from './modules/file_description_architector';
import gpt_project_structure_architector from './modules/structure_architector';
import { createFileCollection, FileCollection } from '../models/file_interface';

const a_gpt_main = async (prompt: string): Promise<FileCollection> => {
  try {
    const [project, _response] = await gpt_project_structure_architector(prompt);

    if (!project || typeof project !== 'object') {
      throw new Error('Project is not of type ArchitectorResponse');
    }

    const [updatedProject, updatedResponse] = await gpt_file_description_architector(project, prompt);

    if (!updatedProject || typeof updatedProject !== 'object' || typeof updatedResponse !== 'string') {
      throw new Error('Invalid project or response type');
    }

    return await aCreateFileCollection(updatedProject, updatedResponse);
  } catch (e) {
    console.error(`An error occurred: ${e}`);
    return createFileCollection('');
  }
};

export const gpt_main = (prompt: string): Promise<FileCollection> => a_gpt_main(prompt);
