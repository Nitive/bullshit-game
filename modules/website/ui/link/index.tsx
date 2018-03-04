import * as Snabbdom from 'snabbdom-pragma'
import { VNodeData } from 'snabbdom/vnode'
import { cx } from 'utils/classnames'
const styles = require('./style.css')

export function Link(props: VNodeData, children?: Snabbdom.Children) {
  return (
    <a {...props} className={cx(props.className, styles.link)}>{children}</a>
  )
}
