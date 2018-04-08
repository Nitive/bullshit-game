import { init } from 'snabbdom'
import { Driver } from '../run'
import { Stream } from 'xstream'
import { VNode } from 'snabbdom/vnode'
import pairwise from 'xstream/extra/pairwise'
import { selectDOMEff, DOMSource } from './shared'

function runDomEffect(sink: Stream<VNode>, node: HTMLElement) {
  const withNode = (sink as Stream<VNode | HTMLElement>).startWith(node)

  const patch = init([
    require('snabbdom/modules/class').default,
    require('snabbdom/modules/attributes').default,
    require('snabbdom/modules/props').default,
    require('snabbdom/modules/style').default,
    require('snabbdom/modules/eventlisteners').default,
    require('snabbdom/modules/dataset').default,
  ])

  withNode
    .compose(pairwise)
    .addListener({
      next([prev, next]: [VNode | HTMLElement, VNode]) {
        patch(prev, next)
      },
      error(err) {
        throw new Error(err)
      },
    })

  return {}
}


export function makeDomDriver(selector: string): Driver<Stream<VNode>, DOMSource> {
  const node = document.querySelector(selector)
  if (!(node instanceof HTMLElement)) {
    throw new Error(`Cannot find node with selector ${selector}`)
  }

  return {
    run(sink: Stream<VNode>) {
      return runDomEffect(sink, node)
    },
    select(effects) {
      return selectDOMEff(effects)
    },
  }
}

export { DOMSource } from './shared'
