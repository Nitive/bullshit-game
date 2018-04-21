import { h } from '@eff/dom/h'
import { listLink } from '../../utils/routing'
const styles = require('./style.css')

export function ToList() {
  return h('a', { props: { className: styles.link, href: listLink() } }, '￩ К списку ошибок')
}
