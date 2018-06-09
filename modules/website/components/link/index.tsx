import h from '@eff/dom/h'
import { routerEff } from '@eff/router'
import * as Snabbdom from 'snabbdom-pragma'
import { VNodeData } from 'snabbdom/vnode'
import { Sources } from '../../types'

export function Link(sources: Sources, props: VNodeData, children?: Snabbdom.Children) {
  const linkRef = sources.DOM.createRef<HTMLAnchorElement>()
  console.log(linkRef, linkRef.id)

  const redirect$ = linkRef
    .events('click')
    .debug('click')
    .map(e => {
      e.preventDefault()
    })
    .mapTo(sources.router.push(props.href))
  // const redirect$ = xs.of(sources.router.push('/'))

  return [
    h('a', { ref: linkRef.id, props, on: { click: e => e.preventDefault() } }, children as any),
    routerEff(redirect$),
  ]
}
