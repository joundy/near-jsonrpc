export function snakeToCamel(str: string): string {
  return str.replace(/([-_][a-z])/g, (group) => group.charAt(1).toUpperCase());
}
