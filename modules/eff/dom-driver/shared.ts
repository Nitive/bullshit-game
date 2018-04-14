import { isEffect, EffectsDescriptor } from '../run'
import { VNode } from 'snabbdom/vnode'
import { flattenDeep } from '../utils/flatten'
import xs, { Stream } from 'xstream'

function selectDOMStream(effects: EffectsDescriptor): Stream<VNode | VNode[] | string | undefined> {
  if (effects instanceof Stream) {
    return effects.map(selectDOMStream).flatten()
  }

  if (Array.isArray(effects)) {
    return xs.combine(...effects.map(selectDOMStream))
  }

  if (typeof effects === 'string') {
    return xs.of(effects)
  }

  if (typeof effects === 'undefined') {
    return xs.of(undefined)
  }

  if (isEffect(effects)) {
    return xs.of(undefined)
  }

  const vnode = effects

  if (vnode.children) {
    const children$ = xs.combine(...vnode.children.map(selectDOMStream))

    return children$
      .map(children => {
        return flattenDeep<VNode>(children)
      })
      .map(children => {
        return {
          ...vnode,
          children,
        }
      })
  }

  return xs.of(vnode)
}

export function selectDOMEff(effects: EffectsDescriptor): Stream<VNode> {
  const vnode$ = selectDOMStream(effects)
  return vnode$
    .map(vnode => {
      if (typeof vnode === 'undefined') {
        throw new Error('Root element can not be undefined')
      }

      if (typeof vnode === 'string') {
        throw new Error('Root element can not be string')
      }

      if (Array.isArray(vnode)) {
        throw new Error('Root element can not be array')
      }

      return vnode
    })
}

export interface DOMSource {
}
