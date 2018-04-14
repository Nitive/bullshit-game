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

export function areStreamsEqual<T>(a: Stream<T>, b: Stream<T>): Promise<void> {
  return Promise.all([getStreamValues(a), getStreamValues(b)])
    .then(([aValues, bValues]) => {
      expect(aValues).toEqual(bValues)
    })
}

export function makeMultistepDone(num: number, done: jest.DoneCallback): jest.DoneCallback {
  let left = num
  const step: any = (err?: any) => {
    if (err)  {
      done(err)
      return
    }
    left -= 1
    if (left === 0) {
      done()
    }
  }

  step.fail = done.fail

  return step
}
