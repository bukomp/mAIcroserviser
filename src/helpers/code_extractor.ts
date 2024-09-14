const extractCode = (rawString: string): string => {
  const codeBlockRegex = /^```[\s\S]*?^```/gm;
  const matches = rawString.match(codeBlockRegex);

  if (!matches) return '';

  return matches
    .map((block) => block.replace(/^```.*\n?|```$/g, ''))
    .join('\n\n');
};

export { extractCode };
