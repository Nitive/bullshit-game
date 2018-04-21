export function flatten<T>(arr: T[][]): T[] {
  return arr.reduce((acc, x) => [...acc, ...x], [])
}

export function flattenDeep<T>(arr: any): T[] {
  if (Array.isArray(arr)) {
    return flatten(arr.map(flattenDeep) as any)
  }

  return arr
}
