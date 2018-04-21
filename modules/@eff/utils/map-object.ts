export function mapObject<T, U extends { [K in keyof T]: any }>(
  obj: { [K in keyof T]: T[K]},
  f: <K extends keyof T>(v: T[K], key: K) => U[K],
): U {
  const newObj: any = {}
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      newObj[key] = f(obj[key], key)
    }
  }

  return newObj
}
