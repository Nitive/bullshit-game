import { init } from 'snabbdom'
import { VNode } from 'snabbdom/vnode'
import { Stream } from 'xstream'
import pairwise from 'xstream/extra/pairwise'

const patch = init([
  require('snabbdom/modules/class').default,
  require('snabbdom/modules/props').default,
  require('snabbdom/modules/style').default,
  require('snabbdom/modules/eventlisteners').default,
])

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
