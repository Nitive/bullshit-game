import { init } from 'snabbdom'
import { Driver } from '@eff/core/run'
import xs, { Stream } from 'xstream'
import { VNode } from 'snabbdom/vnode'
import pairwise from 'xstream/extra/pairwise'
import { selectDOMEff, DOMSource, Ref } from './shared'
import fromEvent from 'xstream/extra/fromEvent'

function createRef(id: string, elm$: Stream<Node | undefined>): Ref<Node> {
  return {
    id,
    elm$,
    events(event: string) {
      return elm$
        .filter<Node>((x): x is Node => !!x)
        .map(elm => fromEvent(elm, event))
        .flatten()
    },
  }
}

function runDomEffect(vnode$: Stream<VNode>, node: HTMLElement) {
  const refs: { [refId: string]: Ref<Node> } = {}

  function addHooksForRefs(vnode: VNode): VNode {
    if (vnode.data) {
      const { ref: refId, ...data } = vnode.data

      if (refId) {
        return {
          ...vnode,
          data: {
            ...data,
            hook: {
              insert: vn => {
                refs[refId].elm$.shamefullySendNext(vn.elm || undefined)
              },
              update: vn => {
                refs[refId].elm$.shamefullySendNext(vn.elm || undefined)
              },
              destroy: () => {
                refs[refId].elm$.shamefullySendNext(undefined)
              },
            },
          },
        }
      }
    }
    return vnode
  }

  const vnodeWithRefs$ = vnode$.map(addHooksForRefs)

  const withNode = (vnodeWithRefs$ as Stream<VNode | HTMLElement>).startWith(node)

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

  let refsCounter = 0
  return {
    createRef<T extends Node>(): Ref<T> {
      refsCounter += 1
      const refId = String(refsCounter)
      refs[refId] = createRef(refId, xs.create<T | undefined>().remember())
      return refs[refId] as Ref<T>
    },
  }
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
