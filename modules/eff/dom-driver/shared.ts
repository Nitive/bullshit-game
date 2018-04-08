import { isEffect, EffectsDescriptor } from '../run'
import { VNode } from 'snabbdom/vnode'
import { flatten } from '../utils/flatten'
import xs, { Stream } from 'xstream'

function selectDOMEffHelper(effects: EffectsDescriptor): VNode[] {
  if (typeof effects === 'string' || isEffect(effects)) {
    return []
  }

  if (Array.isArray(effects)) {
    return flatten(effects.map(selectDOMEffHelper))
  }

  const vnode = effects

  return [{
    ...vnode,
    children: vnode.children && flatten(vnode.children.map(selectDOMEffHelper)),
  }]
}

export function selectDOMEff(effects: EffectsDescriptor): Stream<VNode> {
  const vnode = selectDOMEffHelper(effects)[0]
  return vnode ? xs.of(vnode) : xs.empty()
}

export interface DOMSource {
}
