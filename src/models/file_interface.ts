import { requirementsTxtValidator } from '../validators/file_structure_validator';

export type IFile = {
  name: string;
  content: string;
  path: string;
};

export type File = {
  name: string;
  content: string;
  path: string;
  validateContent: (name: string, content: string) => string;
};

export const createFile = (name: string, content: string, path: string = ''): File => {
  const validateContent = (name: string, content: string): string => {
    const validators: { [key: string]: (content: string) => string } = {
      'requirements.txt': requirementsTxtValidator,
    };
    return name in validators ? validators[name]?.(content) ?? content : content;
  };

  return {
    name,
    content: validateContent(name, content),
    path,
    validateContent,
  };
};

export type IFileCollection = {
  projectRoot: string;
  collections: { [key: string]: File[] };
  addFile: (collectionName: string, file: File) => void;
};

export type FileCollection = {
  projectRoot: string;
  collections: { [key: string]: File[] };
  addFile: (collectionName: string, file: File) => void;
};

export const createFileCollection = (projectRoot: string): FileCollection => {
  const collections: { [key: string]: File[] } = {
    raw_responses: [],
    formatted_responses: [],
  };

  const addFile = (collectionName: string, file: File): void => {
    if (collections[collectionName]) {
      collections[collectionName].push(file);
    } else {
      collections[collectionName] = [file];
    }
  };

  return {
    projectRoot,
    collections,
    addFile,
  };
};
