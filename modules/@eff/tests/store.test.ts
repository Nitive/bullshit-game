import h from '@eff/dom/h'
import { VNode } from 'snabbdom/vnode'
import xs, { Stream } from 'xstream'
import fromDiagram from 'xstream/extra/fromDiagram'
import { EffectsDescriptor, run } from '@eff/core/run'
import { DOMSource, makeDomDriver } from '@eff/dom/client'
import { StoreSource, makeStoreDriver, storeEff } from '@eff/store'
import { areStreamsEqual, makeMultistepDone } from './test-utils'

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
    const step = makeMultistepDone(2, done)
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
      areStreamsEqual(sources.store, expected).then(step).catch(step)

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

    setTimeout(() => {
      expect(document.body.innerHTML).toBe('<div><span>test</span></div>')
      step()
    })
  })

  it('should merge effects', done => {
    const step = makeMultistepDone(2, done)
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
      areStreamsEqual(sources.store, expected).then(step).catch(step)

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

    setTimeout(() => {
      expect(document.body.innerHTML).toBe('<div><span>test</span></div>')
      step()
    })
  })

  it('streams transposition should work', done => {
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

      return [
        storeEff(xs.from(['inc'])),
        xs.of(storeEff(xs.from(['inc', 'dec']))),
      ]
    }

    run<Sources, Sinks>(app, {
      store: makeStoreDriver<Action, State>(reducer, 0),
    })
  })

})
