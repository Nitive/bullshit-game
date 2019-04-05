import xs, { Stream } from 'xstream'
import { keys } from '../utils/keys'
import { mapObject } from '../utils/map-object'
import { Effects } from '@eff/dom/h'
import { Element } from '@eff/dom/types'

export interface Effect {
  effectType: string,
  sink$: Stream<any>
}

// export type EffectsDescriptor = any
// type Container<T> = Stream<T> | Array<T>
// export type Eff = VNode | string | Effect
// export type EffectsDescriptor
//   = Eff
//   | Container<Eff>
//   | Container<Container<Eff> | Eff>

export interface Driver<Sink, Source> {
  run(sink: Sink): Source,
  select(effects: Effects, sources: any): Sink,
}

export function run<Sources, Sinks extends { [K in keyof Sources]: Stream<any> }>(
  main: Element<Sources, Sinks>,
  drivers: { [K in keyof Sources]: Driver<Sinks[K], Sources[K]> },
) {
  type Drivers = typeof drivers

  const fakeSinks: Sinks = mapObject<Drivers, Sinks>(drivers, () => xs.never())
  const sources: Sources = mapObject<Drivers, Sources>(drivers, (driver, key) => {
    return driver.run(fakeSinks[key])
  })
  const effects = main(sources)
  const sinks: Sinks = mapObject<Drivers, Sinks>(drivers, driver => {
    return driver.select(effects, sources)
  })

  keys(sinks).forEach(key => {
    fakeSinks[key].imitate(sinks[key])
  })
}

export function isEffect(eff: Effects): eff is Effect {
  return !!(eff as Effect).effectType
}
