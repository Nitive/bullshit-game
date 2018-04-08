import { Stream } from 'xstream'

export function toPromise<T>(stream: Stream<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    stream
      .last()
      .addListener({
        next(value: T) {
          resolve(value)
        },
        error: reject,
      })
  })
}

export function getStreamValues<T>(stream: Stream<T>): Promise<T[]> {
  return toPromise(
    stream
      .fold((acc: T[], x: T) => [...acc, x], [] as T[])
      .last(),
  )
}

export function areStreamsEqual<T>(a: Stream<T>, b: Stream<T>, equal = (a: T, b: T) => a === b): Promise<void> {
  return Promise.all([getStreamValues(a), getStreamValues(b)])
    .then(([aValues, bValues]) => {
      if (aValues.length !== bValues.length) {
        throw new Error(`${a} and ${b} has different length`)
      }

      for (let i = 0; i < aValues.length; i += 1) {
        if (!equal(aValues[i], bValues[i])) {
          throw new Error(`${i} element is different: ${aValues[i]} is not equal ${bValues[i]}`)
        }
      }
    })
}
