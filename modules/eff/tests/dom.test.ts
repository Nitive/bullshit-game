import { EffectsDescriptor, run } from '../run'
import h from 'snabbdom/h'
import { Stream } from 'xstream'
import { VNode } from 'snabbdom/vnode'
import { makeDomDriver, DOMSource } from '../dom-driver/client'

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
})
