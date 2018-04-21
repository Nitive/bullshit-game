import * as Snabbdom from 'snabbdom-pragma'
import h from '@eff/dom/h'
const styles = require('./style.css')

export function Page(_props: {}, children?: Snabbdom.Children) {
  return (
    h('div', { props: { className: styles.container } }, children as any)
  )
}
