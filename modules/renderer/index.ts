import { init } from 'snabbdom'
import { VNode } from 'snabbdom/vnode'
import xs, { Stream } from 'xstream'
import pairwise from 'xstream/extra/pairwise'
import fromEvent from 'xstream/extra/fromEvent'

const patch = init([
  require('snabbdom/modules/class').default,
  require('snabbdom/modules/props').default,
  require('snabbdom/modules/style').default,
  require('snabbdom/modules/eventlisteners').default,
])

export interface DOMSource {
  selectEvents<Event>(selector: string, event: string): Stream<Event>
}

export function createDOMSource(): DOMSource {
  return {
    selectEvents<Event>(selector: string, event: string): Stream<Event> {
      const node = document.querySelector(selector)
      return node
        ? fromEvent(node, event)
        : xs.throw(new Error(`Element with selector ${selector} was not found`))
    },
  }
}

export function render(vdom$: Stream<VNode | HTMLElement>, node: HTMLElement) {
  vdom$
    .startWith(node)
    .compose(pairwise)
    .addListener({
      next([prev, next]: [VNode | HTMLElement, VNode]) {
        patch(prev, next)
      },
    })
}
