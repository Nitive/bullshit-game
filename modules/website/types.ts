import { DOMSource } from '@eff/dom/client'
import { RouterAction, RouterSource } from '@eff/router'
import { VNode } from 'snabbdom/vnode'
import { Stream } from 'xstream'

export interface Sources {
  DOM: DOMSource,
  router: RouterSource,
}

export interface Sinks {
  DOM: Stream<VNode>,
  router: Stream<RouterAction>,
}
