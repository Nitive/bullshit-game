import xs, { Stream } from 'xstream'
import { EffectsDescriptor, isEffect } from './run'

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
