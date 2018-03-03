import * as Snabbdom from 'snabbdom-pragma'
import xs from 'xstream'

import { render } from 'renderer'

export default function main() {
  const vdom = <div style={{ color: 'red' }}>The quick brown fox jumps</div>
  const vdom$ = xs.of(vdom)

  return {
    DOM: vdom$
  }
}

const app = document.createElement('div')
document.body.appendChild(app)
render(main().DOM, app)
