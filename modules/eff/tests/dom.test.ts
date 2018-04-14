import h from 'snabbdom/h'
import { VNode } from 'snabbdom/vnode'
import xs, { Stream } from 'xstream'
import { EffectsDescriptor, run } from '../core/run'
import { DOMSource, makeDomDriver } from '../dom-driver/client'

describe('DOM', () => {
  it('should render dom', () => {
    interface Sources {
      DOM: DOMSource,
    }

    interface Sinks {
      DOM: Stream<VNode>
    }

    function app(_sources: Sources): EffectsDescriptor {
      return (
        h('div', [
          h('span', 'test'),
        ])
      )
    }

    document.body.innerHTML = '<div id="app"></div>'

    run<Sources, Sinks>(app, {
      DOM: makeDomDriver('#app'),
    })

    expect(document.body.innerHTML).toBe('<div><span>test</span></div>')
  })

  it('should flat arrays', () => {
    interface Sources {
      DOM: DOMSource,
    }

    interface Sinks {
      DOM: Stream<VNode>
    }

    function app(_sources: Sources): EffectsDescriptor {
      return (
        h('div', [
          [h('span', '1')],
          [[h('span', '2')]],
          [[[h('span', '3')]]],
        ])
      )
    }

    document.body.innerHTML = '<div id="app"></div>'

    run<Sources, Sinks>(app, {
      DOM: makeDomDriver('#app'),
    })

    expect(document.body.innerHTML).toBe('<div><span>1</span><span>2</span><span>3</span></div>')
  })

  it('should flat streams', done => {
    interface Sources {
      DOM: DOMSource,
    }

    interface Sinks {
      DOM: Stream<VNode>
    }

    function app(_sources: Sources): EffectsDescriptor {
      return (
        h('div', [
          h('span', '1'),
          xs.of(h('span', '2')),
        ])
      )
    }

    document.body.innerHTML = '<div id="app"></div>'

    run<Sources, Sinks>(app, {
      DOM: makeDomDriver('#app'),
    })

    setTimeout(() => {
      expect(document.body.innerHTML).toBe('<div><span>1</span><span>2</span></div>')
      done()
    })
  })
})
