import { VNode } from 'snabbdom/vnode'
import xs, { Stream } from 'xstream'
import { keys } from '../utils/keys'
import { mapObject } from '../utils/map-object'

export interface Effect {
  effectType: string,
  sink$: Stream<any>
}

type Container<T> = Stream<T> | Array<T>
export type Eff = VNode | string | Effect
export type EffectsDescriptor
  = Eff
  | Container<Eff>
  | Container<Container<Eff> | Eff>

export interface Driver<Sink, Source> {
  run(sink: Sink): Source,
  select(effects: EffectsDescriptor): Sink,
}

export function run<Sources, Sinks extends { [K in keyof Sources]: Stream<any> }>(
  main: (sources: Sources) => EffectsDescriptor,
  drivers: { [K in keyof Sources]: Driver<Sinks[K], Sources[K]> },
) {
  type Drivers = typeof drivers

  const fakeSinks: Sinks = mapObject<Drivers, Sinks>(drivers, () => xs.never())
  const sources: Sources = mapObject<Drivers, Sources>(drivers, (driver, key) => {
    return driver.run(fakeSinks[key])
  })
  const effects = main(sources)
  const sinks: Sinks = mapObject<Drivers, Sinks>(drivers, driver => {
    return driver.select(effects)
  })

  keys(sinks).forEach(key => {
    fakeSinks[key].imitate(sinks[key])
  })
}

export function isEffect(eff: EffectsDescriptor): eff is Effect {
  return !!(eff as Effect).effectType
}
