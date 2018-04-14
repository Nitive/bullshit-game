import xs, { Stream } from 'xstream'
import { mapObject } from '../utils/map-object'
import { VNode } from 'snabbdom/vnode'
import { keys } from '../utils/keys'

export interface Effect {
  effectType: string,
  sink$: Stream<any>
}

export type _EffectsDescriptor = VNode | string | Effect
export type EffectsDescriptor = _EffectsDescriptor | _EffectsDescriptor[] | Stream<_EffectsDescriptor>

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

export function selectEffectByType<Sink>(
  effectType: string,
  eff: EffectsDescriptor,
  reduceSinks: (acc: Stream<Sink>, next: Stream<Sink>) => Stream<Sink>,
): Stream<Sink> {
  if (isEffect(eff)) {
    return eff.effectType === effectType ? eff.sink$ : xs.empty()
  }

  if (typeof eff === 'string') {
    return xs.empty()
  }

  if (eff instanceof Stream) {
    return eff.map(e => selectEffectByType(effectType, e, reduceSinks)).flatten()
  }

  if (Array.isArray(eff)) {
    return eff
      .map(e => selectEffectByType(effectType, e, reduceSinks))
      .reduce((acc, x) => reduceSinks(acc, x), xs.empty())
  }

  const vnode = eff

  if (vnode.children) {
    const children$: Stream<Sink> = vnode.children
      .map(e => selectEffectByType(effectType, e, reduceSinks))
      .reduce((acc, x) => reduceSinks(acc, x), xs.empty())

    return children$
  }

  return xs.empty()
}
