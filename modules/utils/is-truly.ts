
/* type safe version of Boolean */
export function isTruly<T>(x: T | null | undefined): x is T {
  return Boolean(x)
}
