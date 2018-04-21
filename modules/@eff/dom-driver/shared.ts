import { VNode } from 'snabbdom/vnode'
import xs, { Stream } from 'xstream'
import { EffectsDescriptor, isEffect } from '@eff/core/run'

function selectDOMStream(effects: EffectsDescriptor): Stream<VNode | string | Array<VNode | string> | undefined> {
  if (effects instanceof Stream) {
    return effects.map(selectDOMStream).flatten()
  }

  if (Array.isArray(effects)) {
    return xs
      .combine(...effects.map(selectDOMStream))
      .map((children: Array<VNode | VNode[] | string | string[] | undefined>) => {
        return children
          .reduce((acc, child) => {
            return child !== undefined
              ? acc.concat(child)
              : acc
          }, [] as Array<VNode | string>)
      })
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
    const children$ = selectDOMStream(vnode.children) as Stream<Array<VNode | string>>

    return children$
      .map((children): VNode => {
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

export interface Ref<T> {
  id: string,
  elm$: Stream<T | undefined>,
  events(event: string): Stream<Event>,
}

export interface DOMSource {
  createRef<T extends Node>(): Ref<T>
}
