export type FileExplanation = {
  fileName: string;
  description: string;
};

export type ArchitectorResponse = {
  name: string;
  structure: string;
  files: FileExplanation[];
};

export const createFileExplanation = (fileName: string, description: string): FileExplanation => ({
  fileName,
  description,
});

export const createArchitectorResponse = (name: string, structure: string, files: FileExplanation[]): ArchitectorResponse => ({
  name,
  structure,
  files,
});
