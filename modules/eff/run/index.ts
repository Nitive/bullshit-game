import xs, { Stream } from 'xstream'
import { mapObject } from '../utils/map-object'
import { VNode } from 'snabbdom/vnode'
import { keys } from '../utils/keys'

export interface Effect {
  effectType: string,
}

export type _EffectsDescriptor = VNode | string | Effect
export type EffectsDescriptor = _EffectsDescriptor | _EffectsDescriptor[]

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

export function selectEffectByType<Eff extends Effect>(
  effectType: string,
  eff: EffectsDescriptor,
  reduce: (acc: Eff, next: Eff) => Eff,
  empty: Eff,
): Eff {
  if (typeof eff === 'string') {
    return empty
  }

  if (isEffect(eff)) {
    return eff.effectType === effectType
      ? eff as Eff
      : empty
  }

  const children: Array<EffectsDescriptor> = Array.isArray(eff) ? eff : eff.children || []

  return children
      .reduce<Eff>(
        (acc: Eff, vn: EffectsDescriptor) => reduce(acc, selectEffectByType(effectType, vn, reduce, empty)),
        empty,
      )
}
