export function flatten<T>(arr: T[][]): T[] {
  return arr.reduce((acc, x) => [...acc, ...x], [])
}
