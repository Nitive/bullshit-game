import { Router, RouterAction } from 'router'
import { DOMSource } from 'renderer'
import { VNode } from 'snabbdom/vnode'
import { Stream } from 'xstream'

export interface AppSources {
  DOM: DOMSource,
  router: Router,
}

export interface AppSinks {
  DOM: Stream<VNode>,
  router: Stream<RouterAction>,
}
