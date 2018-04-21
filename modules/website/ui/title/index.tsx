import * as Snabbdom from 'snabbdom-pragma'
import h from '@eff/dom/h'
const styles = require('./style.css')

export function Title(_props: {}, children?: Snabbdom.Children) {
  return (
    h('h1', { props: { className: styles.container } }, children as any)
  )
}
