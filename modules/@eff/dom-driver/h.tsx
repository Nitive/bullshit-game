import { h } from 'snabbdom/h'
import { VNode } from 'snabbdom/vnode'
import xs, { Stream } from 'xstream'
import { Component, Element } from './types'

function createHTMLElement<Props>(tag: string, props: Props, children$?: Stream<any>): Stream<VNode> {
  if (children$) {
    return children$
      .map(children => {
        return h(tag, { props }, children)
      })
  }

  return xs.of(h(tag, { props }))
}

function sinksStreamToSinks<Sinks, Sources>(sinksStream: Stream<Sinks>, sources: Sources) {
  const sinks = {}

  Object.keys(sources).map(driver => {
    (sinks as any)[driver] = sinksStream
      .map(sinks => (sinks as any)[driver] || xs.of(undefined))
      .flatten()
  })

  return sinks
}

function getChildren<Sources>(children: any, sources: Sources): { DOM?: Stream<any> } {
  if (children == null || children === false) {
    return {}
  }

  if (['boolean', 'number'].includes(typeof children)) {
    return { DOM: xs.of(children.toString()) }
  }

  if (children instanceof Stream) {
    const chs = children
      .map(c => getChildren(c, sources))

    const res = sinksStreamToSinks(chs, sources)
    return res
  }

  if (Array.isArray(children)) {
    const normalizedChildren = children
      .map(ch => getChildren(ch, sources))

    const domChildren = normalizedChildren.map(c => c.DOM).filter(Boolean) as Stream<any>[]

    const DOM = xs.combine(...domChildren)
      .map(arr => arr.reduce((acc, x) => acc.concat(x), []))

    const effsKeys = Object.keys(sources).filter(x => x !== 'DOM')
    const effs = normalizedChildren.reduce((acc: any, sinks: any) => {
      const newAcc: any = {}
      effsKeys.forEach(driver => {
        if (acc[driver] && sinks[driver]) {
          newAcc[driver] = xs.merge(acc[driver], sinks[driver])
        } else if (acc[driver] || sinks[driver]) {
          newAcc[driver] = acc[driver] || sinks[driver]
        }
      })

      return newAcc
    }, {})

    return { ...effs, DOM }
  }

  if (typeof children === 'function') {
    return getChildren(children(sources), sources)
  }

  if (typeof children === 'object' && children.effectType) {
    return { [children.effectType]: children.sink$ }
  }

  const isVNode = typeof children === 'object' && children.sel
  if (typeof children === 'string' || isVNode) {
    return { DOM: xs.of(children) }
  }

  return children
}

export function createElement<Props, Sources extends { DOM: any }, Sinks extends { DOM: Stream<VNode> }>(
  component: Component<Props, Sources, Sinks> | string,
  _props: Props,
  ..._children: any[]
): Element<Sources, Sinks> {
  return (sources: Sources) => {
    const props = _props || {}
    const { DOM, ...sinks } = getChildren(_children, sources)

    if (typeof component === 'string') {
      return { ...sinks, DOM: createHTMLElement(component, props, DOM) } as Sinks
    }

    if (!DOM) {
      return { ...sinks, ...(component(props, sources)(sources) as any) }
    }

    const sinks$ = DOM
      .map(ch => component(Object.assign(props, { children: ch }), sources)(sources))

    return { ...sinks, ...sinksStreamToSinks<Sinks, Sources>(sinks$, sources) } as Sinks
  }
}
