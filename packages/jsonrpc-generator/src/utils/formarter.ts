export function snakeToCamel(str: string) {
  return str.replace(/[_.-](\w|$)/g, function (_, x) {
      return x.toUpperCase();
  });
}