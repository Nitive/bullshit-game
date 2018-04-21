import xs, { Stream } from 'xstream'
import { EffectsDescriptor, isEffect, Effect } from './run'
import { VNode } from 'snabbdom/vnode'

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
    return (eff as Stream<VNode | Effect | string | Stream<VNode> | Array<VNode>>)
      .map(e => selectEffectByType(effectType, e, reduceSinks))
      .flatten()
  }

  if (Array.isArray(eff)) {
    return (eff as Array<VNode | Effect | string | Stream<VNode>>)
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
