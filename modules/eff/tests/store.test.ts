import h from 'snabbdom/h'
import { EffectsDescriptor, run } from '../run'
import xs, { Stream } from 'xstream'
import { makeStoreDriver, StoreSource, storeEff } from '../store-driver'
import { areStreamsEqual } from './test-utils'
import fromDiagram from 'xstream/extra/fromDiagram'
import { makeDomDriver, DOMSource } from '../dom-driver/client'
import { VNode } from 'snabbdom/vnode'

describe('store', () => {
  it('store eff should works', done => {
    type Action = 'inc' | 'dec'

    type State = number

    function reducer(state = 0, action: Action): State {
      return state + { inc: +1, dec: -1 }[action]
    }

    interface Sources {
      store: StoreSource<State>
    }

    interface Sinks {
      store: Stream<Action>
    }

    function app(sources: Sources): EffectsDescriptor {
      const expected = fromDiagram('0-1-2-1|', { values: { 0: 0, 1: 1, 2: 2 } })
      areStreamsEqual(sources.store, expected).then(done).catch(done)

      return (
        storeEff(xs.from(['inc', 'inc', 'dec']))
      )
    }

    run<Sources, Sinks>(app, {
      store: makeStoreDriver<Action, State>(reducer, 0),
    })
  })

  it('store eff with vdom should works', done => {
    type Action = 'inc' | 'dec'

    type State = number

    function reducer(state = 0, action: Action): State {
      return state + { inc: +1, dec: -1 }[action]
    }

    interface Sources {
      DOM: DOMSource,
      store: StoreSource<State>
    }

    interface Sinks {
      DOM: Stream<VNode>
      store: Stream<Action>
    }

    function app(sources: Sources): EffectsDescriptor {
      const expected = fromDiagram('0-1-2-1|', { values: { 0: 0, 1: 1, 2: 2 } })
      areStreamsEqual(sources.store, expected).then(done).catch(done)

      return (
        h('div', [
          h('span', 'test'),
          storeEff(xs.from(['inc', 'inc', 'dec'])),
        ])
      )
    }

    document.body.innerHTML = '<div id="app"></div>'

    run<Sources, Sinks>(app, {
      DOM: makeDomDriver('#app'),
      store: makeStoreDriver<Action, State>(reducer, 0),
    })

    expect(document.body.innerHTML).toBe('<div><span>test</span></div>')
  })

  it('should merge effects', done => {
    type Action = 'inc' | 'dec'

    type State = number

    function reducer(state = 0, action: Action): State {
      return state + { inc: +1, dec: -1 }[action]
    }

    interface Sources {
      DOM: DOMSource,
      store: StoreSource<State>
    }

    interface Sinks {
      DOM: Stream<VNode>
      store: Stream<Action>
    }

    function app(sources: Sources): EffectsDescriptor {
      const expected = fromDiagram('0-1-2-1|', { values: { 0: 0, 1: 1, 2: 2 } })
      areStreamsEqual(sources.store, expected).then(done).catch(done)

      return (
        h('div', [
          h('span', 'test'),
          storeEff(xs.of('inc')),
          storeEff(xs.of('inc')),
          storeEff(xs.of('dec')),
        ])
      )
    }

    document.body.innerHTML = '<div id="app"></div>'

    run<Sources, Sinks>(app, {
      DOM: makeDomDriver('#app'),
      store: makeStoreDriver<Action, State>(reducer, 0),
    })

    expect(document.body.innerHTML).toBe('<div><span>test</span></div>')
  })
})
