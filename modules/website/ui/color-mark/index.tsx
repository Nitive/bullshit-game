import { h } from '@eff/dom/h'
const styles = require('./style.css')

export function ColorMark(props: { color: string }) {
  return h('div', { props: { className: styles.container }, style: { backgroundColor: props.color } })
}
