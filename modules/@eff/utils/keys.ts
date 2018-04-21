export function keys<T>(obj: T): Array<keyof T> {
  return (Object.keys as any)(obj)
}
