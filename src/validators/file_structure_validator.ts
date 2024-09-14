/**
 * Validates the contents of a requirements.txt file.
 *
 * @param contents - The contents of the requirements.txt file as a string.
 * @returns The validated contents of the requirements.txt file.
 */
export const requirementsTxtValidator = (contents: string): string => {
  const forbiddenPackages: string[] = ['unittest'];

  const lines: string[] = contents.trim().split('\n');
  const validLines: string[] = [];

  lines.forEach((line) => {
    // Ignore comments
    if (line.startsWith('#')) {
      return;
    }

    // Split package and version specifier
    const parts: string[] = line.split('==');

    // Validate package name
    const packageName: string = parts[0]?.trim() ?? '';
    if (!/^[a-zA-Z0-9_-]+$/.test(packageName)) return;

    // Validate version specifier, if present
    if (parts.length > 1) {
      const version: string = parts[1]?.trim() ?? '';
      if (!/^[0-9.]+$/.test(version)) return;
    }

    // Remove forbidden packages
    if (!forbiddenPackages.includes(packageName)) validLines.push(line);
  });

  return validLines.join('\n');
};
